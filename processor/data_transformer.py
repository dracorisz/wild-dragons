import os
import json
import argparse
import random
from datetime import datetime

class DataTransformer:
    """
    Transform raw NFT data into the Wild Dragons JSON schema format.
    """
    
    def __init__(self, input_dir="data/raw", output_dir="data/collections"):
        """
        Initialize the data transformer.
        
        Args:
            input_dir (str): Directory containing raw data
            output_dir (str): Directory to save transformed data
        """
        self.input_dir = input_dir
        self.output_dir = output_dir
        
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        # Load existing resources to determine next available ID
        self.resources = self.load_resources()
        self.next_id = self.get_next_resource_id()
        
        # Define rarity levels
        self.rarity_levels = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"]
        
        # Define chakra information for spiritual attributes
        self.chakras = [
            {"name": "root", "frequency_hz": 396, "color": "red", "level_unlock": 1},
            {"name": "sacral", "frequency_hz": 417, "color": "orange", "level_unlock": 2},
            {"name": "solar_plexus", "frequency_hz": 528, "color": "yellow", "level_unlock": 3},
            {"name": "heart", "frequency_hz": 639, "color": "green", "level_unlock": 4},
            {"name": "throat", "frequency_hz": 741, "color": "blue", "level_unlock": 5},
            {"name": "third_eye", "frequency_hz": 852, "color": "indigo", "level_unlock": 6},
            {"name": "crown", "frequency_hz": 963, "color": "violet", "level_unlock": 7}
        ]
        
        # Define elements
        self.elements = ["Fire", "Water", "Earth", "Air", "Light", "Dark", "Cosmic", "Nature", "Mechanical"]
    
    def load_resources(self):
        """
        Load existing resources.json file.
        
        Returns:
            list: Existing resources
        """
        try:
            with open("resources.json", "r") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return []
    
    def get_next_resource_id(self):
        """
        Get the next available resource ID.
        
        Returns:
            int: Next available ID
        """
        if not self.resources:
            return 1
            
        max_id = 0
        for resource in self.resources:
            if "id" in resource and isinstance(resource["id"], int):
                max_id = max(max_id, resource["id"])
        
        return max_id + 1
    
    def transform_collection_items(self, collection_id, collection_name):
        """
        Transform raw collection items into the Wild Dragons format.
        
        Args:
            collection_id (str): Collection ID
            collection_name (str): Collection name
            
        Returns:
            list: Transformed items
        """
        input_path = os.path.join(self.input_dir, collection_id, "items.json")
        
        try:
            with open(input_path, "r") as f:
                raw_items = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            print(f"No valid items found for collection: {collection_name}")
            return []
        
        transformed_items = []
        
        for item in raw_items:
            try:
                # Generate a unique ID for this item
                item_id = f"{collection_id}_{item['id']}"
                
                # Determine rarity (either from traits or random)
                rarity = None
                if "traits" in item and "rarity" in item["traits"]:
                    rarity = item["traits"]["rarity"]
                else:
                    rarity = random.choice(self.rarity_levels)
                
                # Determine element (either from traits or random)
                element = None
                if "traits" in item and "element" in item["traits"]:
                    element = item["traits"]["element"]
                else:
                    element = random.choice(self.elements)
                
                # Calculate power based on rarity
                power_base = self.rarity_levels.index(rarity) * 20 + 10
                power = power_base + random.randint(0, 19)
                
                # Add spiritual attributes
                chakra_level = min(self.rarity_levels.index(rarity) + 1, len(self.chakras))
                chakra_info = self.chakras[chakra_level - 1]
                
                # Format price data
                price_listed = item.get("price", {}).get("listed", f"{random.randint(5, 100) / 100:.2f} ETH")
                price_floor = item.get("price", {}).get("floor", f"{random.randint(3, 80) / 100:.2f} ETH")
                price_last = item.get("price", {}).get("last_sale", f"{random.randint(2, 70) / 100:.2f} ETH")
                
                # Create image paths
                image_paths = {
                    "thumbnail": f"/assets/{collection_id}/{item['id']}_thumb.png",
                    "preview": f"/assets/{collection_id}/{item['id']}_preview.png",
                    "full": f"/assets/{collection_id}/{item['id']}.png"
                }
                
                transformed_item = {
                    "id": item_id,
                    "name": item.get("name", f"Unknown Item {item['id']}"),
                    "collection": collection_name,
                    "description": item.get("description", f"A mysterious item from the {collection_name} collection."),
                    "image": image_paths,
                    "traits": {
                        "rarity": rarity,
                        "element": element,
                        "power": power
                    },
                    "spiritual": {
                        "chakra": chakra_info["name"],
                        "frequency_hz": chakra_info["frequency_hz"],
                        "color": chakra_info["color"],
                        "level_unlock": chakra_info["level_unlock"]
                    },
                    "price": {
                        "listed": price_listed,
                        "floor": price_floor,
                        "last_sale": price_last
                    },
                    "external_url": item.get("external_url", ""),
                    "created_at": datetime.now().isoformat()
                }
                
                # Additional traits from the original data
                if "traits" in item:
                    for key, value in item["traits"].items():
                        if key.lower() not in ["rarity", "element", "power"]:
                            transformed_item["traits"][key.lower()] = value
                
                transformed_items.append(transformed_item)
                
            except Exception as e:
                print(f"Error transforming item {item.get('id', 'unknown')}: {e}")
        
        return transformed_items
    
    def transform_collections(self):
        """
        Transform all raw collections data.
        
        Returns:
            dict: Transformed collections
        """
        collections_path = os.path.join(self.input_dir, "collections.json")
        
        try:
            with open(collections_path, "r") as f:
                collections = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            print("No valid collections found")
            return {}
        
        result = {}
        
        for collection in collections:
            collection_id = collection["id"]
            collection_name = collection["name"]
            
            items = self.transform_collection_items(collection_id, collection_name)
            
            if items:
                # Save collection items
                output_path = os.path.join(self.output_dir, f"{collection_id}.json")
                with open(output_path, "w") as f:
                    json.dump(items, f, indent=2)
                
                # Add to result
                result[collection_id] = {
                    "name": collection_name,
                    "item_count": len(items),
                    "url": collection.get("url", ""),
                    "items": items
                }
                
                print(f"Transformed {len(items)} items for collection: {collection_name}")
        
        return result
    
    def generate_master_index(self, collections):
        """
        Generate a master index file linking all collections.
        
        Args:
            collections (dict): Transformed collections
            
        Returns:
            dict: Master index
        """
        master_index = {
            "version": "1.0.0",
            "generated_at": datetime.now().isoformat(),
            "collection_count": len(collections),
            "total_items": sum(c["item_count"] for c in collections.values()),
            "collections": {}
        }
        
        for collection_id, collection_data in collections.items():
            master_index["collections"][collection_id] = {
                "name": collection_data["name"],
                "item_count": collection_data["item_count"],
                "file_path": f"/data/collections/{collection_id}.json"
            }
        
        # Save master index
        os.makedirs("meta", exist_ok=True)
        with open("meta/index.json", "w") as f:
            json.dump(master_index, f, indent=2)
            
        return master_index
    
    def extend_resources(self, collections):
        """
        Extend the resources.json file with new items from collections.
        
        Args:
            collections (dict): Transformed collections
            
        Returns:
            list: Updated resources
        """
        # Select items to add as resources (e.g., Legendary items)
        new_resources = []
        
        for collection_data in collections.values():
            for item in collection_data["items"]:
                if item["traits"]["rarity"] == "Legendary" or item["traits"]["rarity"] == "Mythic":
                    # Convert to resource format
                    resource = {
                        "id": self.next_id,
                        "name": item["name"],
                        "type": item["traits"]["element"],
                        "category": "NFT",
                        "collection": item["collection"],
                        "rarity": item["traits"]["rarity"],
                        "power": item["traits"]["power"],
                        "image": item["image"]["thumbnail"]
                    }
                    
                    new_resources.append(resource)
                    self.next_id += 1
                    
                    # Limit to avoid too many additions
                    if len(new_resources) >= 20:
                        break
        
        # Add new resources to existing ones
        updated_resources = self.resources + new_resources
        
        # Save updated resources
        with open("resources.json", "w") as f:
            json.dump(updated_resources, f, indent=2)
            
        print(f"Added {len(new_resources)} new items to resources.json")
        
        return updated_resources
    
    def run(self):
        """
        Run the data transformation process.
        
        Returns:
            dict: Results of transformation
        """
        print("Starting data transformation...")
        
        # Transform collection data
        collections = self.transform_collections()
        
        # Generate master index
        master_index = self.generate_master_index(collections)
        
        # Extend resources.json
        updated_resources = self.extend_resources(collections)
        
        return {
            "collections": collections,
            "master_index": master_index,
            "resources": {
                "original_count": len(self.resources),
                "added_count": len(updated_resources) - len(self.resources),
                "total_count": len(updated_resources)
            }
        }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Transform NFT data for Wild Dragons marketplace')
    parser.add_argument('--input', type=str, default='data/raw', help='Input directory containing raw data')
    parser.add_argument('--output', type=str, default='data/collections', help='Output directory for transformed data')
    
    args = parser.parse_args()
    
    transformer = DataTransformer(input_dir=args.input, output_dir=args.output)
    transformer.run()
