#!/usr/bin/env python3
"""
Wild Dragons Unified Automation Script

Combines all automation functionality:
- Directory cleanup and setup
- Codebase crawling and analysis
- Data generation (mock and real)
- Pinterest scraping for fantasy art
- TokenTrove crawling with specific keywords (immutable games, marbles games)
- Unsplash integration for additional images
- Interactive tracking and progress monitoring
- Self-improving task organization

This script provides comprehensive automation capabilities for the Wild Dragons NFT Marketplace project.
"""

import os
import json
import requests
import argparse
import random
import time
import shutil
import subprocess
import re
import asyncio
import aiohttp
from datetime import datetime
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, quote_plus
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('unified_automation.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Constants
COLLECTION_COUNT = 5
ITEMS_PER_COLLECTION = 10
RARITY_LEVELS = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"]
ELEMENTS = ["Fire", "Water", "Earth", "Air", "Light", "Dark", "Cosmic", "Nature", "Mechanical"]
COLLECTIONS = [
    {"id": "dragons", "name": "Wild Dragons", "description": "Mythical dragons from another dimension"},
    {"id": "cosmic", "name": "Cosmic Entities", "description": "Beings from the far reaches of space"},
    {"id": "elemental", "name": "Elemental Guardians", "description": "Protectors of the natural forces"},
    {"id": "fantasy", "name": "Fantasy Heroes", "description": "Legendary heroes from ancient tales"},
    {"id": "mythical", "name": "Mythical Creatures", "description": "Creatures from myths and legends"}
]
CHAKRAS = [
    {"name": "root", "frequency_hz": 396, "color": "red", "level_unlock": 1},
    {"name": "sacral", "frequency_hz": 417, "color": "orange", "level_unlock": 2},
    {"name": "solar_plexus", "frequency_hz": 528, "color": "yellow", "level_unlock": 3},
    {"name": "heart", "frequency_hz": 639, "color": "green", "level_unlock": 4},
    {"name": "throat", "frequency_hz": 741, "color": "blue", "level_unlock": 5},
    {"name": "third_eye", "frequency_hz": 852, "color": "indigo", "level_unlock": 6},
    {"name": "crown", "frequency_hz": 963, "color": "violet", "level_unlock": 7}
]
COLORS = {
    "dragons": (255, 0, 0),      # Red
    "cosmic": (128, 0, 255),     # Purple
    "elemental": (0, 255, 0),    # Green
    "fantasy": (255, 255, 0),    # Yellow
    "mythical": (0, 128, 255)    # Blue
}
SIZES = {
    "thumb": 256,
    "preview": 512,
    "full": 800
}

class ImageService:
    """Image service integrating Unsplash and Pexels APIs with caching and fallbacks"""

    def __init__(self):
        self.cache = {}
        self.requests = {}
        self.is_initialized = False

        # Categories for different types of images
        self.categories = {
            "dragons": ["fantasy dragons", "mythical creatures", "dragon artwork"],
            "cosmic": ["cosmic space", "galaxy", "celestial beings"],
            "elemental": ["elemental magic", "natural forces", "elemental guardians"],
            "fantasy": ["fantasy heroes", "legendary warriors", "fantasy characters"],
            "mythical": ["mythical creatures", "legendary beasts", "ancient mythology"]
        }

        # Fallback images
        self.fallback_images = {
            "dragons": "/assets/dragons/dragons_1.png",
            "cosmic": "/assets/cosmic/cosmic_1.png",
            "elemental": "/assets/elemental/elemental_1.png",
            "fantasy": "/assets/fantasy/fantasy_1.png",
            "mythical": "/assets/mythical/mythical_1.png"
        }

        self.load_config()

    def load_config(self):
        """Load API keys and configuration"""
        self.unsplash_key = os.getenv('UNSPLASH_ACCESS_KEY')
        self.pexels_key = os.getenv('PEXELS_API_KEY')

        self.is_demo_mode = not self.unsplash_key and not self.pexels_key
        self.cache_timeout = 24 * 60 * 60  # 24 hours in seconds
        self.cache_enabled = True

        if self.is_demo_mode:
            logger.info("ImageService: Demo mode - using fallback images only")

        self.is_initialized = True

    def get_cache_key(self, query, category, count=1, source="unsplash"):
        """Generate cache key for requests"""
        return f"{source}-{category}-{query}-{count}"

    def is_cache_valid(self, cache_entry):
        """Check if cached data is still valid"""
        if not cache_entry:
            return False
        return time.time() - cache_entry['timestamp'] < self.cache_timeout

    async def get_images(self, category, custom_query=None, count=1):
        """Get images from APIs with fallbacks and caching"""
        if not self.is_initialized:
            self.load_config()

        query = custom_query or self.categories.get(category, ["fantasy art"])[0]
        cache_key = self.get_cache_key(query, category, count)

        # Check cache first
        if self.cache_enabled and cache_key in self.cache:
            cached = self.cache[cache_key]
            if self.is_cache_valid(cached):
                logger.info(f"ImageService: Using cached images for {category}")
                return cached['data']

        # Request deduplication
        if cache_key in self.requests:
            logger.info(f"ImageService: Using pending request for {category}")
            return await self.requests[cache_key]

        # Create request promise
        request_promise = self._fetch_with_fallback(query, category, count)
        self.requests[cache_key] = request_promise

        try:
            result = await request_promise
            if self.cache_enabled and result:
                self.cache[cache_key] = {'data': result, 'timestamp': time.time()}
                logger.info(f"ImageService: Cached {len(result)} images for {category}")
            return result
        except Exception as e:
            logger.warning(f"ImageService: Failed to fetch images for {category}: {e}")
            return [self.get_fallback_image(category)]
        finally:
            del self.requests[cache_key]

    async def _fetch_with_fallback(self, query, category, count):
        """Fetch images with fallback from Unsplash to Pexels"""
        sources = []

        if self.unsplash_key:
            sources.append(("unsplash", self._fetch_unsplash))
        if self.pexels_key:
            sources.append(("pexels", self._fetch_pexels))

        if not sources:
            return [self.get_fallback_image(category)]

        for source_name, fetch_func in sources:
            try:
                logger.info(f"ImageService: Trying {source_name} for {category}")
                images = await fetch_func(query, category, count)
                if images and len(images) > 0:
                    return images
            except Exception as e:
                logger.warning(f"ImageService: {source_name} failed for {category}: {e}")
                continue

        # All sources failed, return fallback
        return [self.get_fallback_image(category)]

    async def _fetch_unsplash(self, query, category, count):
        """Fetch from Unsplash API"""
        url = f"https://api.unsplash.com/search/photos?query={quote_plus(query)}&per_page={count}&orientation=landscape&content_filter=high"

        headers = {
            "Accept-Version": "v1",
            "Authorization": f"Client-ID {self.unsplash_key}"
        }

        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers, timeout=15) as response:
                if not response.status == 200:
                    raise Exception(f"Unsplash API error: {response.status}")

                data = await response.json()

                if not data.get('results'):
                    raise Exception("No Unsplash results found")

                return [self._process_unsplash_image(img, category) for img in data['results'][:count]]

    async def _fetch_pexels(self, query, category, count):
        """Fetch from Pexels API"""
        url = f"https://api.pexels.com/v1/search?query={quote_plus(query)}&per_page={count}&orientation=landscape"

        headers = {"Authorization": self.pexels_key}

        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers, timeout=10) as response:
                if not response.status == 200:
                    raise Exception(f"Pexels API error: {response.status}")

                data = await response.json()

                if not data.get('photos'):
                    raise Exception("No Pexels results found")

                return [self._process_pexels_image(img, category) for img in data['photos'][:count]]

    def _process_unsplash_image(self, image, category):
        """Process Unsplash image data"""
        return {
            'id': f"unsplash-{image['id']}",
            'urls': {
                'thumbnail': image['urls']['thumb'],
                'small': image['urls']['small'],
                'regular': image['urls']['regular'],
                'full': image['urls']['full']
            },
            'alt': image.get('alt_description', f"{category} image"),
            'description': image.get('description', ''),
            'photographer': image['user']['name'],
            'photographer_url': image['user']['links']['html'],
            'category': category,
            'source': 'unsplash',
            'attribution': {
                'photographer': image['user']['name'],
                'photographer_url': image['user']['links']['html'],
                'unsplash_url': image['links']['html'],
                'unsplash_id': image['id']
            }
        }

    def _process_pexels_image(self, photo, category):
        """Process Pexels image data"""
        return {
            'id': f"pexels-{photo['id']}",
            'urls': {
                'thumbnail': photo['src']['small'],
                'small': photo['src']['medium'],
                'regular': photo['src']['large'],
                'full': photo['src']['large2x']
            },
            'alt': photo.get('alt', f"{category} image"),
            'description': photo.get('alt', ''),
            'photographer': photo['photographer'],
            'photographer_url': photo['photographer_url'],
            'category': category,
            'source': 'pexels',
            'attribution': {
                'photographer': photo['photographer'],
                'photographer_url': photo['photographer_url'],
                'pexels_url': f"https://www.pexels.com/photo/{photo['id']}",
                'pexels_id': photo['id']
            }
        }

    def get_fallback_image(self, category):
        """Get fallback image for category"""
        fallback_url = self.fallback_images.get(category, self.fallback_images['dragons'])
        return {
            'id': f"fallback-{category}",
            'urls': {
                'thumbnail': fallback_url,
                'small': fallback_url,
                'regular': fallback_url,
                'full': fallback_url
            },
            'alt': f"{category} fallback image",
            'description': f"Placeholder for {category}",
            'photographer': "Wild Dragons Team",
            'photographer_url': "https://wild-dragons.example.com",
            'category': category,
            'source': 'fallback',
            'is_fallback': True
        }

    def clear_expired_cache(self):
        """Clear expired cache entries"""
        expired_keys = []
        for key, entry in self.cache.items():
            if not self.is_cache_valid(entry):
                expired_keys.append(key)

        for key in expired_keys:
            del self.cache[key]

        if expired_keys:
            logger.info(f"ImageService: Cleared {len(expired_keys)} expired cache entries")

class UnifiedAutomationSystem:
    """Unified automation system combining all functionalities"""

    def __init__(self, base_dir=None):
        self.base_dir = Path(base_dir or os.path.dirname(os.path.abspath(__file__)))
        self.start_time = datetime.now()
        self.tasks_completed = []
        self.tasks_pending = []
        self.progress_file = self.base_dir / "automation_progress.json"

        # Initialize task tracking
        self.load_progress()

        # Initialize image service
        self.image_service = ImageService()

        # HTTP headers for web scraping
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
        }

        logger.info("Unified Automation System initialized")

    def load_progress(self):
        """Load previous progress if exists"""
        if self.progress_file.exists():
            try:
                with open(self.progress_file, 'r') as f:
                    progress = json.load(f)
                    self.tasks_completed = progress.get('completed', [])
                    self.tasks_pending = progress.get('pending', [])
                logger.info(f"Loaded progress: {len(self.tasks_completed)} completed, {len(self.tasks_pending)} pending")
            except Exception as e:
                logger.warning(f"Could not load progress: {e}")

    def save_progress(self):
        """Save current progress"""
        progress = {
            'completed': self.tasks_completed,
            'pending': self.tasks_pending,
            'last_updated': datetime.now().isoformat()
        }
        with open(self.progress_file, 'w') as f:
            json.dump(progress, f, indent=2)

    def mark_task_completed(self, task_name):
        """Mark a task as completed"""
        if task_name not in self.tasks_completed:
            self.tasks_completed.append(task_name)
            self.tasks_pending = [t for t in self.tasks_pending if t != task_name]
            self.save_progress()
            logger.info(f"Task completed: {task_name}")

    def add_task(self, task_name):
        """Add a task to pending list"""
        if task_name not in self.tasks_completed and task_name not in self.tasks_pending:
            self.tasks_pending.append(task_name)
            self.save_progress()
            logger.info(f"Task added: {task_name}")

    def cleanup_directories(self, patterns=None):
        """Clean up directories based on patterns"""
        logger.info("Starting directory cleanup...")

        if patterns is None:
            patterns = [
                "**/__pycache__",
                "**/*.pyc",
                "**/.DS_Store",
                "**/node_modules"  # Be careful with this
            ]

        cleaned_count = 0
        for pattern in patterns:
            for path in self.base_dir.rglob(pattern):
                if path.is_dir():
                    shutil.rmtree(path)
                    logger.info(f"Removed directory: {path}")
                    cleaned_count += 1
                elif path.is_file():
                    path.unlink()
                    logger.info(f"Removed file: {path}")
                    cleaned_count += 1

        self.mark_task_completed("directory_cleanup")
        logger.info(f"Directory cleanup completed. Removed {cleaned_count} items.")

    def setup_directories(self):
        """Create necessary directory structure"""
        logger.info("Setting up directory structure...")

        directories = [
            "data/collections",
            "data/resources",
            "data/raw",
            "assets/pinterest-thumbs",
            "assets/dragons",
            "assets/cosmic",
            "assets/elemental",
            "assets/fantasy",
            "assets/mythical",
            "assets/unsplash",
            "meta",
            "logs"
        ]

        for directory in directories:
            dir_path = self.base_dir / directory
            dir_path.mkdir(parents=True, exist_ok=True)
            logger.info(f"Created directory: {directory}")

        self.mark_task_completed("directory_setup")

    def crawl_codebase(self):
        """Analyze the codebase structure"""
        logger.info("Starting codebase analysis...")

        codebase_info = {
            'python_files': [],
            'vue_files': [],
            'total_lines': 0,
            'functions': [],
            'classes': []
        }

        # Find Python files
        for py_file in self.base_dir.rglob("*.py"):
            if py_file.is_file():
                codebase_info['python_files'].append(str(py_file.relative_to(self.base_dir)))

                try:
                    with open(py_file, 'r', encoding='utf-8') as f:
                        content = f.read()
                        lines = len(content.split('\n'))
                        codebase_info['total_lines'] += lines

                        # Extract functions and classes
                        for line in content.split('\n'):
                            line = line.strip()
                            if line.startswith('def '):
                                func_match = re.match(r'def (\w+)', line)
                                if func_match:
                                    codebase_info['functions'].append(f"{py_file.name}:{func_match.group(1)}")
                            elif line.startswith('class '):
                                class_match = re.match(r'class (\w+)', line)
                                if class_match:
                                    codebase_info['classes'].append(f"{py_file.name}:{class_match.group(1)}")
                except Exception as e:
                    logger.warning(f"Could not analyze {py_file}: {e}")

        # Find Vue files
        for vue_file in self.base_dir.rglob("*.vue"):
            if vue_file.is_file():
                codebase_info['vue_files'].append(str(vue_file.relative_to(self.base_dir)))

        # Save analysis
        analysis_file = self.base_dir / "meta" / "codebase_analysis.json"
        with open(analysis_file, 'w') as f:
            json.dump(codebase_info, f, indent=2)

        self.mark_task_completed("codebase_crawling")
        logger.info(f"Codebase analysis completed. Found {len(codebase_info['python_files'])} Python files, {len(codebase_info['vue_files'])} Vue files")

    def generate_mock_data(self):
        """Generate mock NFT data"""
        logger.info("Generating mock NFT data...")

        collections_data = {}
        all_nfts = []

        collections = COLLECTIONS[:COLLECTION_COUNT]

        for collection in collections:
            nfts = [self._generate_nft(collection, i+1) for i in range(ITEMS_PER_COLLECTION)]

            collection_path = self.base_dir / "data" / "collections" / f"{collection['id']}.json"
            with open(collection_path, 'w') as f:
                json.dump(nfts, f, indent=2)

            collections_data[collection["id"]] = {
                "name": collection["name"],
                "item_count": len(nfts),
                "description": collection["description"],
                "file_path": f"/data/collections/{collection['id']}.json"
            }

            all_nfts.extend(nfts)

        # Create master index
        master_index = {
            "version": "1.0.0",
            "generated_at": datetime.now().isoformat(),
            "collection_count": len(collections),
            "total_items": len(all_nfts),
            "collections": collections_data
        }

        index_file = self.base_dir / "meta" / "index.json"
        with open(index_file, 'w') as f:
            json.dump(master_index, f, indent=2)

        self.mark_task_completed("data_generation")
        logger.info(f"Generated mock data for {len(collections)} collections with {len(all_nfts)} total NFTs")

    def _generate_nft(self, collection, index):
        """Generate a single NFT item"""
        element = random.choice(ELEMENTS)
        rarity = random.choices(RARITY_LEVELS, weights=[50, 30, 15, 10, 3, 1])[0]
        chakra = random.choice(CHAKRAS)
        power = random.randint(30, 100)
        rarity_boost = RARITY_LEVELS.index(rarity) * 10
        power = min(100, power + rarity_boost)

        return {
            "id": f"{collection['id']}_{index}",
            "name": f"{element} {collection['name']} #{index}",
            "collection": collection["name"],
            "description": f"A powerful {rarity.lower()} {element.lower()} from the {collection['name']} collection. {collection['description']}.",
            "image": {
                "thumbnail": f"/assets/{collection['id']}/{collection['id']}_{index}_thumb.png",
                "preview": f"/assets/{collection['id']}/{collection['id']}_{index}_preview.png",
                "full": f"/assets/{collection['id']}/{collection['id']}_{index}.png"
            },
            "traits": {
                "rarity": rarity,
                "element": element,
                "power": power
            },
            "spiritual": {
                "chakra": chakra["name"],
                "frequency_hz": chakra["frequency_hz"],
                "color": chakra["color"],
                "level_unlock": chakra["level_unlock"]
            },
            "price": {
                "listed": self._generate_random_price(),
                "floor": self._generate_random_price(),
                "last_sale": self._generate_random_price()
            },
            "external_url": f"https://example.com/nft/{collection['id']}/{index}",
            "created_at": datetime.now().isoformat()
        }

    def _generate_random_price(self):
        """Generate random ETH price string"""
        price = random.uniform(0.1, 5.0)
        return f"{price:.2f} ETH"

    def scrape_pinterest(self, limit_per_category=20):
        """Scrape Pinterest for fantasy artwork"""
        logger.info("Starting Pinterest scraping...")

        categories = {
            "fire": "fire fantasy art dragons",
            "water": "water fantasy art dragons sea creatures",
            "earth": "earth fantasy art dragons mountains",
            "air": "air fantasy art dragons sky",
            "light": "light fantasy art angels celestial",
            "dark": "dark fantasy art dragons demons",
            "cosmic": "cosmic fantasy art space dragons",
            "nature": "nature fantasy art creatures",
            "mechanical": "mechanical fantasy art steampunk dragons"
        }

        results = {"total_images": 0, "categories": {}}

        for category, query in categories.items():
            logger.info(f"Scraping category: {category}")
            images = self._search_pinterest(query, limit_per_category)
            downloaded = []

            for i, image_info in enumerate(images):
                if len(downloaded) >= limit_per_category:
                    break

                local_path = self._download_image(image_info, category)
                if local_path:
                    downloaded.append({
                        "local_path": local_path,
                        "original_url": image_info['url'],
                        "pin_id": image_info.get('pin_id'),
                        "description": image_info.get('alt', '')
                    })

                time.sleep(2)  # Rate limiting

            results["categories"][category] = {
                "query": query,
                "downloaded": len(downloaded),
                "images": downloaded
            }
            results["total_images"] += len(downloaded)

            # Save category metadata
            metadata_file = self.base_dir / "assets" / "pinterest-thumbs" / f"{category}_metadata.json"
            with open(metadata_file, 'w') as f:
                json.dump(results["categories"][category], f, indent=2)

        # Save overall results
        results_file = self.base_dir / "assets" / "pinterest-thumbs" / "scraper_results.json"
        with open(results_file, 'w') as f:
            json.dump(results, f, indent=2)

        self.mark_task_completed("pinterest_scraping")
        logger.info(f"Pinterest scraping completed. Downloaded {results['total_images']} images.")

    def _search_pinterest(self, query, limit=50):
        """Search Pinterest for images"""
        search_url = f"https://www.pinterest.com/search/pins/?q={quote_plus(query)}"

        try:
            response = requests.get(search_url, headers=self.headers, timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, 'html.parser')
            image_elements = soup.select('img[src*="pinimg"]')[:limit]

            images = []
            for img in image_elements:
                image_url = img.get('src')
                if not image_url:
                    continue

                if "236x" in image_url:
                    image_url = image_url.replace("236x", "736x")

                pin_id = None
                parent_a = img.find_parent('a')
                if parent_a and 'href' in parent_a.attrs:
                    pin_url = parent_a['href']
                    if '/pin/' in pin_url:
                        pin_id = pin_url.split('/pin/')[1].split('/')[0]

                images.append({
                    'url': image_url,
                    'pin_id': pin_id,
                    'query': query,
                    'alt': img.get('alt', '')
                })

            return images
        except Exception as e:
            logger.error(f"Error searching Pinterest: {e}")
            return []

    def _download_image(self, image_info, category):
        """Download an image from Pinterest"""
        try:
            image_url = image_info['url']
            filename = f"{image_info.get('pin_id', str(int(time.time())))}_{random.randint(1000, 9999)}.jpg"
            save_path = self.base_dir / "assets" / "pinterest-thumbs" / category / filename

            if save_path.exists():
                return str(save_path.relative_to(self.base_dir))

            response = requests.get(image_url, headers=self.headers, timeout=10)
            response.raise_for_status()

            with open(save_path, 'wb') as f:
                f.write(response.content)

            logger.info(f"Downloaded: {save_path}")
            return str(save_path.relative_to(self.base_dir))

        except Exception as e:
            logger.error(f"Error downloading image: {e}")
            return None

    def crawl_tokentrove(self, keywords=None, limit=50):
        """Crawl TokenTrove with specific keywords"""
        logger.info("Starting TokenTrove crawling...")

        if keywords is None:
            keywords = ["immutable games", "marbles games"]

        all_items = []

        for keyword in keywords:
            logger.info(f"Searching TokenTrove for: {keyword}")
            items = self._search_tokentrove(keyword, limit)
            all_items.extend(items)
            time.sleep(3)  # Rate limiting

        # Save results
        results_file = self.base_dir / "data" / "raw" / "tokentrove_results.json"
        with open(results_file, 'w') as f:
            json.dump(all_items, f, indent=2)

        self.mark_task_completed("tokentrove_crawling")
        logger.info(f"TokenTrove crawling completed. Found {len(all_items)} items.")

    def _search_tokentrove(self, keyword, limit=50):
        """Search TokenTrove for specific keyword"""
        base_url = "https://tokentrove.com"
        search_url = f"{base_url}/search?q={quote_plus(keyword)}"

        try:
            response = requests.get(search_url, headers=self.headers, timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, 'html.parser')
            item_elements = soup.select('.nft-card')[:limit]

            items = []
            for element in item_elements:
                try:
                    name_elem = element.select_one('.nft-name')
                    price_elem = element.select_one('.price-value')
                    image_elem = element.select_one('img')
                    link_elem = element.select_one('a')

                    if name_elem and link_elem:
                        item_url = urljoin(base_url, link_elem.get('href'))
                        item_id = item_url.split('/')[-1]

                        item = {
                            'id': item_id,
                            'name': name_elem.text.strip(),
                            'keyword': keyword,
                            'external_url': item_url,
                            'price': {
                                'listed': price_elem.text.strip() if price_elem else None,
                            }
                        }

                        if image_elem and image_elem.get('src'):
                            item['image_url'] = image_elem.get('src')

                        # Get detailed info
                        detailed_info = self._get_tokentrove_details(item_url)
                        if detailed_info:
                            item.update(detailed_info)

                        items.append(item)
                        time.sleep(1)  # Rate limiting

                except Exception as e:
                    logger.warning(f"Error processing TokenTrove item: {e}")

            return items
        except Exception as e:
            logger.error(f"Error searching TokenTrove: {e}")
            return []

    def _get_tokentrove_details(self, item_url):
        """Get detailed information from TokenTrove item page"""
        try:
            response = requests.get(item_url, headers=self.headers, timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, 'html.parser')

            description_elem = soup.select_one('.nft-description')
            description = description_elem.text.strip() if description_elem else ""

            trait_elements = soup.select('.trait-card')
            traits = {}

            for trait_elem in trait_elements:
                trait_type_elem = trait_elem.select_one('.trait-type')
                trait_value_elem = trait_elem.select_one('.trait-value')

                if trait_type_elem and trait_value_elem:
                    trait_type = trait_type_elem.text.strip()
                    trait_value = trait_value_elem.text.strip()
                    traits[trait_type.lower()] = trait_value

            return {
                'description': description,
                'traits': traits
            }
        except Exception as e:
            logger.warning(f"Error getting TokenTrove details: {e}")
            return {}

    def integrate_image_service(self, categories=None, limit_per_category=10):
        """Integrate image service with Unsplash and Pexels APIs"""
        logger.info("Starting image service integration...")

        if categories is None:
            categories = ["dragons", "cosmic", "elemental", "fantasy", "mythical"]

        results = {"total_images": 0, "categories": {}}

        # Run async image fetching
        async def fetch_all_images():
            tasks = []
            for category in categories:
                task = self.image_service.get_images(category, count=limit_per_category)
                tasks.append((category, task))

            for category, task in tasks:
                try:
                    logger.info(f"Fetching images for category: {category}")
                    images = await task
                    downloaded = []

                    for image_info in images:
                        local_path = await self._download_image_async(image_info, category)
                        if local_path:
                            downloaded.append({
                                "local_path": local_path,
                                "original_url": image_info['urls']['regular'],
                                "image_id": image_info['id'],
                                "source": image_info.get('source', 'unknown'),
                                "description": image_info.get('description', ''),
                                "photographer": image_info.get('photographer', ''),
                                "attribution": image_info.get('attribution', {})
                            })

                    results["categories"][category] = {
                        "downloaded": len(downloaded),
                        "images": downloaded
                    }
                    results["total_images"] += len(downloaded)

                except Exception as e:
                    logger.error(f"Failed to fetch images for {category}: {e}")
                    results["categories"][category] = {"downloaded": 0, "images": []}

        # Run the async function
        asyncio.run(fetch_all_images())

        # Save results
        results_file = self.base_dir / "assets" / "image_service" / "image_service_results.json"
        results_file.parent.mkdir(exist_ok=True)
        with open(results_file, 'w') as f:
            json.dump(results, f, indent=2)

        self.mark_task_completed("image_service_integration")
        logger.info(f"Image service integration completed. Downloaded {results['total_images']} images.")

    def _search_unsplash(self, query, access_key, limit=10):
        """Search Unsplash API"""
        url = f"https://api.unsplash.com/search/photos?query={quote_plus(query)}&per_page={limit}"
        headers = {"Authorization": f"Client-ID {access_key}"}

        try:
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()

            data = response.json()
            images = []

            for photo in data.get('results', []):
                images.append({
                    'id': photo['id'],
                    'url': photo['urls']['regular'],
                    'description': photo.get('description', ''),
                    'alt_description': photo.get('alt_description', '')
                })

            return images
        except Exception as e:
            logger.error(f"Error searching Unsplash: {e}")
            return []

    async def _download_image_async(self, image_info, category):
        """Download image asynchronously"""
        try:
            image_url = image_info['urls']['regular']
            filename = f"{image_info['id']}.jpg"
            save_path = self.base_dir / "assets" / "image_service" / category / filename
            save_path.parent.mkdir(parents=True, exist_ok=True)

            if save_path.exists():
                return str(save_path.relative_to(self.base_dir))

            async with aiohttp.ClientSession() as session:
                async with session.get(image_url, timeout=15) as response:
                    if response.status != 200:
                        raise Exception(f"HTTP {response.status}")

                    content = await response.read()

                    with open(save_path, 'wb') as f:
                        f.write(content)

            logger.info(f"Downloaded {image_info.get('source', 'unknown')} image: {save_path}")
            return str(save_path.relative_to(self.base_dir))

        except Exception as e:
            logger.error(f"Error downloading image {image_info['id']}: {e}")
            return None

    def _download_unsplash_image(self, image_info, query):
        """Download image from Unsplash (legacy method)"""
        try:
            image_url = image_info['url']
            filename = f"{image_info['id']}.jpg"
            save_path = self.base_dir / "assets" / "unsplash" / query.replace(' ', '_') / filename
            save_path.parent.mkdir(parents=True, exist_ok=True)

            if save_path.exists():
                return str(save_path.relative_to(self.base_dir))

            response = requests.get(image_url, timeout=10)
            response.raise_for_status()

            with open(save_path, 'wb') as f:
                f.write(response.content)

            logger.info(f"Downloaded Unsplash image: {save_path}")
            return str(save_path.relative_to(self.base_dir))

        except Exception as e:
            logger.error(f"Error downloading Unsplash image: {e}")
            return None

    def create_placeholder_images(self):
        """Create placeholder images for collections"""
        logger.info("Creating placeholder images...")

        for collection_id in [c["id"] for c in COLLECTIONS[:COLLECTION_COUNT]]:
            logger.info(f"Generating images for collection: {collection_id}")

            for index in range(1, ITEMS_PER_COLLECTION + 1):
                for size_name, size in SIZES.items():
                    self._create_placeholder_image(collection_id, index, size_name, size)

        self.mark_task_completed("image_generation")
        logger.info("Placeholder image generation completed!")

    def _create_placeholder_image(self, collection, index, size_name, size):
        """Create a placeholder image"""
        collection_dir = self.base_dir / "assets" / collection
        collection_dir.mkdir(exist_ok=True)

        base_color = COLORS.get(collection, (200, 200, 200))
        color = (
            max(0, min(255, base_color[0] + random.randint(-30, 30))),
            max(0, min(255, base_color[1] + random.randint(-30, 30))),
            max(0, min(255, base_color[2] + random.randint(-30, 30)))
        )

        img = Image.new('RGB', (size, size), color)
        draw = ImageDraw.Draw(img)

        # Add pattern
        for i in range(0, size, 20):
            line_color = (
                max(0, min(255, color[0] + random.randint(-50, 50))),
                max(0, min(255, color[1] + random.randint(-50, 50))),
                max(0, min(255, color[2] + random.randint(-50, 50)))
            )
            draw.line([(0, i), (size, i)], fill=line_color, width=1)
            draw.line([(i, 0), (i, size)], fill=line_color, width=1)

        # Add text
        text_color = (255, 255, 255)
        text = f"{collection} #{index}"

        try:
            font_size = size // 10
            font = ImageFont.truetype("arial.ttf", font_size)
            bbox = draw.textbbox((0, 0), text, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            position = ((size - text_width) // 2, (size - text_height) // 2)
            draw.text(position, text, font=font, fill=text_color)
        except Exception:
            draw.text((size//10, size//2), text, fill=text_color)

        filename = f"{collection}_{index}"
        if size_name != "full":
            filename += f"_{size_name}"
        filename += ".png"

        output_path = collection_dir / filename
        img.save(output_path)
        logger.info(f"Created {output_path}")

    def process_images(self):
        """Process downloaded images"""
        logger.info("Processing images...")

        # Process Pinterest images
        pinterest_dir = self.base_dir / "assets" / "pinterest-thumbs"
        if pinterest_dir.exists():
            for category_dir in pinterest_dir.iterdir():
                if category_dir.is_dir():
                    self._process_category_images(category_dir)

        self.mark_task_completed("image_processing")
        logger.info("Image processing completed!")

    def _process_category_images(self, category_dir):
        """Process images in a category directory"""
        output_dir = self.base_dir / "assets" / category_dir.name
        output_dir.mkdir(exist_ok=True)

        for img_file in category_dir.glob("*"):
            if img_file.suffix.lower() in ['.jpg', '.jpeg', '.png']:
                try:
                    img = Image.open(img_file)
                    if img.mode == 'RGBA':
                        background = Image.new('RGB', img.size, (0, 0, 0))
                        background.paste(img, mask=img.split()[3])
                        img = background

                    # Create thumbnail
                    thumb = img.copy()
                    thumb.thumbnail((256, 256))
                    thumb_path = output_dir / f"{img_file.stem}_thumb.png"
                    thumb.save(thumb_path, "PNG")

                    # Create preview
                    preview = img.copy()
                    preview.thumbnail((512, 512))
                    preview_path = output_dir / f"{img_file.stem}_preview.png"
                    preview.save(preview_path, "PNG")

                    # Save full size
                    full_path = output_dir / f"{img_file.stem}.png"
                    img.save(full_path, "PNG")

                except Exception as e:
                    logger.error(f"Error processing {img_file}: {e}")

    def interactive_tracking(self):
        """Interactive progress tracking and reporting"""
        logger.info("Generating interactive progress report...")

        report = {
            "timestamp": datetime.now().isoformat(),
            "tasks_completed": self.tasks_completed,
            "tasks_pending": self.tasks_pending,
            "completion_rate": len(self.tasks_completed) / (len(self.tasks_completed) + len(self.tasks_pending)) * 100 if self.tasks_pending else 100,
            "execution_time": str(datetime.now() - self.start_time),
            "system_info": {
                "python_version": f"{os.sys.version_info.major}.{os.sys.version_info.minor}.{os.sys.version_info.micro}",
                "platform": os.sys.platform,
                "working_directory": str(self.base_dir)
            }
        }

        # Add file counts
        report["file_counts"] = {
            "python_files": len(list(self.base_dir.rglob("*.py"))),
            "vue_files": len(list(self.base_dir.rglob("*.vue"))),
            "json_files": len(list(self.base_dir.rglob("*.json"))),
            "image_files": len(list(self.base_dir.rglob("*.png"))) + len(list(self.base_dir.rglob("*.jpg")))
        }

        # Save report
        report_file = self.base_dir / "automation_report.json"
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)

        # Print summary
        print("\n" + "="*50)
        print("UNIFIED AUTOMATION SYSTEM REPORT")
        print("="*50)
        print(f"Completed Tasks: {len(self.tasks_completed)}")
        print(f"Pending Tasks: {len(self.tasks_pending)}")
        print(".1f")
        print(f"Execution Time: {report['execution_time']}")
        print(f"Files Generated: {sum(report['file_counts'].values())}")
        print("="*50)

        self.mark_task_completed("interactive_tracking")

    def self_improve(self):
        """Self-improving functionality - analyze and suggest improvements"""
        logger.info("Running self-improvement analysis...")

        improvements = []

        # Check for missing dependencies
        try:
            import requests
            import PIL
            import bs4
        except ImportError as e:
            improvements.append(f"Missing dependency: {e}")

        # Check for API keys
        if not os.getenv('UNSPLASH_ACCESS_KEY'):
            improvements.append("UNSPLASH_ACCESS_KEY environment variable not set")

        # Analyze code quality
        python_files = list(self.base_dir.rglob("*.py"))
        total_lines = 0
        functions_count = 0
        classes_count = 0

        for py_file in python_files:
            try:
                with open(py_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    total_lines += len(content.split('\n'))

                    for line in content.split('\n'):
                        line = line.strip()
                        if line.startswith('def '):
                            functions_count += 1
                        elif line.startswith('class '):
                            classes_count += 1
            except:
                pass

        improvements.append(f"Codebase stats: {len(python_files)} files, {total_lines} lines, {functions_count} functions, {classes_count} classes")

        # Suggest optimizations
        if total_lines > 10000:
            improvements.append("Consider breaking down large files into smaller modules")
        if functions_count > 500:
            improvements.append("Consider organizing functions into classes or separate files")

        # Save improvements
        improvement_file = self.base_dir / "self_improvement_suggestions.json"
        with open(improvement_file, 'w') as f:
            json.dump({
                "timestamp": datetime.now().isoformat(),
                "suggestions": improvements
            }, f, indent=2)

        logger.info(f"Self-improvement analysis completed. {len(improvements)} suggestions generated.")

    def run_full_automation(self):
        """Run the complete automation suite"""
        logger.info("Starting full automation suite...")

        # Define task sequence
        tasks = [
            ("directory_cleanup", self.cleanup_directories),
            ("directory_setup", self.setup_directories),
            ("codebase_crawling", self.crawl_codebase),
            ("data_generation", self.generate_mock_data),
            ("pinterest_scraping", self.scrape_pinterest),
            ("tokentrove_crawling", self.crawl_tokentrove),
            ("image_service_integration", self.integrate_image_service),
            ("image_generation", self.create_placeholder_images),
            ("image_processing", self.process_images),
            ("interactive_tracking", self.interactive_tracking),
            ("self_improvement", self.self_improve)
        ]

        for task_name, task_func in tasks:
            try:
                logger.info(f"Executing task: {task_name}")
                task_func()
            except Exception as e:
                logger.error(f"Task {task_name} failed: {e}")
                self.add_task(f"fix_{task_name}")

        logger.info("Full automation suite completed!")

def main():
    parser = argparse.ArgumentParser(description='Wild Dragons Unified Automation Script')
    parser.add_argument('--mode', choices=['full', 'cleanup', 'setup', 'crawl', 'generate', 'scrape', 'images'],
                       default='full', help='Automation mode')
    parser.add_argument('--skip-pinterest', action='store_true', help='Skip Pinterest scraping')
    parser.add_argument('--skip-tokentrove', action='store_true', help='Skip TokenTrove crawling')
    parser.add_argument('--skip-unsplash', action='store_true', help='Skip Unsplash integration')

    args = parser.parse_args()

    system = UnifiedAutomationSystem()

    if args.mode == 'full':
        system.run_full_automation()
    elif args.mode == 'cleanup':
        system.cleanup_directories()
    elif args.mode == 'setup':
        system.setup_directories()
    elif args.mode == 'crawl':
        system.crawl_codebase()
    elif args.mode == 'generate':
        system.generate_mock_data()
        system.create_placeholder_images()
    elif args.mode == 'scrape':
        if not args.skip_pinterest:
            system.scrape_pinterest()
        if not args.skip_tokentrove:
            system.crawl_tokentrove()
        if not args.skip_unsplash:
            system.integrate_image_service()
    elif args.mode == 'images':
        system.process_images()

    system.interactive_tracking()

if __name__ == "__main__":
    main()