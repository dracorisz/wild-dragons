import os
import json
import time
import argparse
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

class TokenTroveCrawler:
    """
    A crawler for extracting NFT data from TokenTrove marketplace.
    """
    
    def __init__(self, output_dir="data/raw", delay=1):
        """
        Initialize the TokenTrove crawler.
        
        Args:
            output_dir (str): Directory to save crawled data
            delay (int): Delay between requests in seconds
        """
        self.base_url = "https://tokentrove.com"
        self.output_dir = output_dir
        self.delay = delay
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
        }
        
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
    
    def get_collections(self, limit=10):
        """
        Get top NFT collections from TokenTrove.
        
        Args:
            limit (int): Maximum number of collections to retrieve
            
        Returns:
            list: Collection data including URLs and metadata
        """
        print(f"Fetching top {limit} collections from TokenTrove...")
        
        collections_url = f"{self.base_url}/collections"
        response = requests.get(collections_url, headers=self.headers)
        
        if response.status_code != 200:
            print(f"Failed to fetch collections: {response.status_code}")
            return []
        
        soup = BeautifulSoup(response.text, 'html.parser')
        collection_elements = soup.select('.collection-card')[:limit]
        
        collections = []
        for element in collection_elements:
            try:
                name_elem = element.select_one('.collection-name')
                link_elem = element.select_one('a')
                
                if name_elem and link_elem:
                    collection_url = urljoin(self.base_url, link_elem.get('href'))
                    collection_name = name_elem.text.strip()
                    
                    collections.append({
                        'name': collection_name,
                        'url': collection_url,
                        'id': collection_url.split('/')[-1]
                    })
            except Exception as e:
                print(f"Error processing collection: {e}")
        
        # Save collections data
        with open(os.path.join(self.output_dir, 'collections.json'), 'w') as f:
            json.dump(collections, f, indent=2)
            
        print(f"Found {len(collections)} collections")
        return collections
    
    def get_items_from_collection(self, collection, limit=100):
        """
        Get NFT items from a specific collection.
        
        Args:
            collection (dict): Collection information
            limit (int): Maximum number of items to retrieve
            
        Returns:
            list: NFT items with metadata
        """
        print(f"Fetching up to {limit} items from collection: {collection['name']}")
        
        collection_url = collection['url']
        response = requests.get(collection_url, headers=self.headers)
        
        if response.status_code != 200:
            print(f"Failed to fetch collection items: {response.status_code}")
            return []
        
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
                    item_url = urljoin(self.base_url, link_elem.get('href'))
                    item_id = item_url.split('/')[-1]
                    
                    item = {
                        'id': item_id,
                        'name': name_elem.text.strip(),
                        'collection': collection['name'],
                        'collection_id': collection['id'],
                        'external_url': item_url,
                        'price': {
                            'listed': price_elem.text.strip() if price_elem else None,
                            'floor': None,  # Need to get from collection stats
                            'last_sale': None  # Need detailed page scrape
                        }
                    }
                    
                    # Get image URL if available
                    if image_elem and image_elem.get('src'):
                        item['image_url'] = image_elem.get('src')
                    
                    # Get detailed info (traits, description)
                    detailed_info = self.get_item_details(item_url)
                    if detailed_info:
                        item.update(detailed_info)
                    
                    items.append(item)
                    
                    # Respect the site's rate limits
                    time.sleep(self.delay)
                    
            except Exception as e:
                print(f"Error processing item: {e}")
        
        # Save collection items
        os.makedirs(os.path.join(self.output_dir, collection['id']), exist_ok=True)
        with open(os.path.join(self.output_dir, collection['id'], 'items.json'), 'w') as f:
            json.dump(items, f, indent=2)
            
        print(f"Processed {len(items)} items from collection {collection['name']}")
        return items
    
    def get_item_details(self, item_url):
        """
        Get detailed information about a specific NFT item.
        
        Args:
            item_url (str): URL to the NFT item page
            
        Returns:
            dict: Detailed information including traits and description
        """
        try:
            response = requests.get(item_url, headers=self.headers)
            
            if response.status_code != 200:
                print(f"Failed to fetch item details: {response.status_code}")
                return {}
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract description
            description_elem = soup.select_one('.nft-description')
            description = description_elem.text.strip() if description_elem else ""
            
            # Extract traits
            trait_elements = soup.select('.trait-card')
            traits = {}
            
            for trait_elem in trait_elements:
                try:
                    trait_type_elem = trait_elem.select_one('.trait-type')
                    trait_value_elem = trait_elem.select_one('.trait-value')
                    
                    if trait_type_elem and trait_value_elem:
                        trait_type = trait_type_elem.text.strip()
                        trait_value = trait_value_elem.text.strip()
                        traits[trait_type.lower()] = trait_value
                except Exception as e:
                    print(f"Error processing trait: {e}")
            
            return {
                'description': description,
                'traits': traits
            }
            
        except Exception as e:
            print(f"Error getting item details: {e}")
            return {}
    
    def run(self, collection_limit=10, item_limit=100):
        """
        Run the complete crawling process.
        
        Args:
            collection_limit (int): Maximum number of collections to crawl
            item_limit (int): Maximum number of items per collection
        """
        print(f"Starting TokenTrove crawler...")
        collections = self.get_collections(limit=collection_limit)
        
        all_items = []
        for collection in collections:
            items = self.get_items_from_collection(collection, limit=item_limit)
            all_items.extend(items)
            
            # Respect the site's rate limits
            time.sleep(self.delay * 2)
        
        print(f"Crawling complete! Processed {len(all_items)} items across {len(collections)} collections.")
        
        # Save summary of all items
        with open(os.path.join(self.output_dir, 'all_items.json'), 'w') as f:
            json.dump(all_items, f, indent=2)
            
        return all_items

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Crawl NFT data from TokenTrove')
    parser.add_argument('--collections', type=int, default=10, help='Number of collections to crawl')
    parser.add_argument('--items', type=int, default=100, help='Number of items per collection')
    parser.add_argument('--output', type=str, default='data/raw', help='Output directory')
    parser.add_argument('--delay', type=float, default=1.0, help='Delay between requests in seconds')
    
    args = parser.parse_args()
    
    crawler = TokenTroveCrawler(output_dir=args.output, delay=args.delay)
    crawler.run(collection_limit=args.collections, item_limit=args.items)
