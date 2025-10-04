#!/usr/bin/env python3
"""
Wild Dragons Unified Crawler

Consolidates functionality from:
- execute_crawler.py
- data_crawler.py
- mock_data_generator.py

Provides a complete solution for data generation and collection.
"""

import os
import json
import argparse
import random
import requests
from bs4 import BeautifulSoup
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import time
from datetime import datetime
import shutil
from urllib.parse import urljoin, urlparse

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

class WildDragonsCrawler:
    """Unified crawler for Wild Dragons NFT Marketplace"""
    
    def __init__(self, base_dir=None):
        """Initialize with the project base directory"""
        self.base_dir = base_dir or os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.start_time = datetime.now()
        self.log_file = os.path.join(self.base_dir, "crawler_execution.log")
        
    def log(self, message):
        """Log a message to both console and log file"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_message = f"[{timestamp}] {message}"
        print(log_message)
        
        with open(self.log_file, "a") as f:
            f.write(log_message + "\n")
    
    def setup_directories(self):
        """Create the necessary directory structure"""
        self.log("Setting up directory structure...")
        
        directories = [
            "data/raw",
            "data/collections",
            "data/resources",
            "assets/pinterest-thumbs",
            "assets/dragons",
            "assets/cosmic",
            "assets/elemental",
            "assets/fantasy", 
            "assets/mythical",
            "meta"
        ]
        
        for directory in directories:
            dir_path = os.path.join(self.base_dir, directory)
            os.makedirs(dir_path, exist_ok=True)
            self.log(f"Created directory: {directory}")
            
        return True
    
    def generate_random_price(self):
        """Generate random ETH price string"""
        price = random.uniform(0.1, 5.0)
        return f"{price:.2f} ETH"

    def generate_nft(self, collection, index):
        """Generate a single NFT item"""
        element = random.choice(ELEMENTS)
        rarity = random.choices(RARITY_LEVELS, weights=[50, 30, 15, 10, 3, 1])[0]
        chakra = random.choice(CHAKRAS)
        power = random.randint(30, 100) 
        
        # Make power value correlate with rarity
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
                "listed": self.generate_random_price(),
                "floor": self.generate_random_price(),
                "last_sale": self.generate_random_price()
            },
            "external_url": f"https://example.com/nft/{collection['id']}/{index}",
            "created_at": datetime.now().isoformat()
        }

    def generate_mock_data(self):
        """Generate mock data for Wild Dragons NFT Marketplace"""
        self.log("Generating mock NFT data...")
        
        # Create directory structure
        collections_dir = os.path.join(self.base_dir, "data", "collections")
        meta_dir = os.path.join(self.base_dir, "meta")
        os.makedirs(collections_dir, exist_ok=True)
        os.makedirs(meta_dir, exist_ok=True)
        
        collections_data = {}
        all_nfts = []
        
        # Use pre-defined collections
        collections = COLLECTIONS[:COLLECTION_COUNT]
        
        # Generate data for each collection
        for collection in collections:
            nfts = [self.generate_nft(collection, i+1) for i in range(ITEMS_PER_COLLECTION)]
            
            # Save collection data
            collection_path = os.path.join(collections_dir, f"{collection['id']}.json")
            with open(collection_path, "w") as f:
                json.dump(nfts, f, indent=2)
                
            # Add to master collection
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
        
        with open(os.path.join(meta_dir, "index.json"), "w") as f:
            json.dump(master_index, f, indent=2)
            
        self.log(f"Generated mock data for {len(collections)} collections with {len(all_nfts)} total NFTs")
        return all_nfts
    
    def create_placeholder_image(self, collection, index, size_name, size):
        """Create a placeholder image with collection name and index"""
        
        # Create directory if it doesn't exist
        collection_dir = os.path.join(self.base_dir, "assets", collection)
        os.makedirs(collection_dir, exist_ok=True)
        
        # Create a new image with the collection's color
        base_color = COLORS.get(collection, (200, 200, 200))
        
        # Add some variation based on index
        color = (
            max(0, min(255, base_color[0] + random.randint(-30, 30))),
            max(0, min(255, base_color[1] + random.randint(-30, 30))),
            max(0, min(255, base_color[2] + random.randint(-30, 30)))
        )
        
        img = Image.new('RGB', (size, size), color)
        draw = ImageDraw.Draw(img)
        
        # Add a pattern or texture
        for i in range(0, size, 20):
            line_color = (
                max(0, min(255, color[0] + random.randint(-50, 50))),
                max(0, min(255, color[1] + random.randint(-50, 50))),
                max(0, min(255, color[2] + random.randint(-50, 50)))
            )
            draw.line([(0, i), (size, i)], fill=line_color, width=1)
            draw.line([(i, 0), (i, size)], fill=line_color, width=1)
        
        # Add text
        text_color = (255, 255, 255)  # White text
        text = f"{collection} #{index}"
        
        # Try to use a font, fall back to default if not available
        try:
            font_size = size // 10
            font = ImageFont.truetype("arial.ttf", font_size)
            # Fix for newer Pillow versions
            try:
                # For Pillow >= 9.0.0
                bbox = draw.textbbox((0, 0), text, font=font)
                text_width = bbox[2] - bbox[0]
                text_height = bbox[3] - bbox[1]
            except AttributeError:
                # For older Pillow versions
                text_width, text_height = draw.textsize(text, font)
                
            position = ((size - text_width) // 2, (size - text_height) // 2)
            draw.text(position, text, font=font, fill=text_color)
        except Exception as e:
            # Fallback if font not available
            draw.text((size//10, size//2), text, fill=text_color)
        
        # Save the image
        filename = f"{collection}_{index}"
        if size_name != "full":
            filename += f"_{size_name}"
        filename += ".png"
        
        output_path = os.path.join(collection_dir, filename)
        img.save(output_path)
        
        self.log(f"Created {output_path}")
        return output_path

    def create_placeholder_images(self):
        """Generate placeholder images for collections"""
        self.log("Creating placeholder images...")
        
        # For each collection
        for collection_id in [c["id"] for c in COLLECTIONS[:COLLECTION_COUNT]]:
            self.log(f"\nGenerating images for collection: {collection_id}")
            
            # For items 1-10 in each collection
            for index in range(1, ITEMS_PER_COLLECTION + 1):
                # Create each size
                for size_name, size in SIZES.items():
                    self.create_placeholder_image(collection_id, index, size_name, size)
        
        self.log("Placeholder image generation complete!")
        return True
    
    def create_readme(self):
        """Create a README.md file for the project"""
        readme_content = """# Wild Dragons NFT Marketplace

## Overview
This project creates an NFT marketplace with a cosmic, minimal, and neon-accented UI.
It features DAO logic, resources integration, and a responsive marketplace grid.

## Directory Structure
- `/data/`
  - `/collections/` - JSON files for each collection
  - `/resources/` - Additional NFT-inspired resources
- `/assets/`
  - `/pinterest-thumbs/` - Scraped art pool
  - `/{collection_name}/` - Processed NFT images for each collection
- `/meta/`
  - `index.json` - Master index linking all datasets

## Getting Started
1. Run `setup.bat` to create necessary directories
2. Run `generate-mock-data.bat` to create mock NFTs and images
3. Start the application with `npm run dev`

## JSON Schema
Each NFT follows this structure:
```json
{
  "id": "unique-token-id",
  "name": "Asset Name",
  "collection": "Collection Name",
  "description": "Asset description",
  "image": {
    "thumbnail": "/assets/{collection}/{id}_thumb.png",
    "preview": "/assets/{collection}/{id}_preview.png",
    "full": "/assets/{collection}/{id}.png"
  },
  "traits": {
    "rarity": "Epic",
    "element": "Fire",
    "power": 87
  },
  "spiritual": {
    "chakra": "root",
    "frequency_hz": 396,
    "color": "red",
    "level_unlock": 3
  },
  "price": {
    "listed": "1.25 ETH",
    "floor": "1.00 ETH", 
    "last_sale": "0.90 ETH"
  },
  "external_url": "https://example.com/nft/{id}"
}
```
"""
        
        readme_path = os.path.join(self.base_dir, "README.md")
        with open(readme_path, "w") as f:
            f.write(readme_content)
            
        self.log(f"Created README.md at {readme_path}")
        return True
        
    def run(self, mode="full"):
        """Run the crawler in specified mode"""
        self.log(f"Starting Wild Dragons crawler in {mode} mode...")
        
        # Setup directories
        if not self.setup_directories():
            self.log("Failed to set up directories. Aborting.")
            return False
        
        # Generate mock data
        self.generate_mock_data()
        
        # Create placeholder images
        self.create_placeholder_images()
        
        # Create README
        self.create_readme()
        
        # Calculate execution time
        end_time = datetime.now()
        execution_time = end_time - self.start_time
        
        self.log(f"\n=== Wild Dragons Data Crawler Completed ===")
        self.log(f"Execution time: {execution_time}")
        self.log(f"Log file: {self.log_file}")
        
        return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Wild Dragons NFT Marketplace Data Crawler')
    parser.add_argument('--mode', type=str, default='full', choices=['full', 'data-only', 'images-only'], 
                        help='Crawler mode')
    
    args = parser.parse_args()
    
    crawler = WildDragonsCrawler()
    crawler.run(mode=args.mode)
