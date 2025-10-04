#!/usr/bin/env python3
"""
Wild Dragons Data Crawler - Execution Script
This script orchestrates the execution of all data crawling, processing, and integration tasks.
"""

import os
import json
import argparse
import subprocess
import time
import shutil
from datetime import datetime

class DataCrawlerExecutor:
    """
    Orchestrates the execution of the Wild Dragons data crawler implementation.
    """
    
    def __init__(self, base_dir=None):
        """Initialize the executor with the project base directory."""
        self.base_dir = base_dir or os.path.dirname(os.path.abspath(__file__))
        self.start_time = datetime.now()
        self.log_file = os.path.join(self.base_dir, "crawler_execution.log")
        
    def log(self, message):
        """Log a message to both console and log file."""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_message = f"[{timestamp}] {message}"
        print(log_message)
        
        with open(self.log_file, "a") as f:
            f.write(log_message + "\n")
    
    def setup_directories(self):
        """Create the necessary directory structure."""
        self.log("Setting up directory structure...")
        
        directories = [
            "data/collections",
            "data/resources",
            "assets/pinterest-thumbs/fire",
            "assets/pinterest-thumbs/water",
            "assets/pinterest-thumbs/earth",
            "assets/pinterest-thumbs/air",
            "assets/pinterest-thumbs/light",
            "assets/pinterest-thumbs/dark",
            "assets/pinterest-thumbs/cosmic",
            "assets/pinterest-thumbs/nature",
            "assets/pinterest-thumbs/mechanical",
            "meta"
        ]
        
        for directory in directories:
            dir_path = os.path.join(self.base_dir, directory)
            os.makedirs(dir_path, exist_ok=True)
            self.log(f"Created directory: {directory}")
            
        return True
        
    def run_tokentrove_crawler(self, collection_limit=10, item_limit=50):
        """Execute the TokenTrove crawler."""
        self.log("\n=== Running TokenTrove Crawler ===")
        crawler_path = os.path.join(self.base_dir, "crawler", "tokentrove_crawler.py")
        
        if not os.path.exists(crawler_path):
            self.log(f"Error: TokenTrove crawler not found at {crawler_path}")
            return False
            
        output_dir = os.path.join(self.base_dir, "data", "raw")
        command = [
            "python", crawler_path,
            "--collections", str(collection_limit),
            "--items", str(item_limit),
            "--output", output_dir
        ]
        
        try:
            self.log(f"Executing: {' '.join(command)}")
            process = subprocess.run(command, check=True, text=True, capture_output=True)
            self.log(f"TokenTrove crawler completed successfully")
            self.log(f"Output: {process.stdout}")
            return True
        except subprocess.CalledProcessError as e:
            self.log(f"Error running TokenTrove crawler: {e}")
            self.log(f"Error output: {e.stderr}")
            return False
    
    def run_pinterest_scraper(self, limit_per_category=20):
        """Execute the Pinterest image scraper."""
        self.log("\n=== Running Pinterest Image Scraper ===")
        scraper_path = os.path.join(self.base_dir, "crawler", "pinterest_scraper.py")
        
        if not os.path.exists(scraper_path):
            self.log(f"Error: Pinterest scraper not found at {scraper_path}")
            return False
            
        output_dir = os.path.join(self.base_dir, "assets", "pinterest-thumbs")
        command = [
            "python", scraper_path,
            "--output", output_dir,
            "--limit", str(limit_per_category)
        ]
        
        try:
            self.log(f"Executing: {' '.join(command)}")
            process = subprocess.run(command, check=True, text=True, capture_output=True)
            self.log(f"Pinterest scraper completed successfully")
            self.log(f"Output: {process.stdout}")
            return True
        except subprocess.CalledProcessError as e:
            self.log(f"Error running Pinterest scraper: {e}")
            self.log(f"Error output: {e.stderr}")
            return False
    
    def process_images(self):
        """Process downloaded images with the image processor."""
        self.log("\n=== Processing Images ===")
        processor_path = os.path.join(self.base_dir, "processor", "image_processor.py")
        
        if not os.path.exists(processor_path):
            self.log(f"Error: Image processor not found at {processor_path}")
            return False
            
        input_dir = os.path.join(self.base_dir, "assets", "pinterest-thumbs")
        output_dir = os.path.join(self.base_dir, "assets")
        command = [
            "python", processor_path,
            "--input", input_dir,
            "--output", output_dir
        ]
        
        try:
            self.log(f"Executing: {' '.join(command)}")
            process = subprocess.run(command, check=True, text=True, capture_output=True)
            self.log(f"Image processor completed successfully")
            self.log(f"Output: {process.stdout}")
            return True
        except subprocess.CalledProcessError as e:
            self.log(f"Error running image processor: {e}")
            self.log(f"Error output: {e.stderr}")
            return False
    
    def transform_data(self):
        """Transform raw data to the project JSON schema."""
        self.log("\n=== Transforming Data ===")
        
        # Check if raw data exists
        raw_dir = os.path.join(self.base_dir, "data", "raw")
        if not os.path.exists(raw_dir):
            self.log(f"Error: Raw data directory not found at {raw_dir}")
            return False
            
        collections_dir = os.path.join(self.base_dir, "data", "collections")
        os.makedirs(collections_dir, exist_ok=True)
        
        # Load collections data
        collections_file = os.path.join(raw_dir, "collections.json")
        if not os.path.exists(collections_file):
            self.log(f"Error: Collections file not found at {collections_file}")
            return False
            
        try:
            with open(collections_file, "r") as f:
                collections = json.load(f)
                
            # Process each collection
            master_index = {"collections": {}}
            
            for collection in collections:
                collection_id = collection["id"]
                collection_name = collection["name"]
                
                # Load collection items
                items_file = os.path.join(raw_dir, collection_id, "items.json")
                if not os.path.exists(items_file):
                    self.log(f"Warning: Items file not found for collection {collection_name}")
                    continue
                    
                with open(items_file, "r") as f:
                    items = json.load(f)
                
                # Transform to project schema
                transformed_items = []
                for item in items:
                    # Create paths according to the schema
                    image_paths = {
                        "thumbnail": f"/assets/{collection_id}/{item['id']}_thumb.png",
                        "preview": f"/assets/{collection_id}/{item['id']}_preview.png",
                        "full": f"/assets/{collection_id}/{item['id']}.png"
                    }
                    
                    # Add spiritual attributes for Kundalini Awakening
                    chakras = ["root", "sacral", "solar_plexus", "heart", "throat", "third_eye", "crown"]
                    frequencies = [396, 417, 528, 639, 741, 852, 963]
                    colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
                    
                    # Deterministically select chakra based on item ID
                    chakra_index = int(item["id"]) % len(chakras)
                    
                    spiritual = {
                        "chakra": chakras[chakra_index],
                        "frequency_hz": frequencies[chakra_index],
                        "color": colors[chakra_index],
                        "level_unlock": (chakra_index + 1) * 2
                    }
                    
                    # Create transformed item
                    transformed_item = {
                        "id": item["id"],
                        "name": item["name"],
                        "collection": collection_name,
                        "description": item.get("description", ""),
                        "image": image_paths,
                        "traits": item.get("traits", {}),
                        "price": item.get("price", {}),
                        "external_url": item.get("external_url", ""),
                        "spiritual": spiritual
                    }
                    
                    transformed_items.append(transformed_item)
                
                # Save transformed collection
                output_file = os.path.join(collections_dir, f"{collection_id}.json")
                with open(output_file, "w") as f:
                    json.dump(transformed_items, f, indent=2)
                
                # Update master index
                master_index["collections"][collection_id] = {
                    "name": collection_name,
                    "count": len(transformed_items),
                    "file": f"/data/collections/{collection_id}.json"
                }
                
                self.log(f"Transformed {len(transformed_items)} items for collection {collection_name}")
            
            # Save master index
            master_index_file = os.path.join(self.base_dir, "meta", "index.json")
            with open(master_index_file, "w") as f:
                json.dump(master_index, f, indent=2)
                
            self.log(f"Created master index with {len(master_index['collections'])} collections")
            return True
            
        except Exception as e:
            self.log(f"Error transforming data: {e}")
            return False
    
    def create_readme(self):
        """Create a README.md file documenting the data structure."""
        self.log("\n=== Creating Documentation ===")
        
        readme_content = """# Wild Dragons NFT Marketplace Data

## Directory Structure

- `/data/`
  - `/collections/` - JSON files for each collection
  - `/resources/` - Additional NFT-inspired resources
- `/assets/`
  - `/pinterest-thumbs/` - Scraped art pool
  - `/{collection_name}/` - Processed NFT images for each collection
- `/meta/`
  - `index.json` - Master index linking all datasets

## JSON Schema

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
  "price": {
    "listed": "1.25 ETH",
    "floor": "1.00 ETH",
    "last_sale": "0.90 ETH"
  },
  "external_url": "https://tokentrove.com/asset/{id}",
  "spiritual": {
    "chakra": "root",
    "frequency_hz": 396,
    "color": "red",
    "level_unlock": 3
  }
}
```

## Integration Guide

To integrate the data into your application:

1. Load the master index from `/meta/index.json`
2. Iterate through the collections and load each collection's JSON file
3. For each NFT, the image paths follow the naming convention:
   - Thumbnail: `/assets/{collection}/{id}_thumb.png`
   - Preview: `/assets/{collection}/{id}_preview.png`
   - Full: `/assets/{collection}/{id}.png`

## Data Sources

- NFT data: TokenTrove
- Images: Pinterest (with attribution)

## Kundalini Awakening Extension

Each item includes spiritual attributes for integration with the chakra-based progression system.
"""
        
        readme_file = os.path.join(self.base_dir, "README.md")
        with open(readme_file, "w") as f:
            f.write(readme_content)
            
        self.log(f"Created README.md at {readme_file}")
        return True
    
    def run(self, skip_tokentrove=False, skip_pinterest=False, skip_processing=False):
        """Run the complete data crawler implementation."""
        self.log("=== Starting Wild Dragons Data Crawler Implementation ===")
        
        # Setup directories
        if not self.setup_directories():
            self.log("Failed to set up directories. Aborting.")
            return False
        
        # Run TokenTrove crawler
        if not skip_tokentrove:
            if not self.run_tokentrove_crawler():
                self.log("TokenTrove crawler failed. Continuing with other tasks.")
        else:
            self.log("Skipping TokenTrove crawler as requested.")
        
        # Run Pinterest scraper
        if not skip_pinterest:
            if not self.run_pinterest_scraper():
                self.log("Pinterest scraper failed. Continuing with other tasks.")
        else:
            self.log("Skipping Pinterest scraper as requested.")
        
        # Process images
        if not skip_processing:
            if not self.process_images():
                self.log("Image processing failed. Continuing with other tasks.")
        else:
            self.log("Skipping image processing as requested.")
        
        # Transform data
        if not self.transform_data():
            self.log("Data transformation failed. Continuing with other tasks.")
        
        # Create README
        if not self.create_readme():
            self.log("README creation failed.")
        
        # Calculate execution time
        end_time = datetime.now()
        execution_time = end_time - self.start_time
        
        self.log(f"\n=== Wild Dragons Data Crawler Implementation Completed ===")
        self.log(f"Execution time: {execution_time}")
        self.log(f"Log file: {self.log_file}")
        
        return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Execute the Wild Dragons data crawler implementation')
    parser.add_argument('--skip-tokentrove', action='store_true', help='Skip the TokenTrove crawler')
    parser.add_argument('--skip-pinterest', action='store_true', help='Skip the Pinterest scraper')
    parser.add_argument('--skip-processing', action='store_true', help='Skip the image processing')
    
    args = parser.parse_args()
    
    executor = DataCrawlerExecutor()
    executor.run(
        skip_tokentrove=args.skip_tokentrove,
        skip_pinterest=args.skip_pinterest,
        skip_processing=args.skip_processing
    )
