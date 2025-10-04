"""
Mock Data Generator for Wild Dragons NFT Marketplace

This script generates mock data for development and testing purposes
when actual crawling from external sites is not possible.
"""

import os
import json
import random
from datetime import datetime

# Define constants for mock data generation
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

def generate_random_price():
    """Generate random ETH price string"""
    price = random.uniform(0.1, 5.0)
    return f"{price:.2f} ETH"

def generate_nft(collection, index):
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
            "listed": generate_random_price(),
            "floor": generate_random_price(),
            "last_sale": generate_random_price()
        },
        "external_url": f"https://example.com/nft/{collection['id']}/{index}",
        "created_at": datetime.now().isoformat()
    }

def generate_mock_data():
    """Generate mock data for Wild Dragons NFT Marketplace"""
    
    # Create directory structure
    os.makedirs("data/collections", exist_ok=True)
    os.makedirs("meta", exist_ok=True)
    
    collections_data = {}
    all_nfts = []
    
    # Use pre-defined collections
    collections = COLLECTIONS[:COLLECTION_COUNT]
    
    # Generate data for each collection
    for collection in collections:
        nfts = [generate_nft(collection, i+1) for i in range(ITEMS_PER_COLLECTION)]
        
        # Save collection data
        collection_path = f"data/collections/{collection['id']}.json"
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
    
    with open("meta/index.json", "w") as f:
        json.dump(master_index, f, indent=2)
        
    print(f"Generated mock data for {len(collections)} collections with {len(all_nfts)} total NFTs")
    print("Files saved to data/collections/ and meta/")

if __name__ == "__main__":
    print("Generating mock data for Wild Dragons NFT Marketplace...")
    generate_mock_data()
    print("Done!")
