import os
import json
import time
import argparse
import random
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

class PinterestScraper:
    """
    A scraper for extracting fantasy artwork from Pinterest.
    """
    
    def __init__(self, output_dir="assets/pinterest-thumbs", delay=2):
        """
        Initialize the Pinterest scraper.
        
        Args:
            output_dir (str): Directory to save downloaded images
            delay (int): Delay between requests in seconds
        """
        self.base_url = "https://www.pinterest.com"
        self.output_dir = output_dir
        self.delay = delay
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
        }
        
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        # Image categories based on elements/themes
        self.categories = {
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
        
        # Create category directories
        for category in self.categories.keys():
            os.makedirs(os.path.join(output_dir, category), exist_ok=True)
    
    def search_pinterest(self, query, limit=50):
        """
        Search Pinterest for images matching the query.
        
        Args:
            query (str): Search query
            limit (int): Maximum number of results to return
            
        Returns:
            list: Image URLs and metadata
        """
        print(f"Searching Pinterest for: {query}")
        
        # Pinterest search URL
        search_url = f"{self.base_url}/search/pins/?q={query.replace(' ', '+')}"
        
        response = requests.get(search_url, headers=self.headers)
        
        if response.status_code != 200:
            print(f"Failed to search Pinterest: {response.status_code}")
            return []
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Look for image elements
        # Note: Pinterest uses JavaScript for loading, so this basic approach
        # might not get all images. For production, consider using Selenium.
        image_elements = soup.select('img[src*="pinimg"]')[:limit]
        
        images = []
        for img in image_elements:
            try:
                image_url = img.get('src')
                if not image_url:
                    continue
                    
                # Get high-resolution version if available
                if "236x" in image_url:
                    image_url = image_url.replace("236x", "736x")
                    
                # Get pin URL if possible
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
                
            except Exception as e:
                print(f"Error processing image: {e}")
        
        print(f"Found {len(images)} images for query: {query}")
        return images
    
    def download_image(self, image_info, category):
        """
        Download an image from Pinterest.
        
        Args:
            image_info (dict): Image information including URL
            category (str): Image category for organization
            
        Returns:
            str: Local path to downloaded image
        """
        try:
            image_url = image_info['url']
            
            # Create filename from pin ID or random number
            if image_info.get('pin_id'):
                filename = f"{image_info['pin_id']}.jpg"
            else:
                # Parse filename from URL or generate random one
                parsed_url = urlparse(image_url)
                path = parsed_url.path
                filename = os.path.basename(path)
                
                if not filename or len(filename) < 5:
                    filename = f"pinterest_{int(time.time())}_{random.randint(1000, 9999)}.jpg"
            
            # Full save path
            save_path = os.path.join(self.output_dir, category, filename)
            
            # Check if file already exists
            if os.path.exists(save_path):
                print(f"Image already exists: {save_path}")
                return save_path
            
            # Download the image
            response = requests.get(image_url, headers=self.headers)
            
            if response.status_code != 200:
                print(f"Failed to download image: {response.status_code}")
                return None
            
            # Save the image
            with open(save_path, 'wb') as f:
                f.write(response.content)
            
            print(f"Downloaded: {save_path}")
            return save_path
            
        except Exception as e:
            print(f"Error downloading image: {e}")
            return None
    
    def run(self, limit_per_category=20, specific_categories=None):
        """
        Run the Pinterest scraper for all categories.
        
        Args:
            limit_per_category (int): Maximum images per category
            specific_categories (list): Specific categories to scrape
            
        Returns:
            dict: Summary of downloaded images by category
        """
        print("Starting Pinterest image scraper...")
        
        result = {
            "total_images": 0,
            "categories": {}
        }
        
        categories_to_scrape = specific_categories or self.categories.keys()
        
        for category in categories_to_scrape:
            if category not in self.categories:
                print(f"Unknown category: {category}")
                continue
                
            query = self.categories[category]
            images = self.search_pinterest(query, limit=limit_per_category * 2)  # Get extra to account for failures
            
            downloaded = []
            for i, image_info in enumerate(images):
                if len(downloaded) >= limit_per_category:
                    break
                
                local_path = self.download_image(image_info, category)
                if local_path:
                    downloaded.append({
                        "local_path": local_path,
                        "original_url": image_info['url'],
                        "pin_id": image_info.get('pin_id'),
                        "description": image_info.get('alt', '')
                    })
                
                # Respect the site's rate limits
                time.sleep(self.delay)
            
            result["categories"][category] = {
                "query": query,
                "downloaded": len(downloaded),
                "images": downloaded
            }
            
            result["total_images"] += len(downloaded)
            
            # Save category metadata
            with open(os.path.join(self.output_dir, f"{category}_metadata.json"), 'w') as f:
                json.dump(result["categories"][category], f, indent=2)
                
            print(f"Downloaded {len(downloaded)} images for category: {category}")
            
            # Respect the site's rate limits between categories
            time.sleep(self.delay * 2)
        
        # Save overall metadata
        with open(os.path.join(self.output_dir, "scraper_results.json"), 'w') as f:
            json.dump(result, f, indent=2)
            
        print(f"Scraping complete! Downloaded {result['total_images']} images across {len(result['categories'])} categories.")
        return result

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Scrape fantasy artwork from Pinterest')
    parser.add_argument('--output', type=str, default='assets/pinterest-thumbs', help='Output directory')
    parser.add_argument('--limit', type=int, default=20, help='Images per category')
    parser.add_argument('--delay', type=float, default=2.0, help='Delay between requests in seconds')
    parser.add_argument('--categories', type=str, nargs='+', help='Specific categories to scrape')
    
    args = parser.parse_args()
    
    scraper = PinterestScraper(output_dir=args.output, delay=args.delay)
    scraper.run(limit_per_category=args.limit, specific_categories=args.categories)
