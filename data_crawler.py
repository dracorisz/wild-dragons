"""
Wild Dragons NFT Marketplace Data Pipeline

Summary:
This script automates the crawling, normalization, and asset preparation for the Wild Dragons NFT Marketplace.
It pulls NFT collection and item data from TokenTrove, fantasy art thumbnails from Pinterest, processes images,
and outputs normalized JSON files for collections, items, user profiles, and metadata. The outputs are ready for
integration with API endpoints and frontend UI configs.

Task Groups:
1. Data Acquisition
   - Crawl TokenTrove for collections and items.
   - Scrape Pinterest for fantasy art thumbnails.

2. Asset Processing
   - Download and optimize images for each NFT.
   - Assign thumbnails to items.

3. Data Normalization & Output
   - Normalize and save collections JSON.
   - Normalize and save items JSON.
   - Save metadata JSON (rarity, traits, elements).
   - Save user profile JSON.

4. Indexing & Integration
   - Build meta index for collections.
   - Prepare API-ready JSON endpoints.
   - Integrate with frontend configs.

5. Automation & Expansion
   - (Optional) Enable forward mode for incremental crawling and updates.
   - (Optional) Extend for new collections, categories, and user data.
   - (Optional) Integrate with smart contracts and multi-chain support.

Follow this grouped tasklist for efficient workflow and expansion.
"""

import os
import requests
from PIL import Image
from io import BytesIO
from bs4 import BeautifulSoup
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data", "collections")
ASSETS_DIR = os.path.join(BASE_DIR, "assets")
PINTEREST_THUMBS_DIR = os.path.join(ASSETS_DIR, "pinterest-thumbs")
META_DIR = os.path.join(BASE_DIR, "meta")

def ensure_dirs():
    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs(PINTEREST_THUMBS_DIR, exist_ok=True)
    os.makedirs(META_DIR, exist_ok=True)

def crawl_tokentrove_collections():
    # TODO: Implement real crawling logic for TokenTrove collections and tokens
    # Use requests and BeautifulSoup to fetch and parse collection/token data
    # For each token, extract:
    #   id, name, collection, description, traits, price, external_url, image_url
    # Return list of dicts matching the Wild Dragons schema
    return [
        {
            "id": "dragon001",
            "name": "Cosmic Dragon",
            "collection": "Wild Dragons",
            "description": "A legendary cosmic dragon NFT.",
            "image": {
                "thumbnail": "/assets/Wild Dragons/dragon001_thumb.png",
                "preview": "/assets/Wild Dragons/dragon001_preview.png",
                "full": "/assets/Wild Dragons/dragon001.png"
            },
            "traits": {
                "rarity": "Legendary",
                "element": "Cosmic",
                "power": 100
            },
            "price": {
                "listed": "5.00 ETH",
                "floor": "4.50 ETH",
                "last_sale": "4.00 ETH"
            },
            "external_url": "https://tokentrove.com/asset/dragon001",
            "spiritual": {
                "chakra": "crown",
                "frequency_hz": 963,
                "color": "violet",
                "level_unlock": 7
            },
            # Example field for future image crawling
            "image_url": "https://example.com/dragon001.png"
        }
    ]

def scrape_pinterest_thumbnails():
    # TODO: Implement real scraping logic for Pinterest fantasy art thumbnails
    # Example implementation:
    # 1. Fetch the Pinterest page HTML.
    # 2. Parse for image URLs using BeautifulSoup.
    # 3. Download images to PINTEREST_THUMBS_DIR.
    # 4. Return list of local filepaths.
    pinterest_url = "https://www.pinterest.com/EvGaninFantasyArt/_created/"
    try:
        response = requests.get(pinterest_url, timeout=10)
        soup = BeautifulSoup(response.text, "html.parser")
        img_tags = soup.find_all("img")
        local_paths = []
        for i, img_tag in enumerate(img_tags):
            src = img_tag.get("src")
            if src and src.startswith("http"):
                try:
                    img_resp = requests.get(src, timeout=10)
                    img = Image.open(BytesIO(img_resp.content)).convert("RGBA")
                    out_path = os.path.join(PINTEREST_THUMBS_DIR, f"pinterest_{i}.png")
                    img.save(out_path)
                    local_paths.append(out_path.replace(BASE_DIR, ""))
                except Exception as e:
                    print(f"Error downloading Pinterest image {src}: {e}")
        return local_paths
    except Exception as e:
        print(f"Error scraping Pinterest: {e}")
        return []

def download_and_optimize_image(url, out_dir, base_name):
    # Download image, save full, thumbnail, preview
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        img = Image.open(BytesIO(response.content)).convert("RGBA")
        full_path = os.path.join(out_dir, f"{base_name}.png")
        thumb_path = os.path.join(out_dir, f"{base_name}_thumb.png")
        preview_path = os.path.join(out_dir, f"{base_name}_preview.png")
        img.save(full_path)
        img_thumb = img.copy()
        img_thumb.thumbnail((256, 256))
        img_thumb.save(thumb_path)
        img_preview = img.copy()
        img_preview.thumbnail((512, 512))
        img_preview.save(preview_path)
        return full_path, thumb_path, preview_path
    except Exception as e:
        print(f"Error downloading/optimizing image {url}: {e}")
        return None, None, None

def save_collection_json(collection_name, items):
    # Save collection items to JSON file in /data/collections
    out_path = os.path.join(DATA_DIR, f"{collection_name}.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2, ensure_ascii=False)

def save_items_json(collection_name, items):
    # Save items to /data/items/{collection_name}_items.json
    items_dir = os.path.join(BASE_DIR, "data", "items")
    os.makedirs(items_dir, exist_ok=True)
    out_path = os.path.join(items_dir, f"{collection_name}_items.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2, ensure_ascii=False)

def build_meta_index():
    # Scan /data/collections and build /meta/index.json
    index = {}
    for fname in os.listdir(DATA_DIR):
        if fname.endswith(".json"):
            with open(os.path.join(DATA_DIR, fname), encoding="utf-8") as f:
                index[fname] = json.load(f)
    with open(os.path.join(META_DIR, "index.json"), "w", encoding="utf-8") as f:
        json.dump(index, f, indent=2, ensure_ascii=False)

def assign_thumbnails_to_items(items, thumbnails):
    # Assign thumbnails to items (random or attribute-based)
    for i, item in enumerate(items):
        if thumbnails:
            thumb_path = thumbnails[i % len(thumbnails)]
            # Example: assign thumbnail as preview image
            item["image"]["thumbnail"] = thumb_path
    return items

def save_user_profile_json(profile):
    # Save user profile to /data/user_profile.json
    out_path = os.path.join(BASE_DIR, "data", "user_profile.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(profile, f, indent=2, ensure_ascii=False)

def save_metadata_json(metadata):
    # Save metadata to /data/metadata.json
    out_path = os.path.join(BASE_DIR, "data", "metadata.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)

def print_tasklist():
    print("\nWild Dragons NFT Marketplace — Task List")
    print("1. Crawl TokenTrove for collections and items.")
    print("2. Scrape Pinterest for fantasy thumbnails.")
    print("3. Download and optimize images for each NFT.")
    print("4. Normalize and save collections JSON.")
    print("5. Normalize and save items JSON.")
    print("6. Build meta index for collections.")
    print("7. Assign thumbnails to items.")
    print("8. Save user profile JSON.")
    print("9. Save metadata JSON.")
    print("10. (Optional) Extend for new collections, categories, and user data.")
    print("11. (Optional) Integrate with API endpoints and frontend configs.")
    print("12. (Optional) Enable forward mode for longer sessions and incremental crawling.\n")

def forward_mode():
    print("Forward mode enabled: Session will persist, allowing incremental crawling and data updates.")
    # Example: Could implement a loop or scheduler for periodic crawling
    # while True:
    #     main()
    #     time.sleep(3600)  # Run every hour

def main():
    print_tasklist()
    ensure_dirs()
    collections = crawl_tokentrove_collections()
    thumbnails = scrape_pinterest_thumbnails()
    collections = assign_thumbnails_to_items(collections, thumbnails)
    items = []
    for item in collections:
        url = item.get("image_url")
        if url:
            out_dir = os.path.join(ASSETS_DIR, item["collection"])
            os.makedirs(out_dir, exist_ok=True)
            base_name = item["id"]
            full_path, thumb_path, preview_path = download_and_optimize_image(url, out_dir, base_name)
            if full_path and thumb_path and preview_path:
                item["image"]["full"] = full_path.replace(BASE_DIR, "")
                item["image"]["thumbnail"] = thumb_path.replace(BASE_DIR, "")
                item["image"]["preview"] = preview_path.replace(BASE_DIR, "")
        items.append(item)
    save_collection_json("Wild Dragons", collections)
    save_items_json("wild_dragons", items)
    build_meta_index()
    # Example user profile for integration
    user_profile = {
        "wallet": "0x123...",
        "username": "CosmicSeeker",
        "owned_items": [item["id"] for item in items],
        "dao_votes": 12,
        "rank": "Elder"
    }
    save_user_profile_json(user_profile)
    # Example metadata for integration
    metadata = {
        "rarity": ["Common", "Rare", "Epic", "Legendary"],
        "elements": ["Cosmic", "Neon", "Fire", "Water", "Earth", "Air"],
        "traits": [
            "Wings", "Stardust", "Aura", "Multiple Heads", "Glow", "Venom",
            "Scales", "Claws", "Tail", "Horns", "Eyes", "Breath"
        ]
    }
    save_metadata_json(metadata)
    # Uncomment below to enable forward mode (longer sessions)
    # forward_mode()

if __name__ == "__main__":
    main()
