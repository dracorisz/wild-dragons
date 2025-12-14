# cryptologos_final_with_coingecko.py
# FINAL - RESUMABLE - COINGECKO + CRYPTOLOGOS - NO OVERWRITE - FALLBACKS

import os
import json
import time
import requests
from tqdm import tqdm

# === CONFIG ===
LOGO_DIR = "logos"
OUTPUT_JSON = "coins.json"
VERSION_PARAM = "?v=040"
SIZES = ["", "-128", "-256", "-512"]  # PNG sizes
REQUESTS_PER_SECOND = 30  # CoinGecko allows 10-50 calls/sec, we stay safe
COINGECKO_API = "https://api.coingecko.com/api/v3/coins/markets"
CRYPTOLOGOS_BASE = "https://cryptologos.cc/logos"

# Create folders
os.makedirs(LOGO_DIR, exist_ok=True)

# Load existing mapping if exists (for resume)
if os.path.exists(OUTPUT_JSON):
    with open(OUTPUT_JSON, "r", encoding="utf-8") as f:
        existing_mapping = json.load(f)
    print(f"Resuming... Found {len(existing_mapping)} coins already processed.")
else:
    existing_mapping = {}

# Final mapping to save
mapping = existing_mapping.copy()

def download_file(url, filepath):
    """Download only if file doesn't exist"""
    if os.path.exists(filepath):
        return True
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        r = requests.get(url, headers=headers, timeout=15)
        if r.status_code == 200:
            with open(filepath, "wb") as f:
                f.write(r.content)
            return True
    except:
        pass
    return False

def generate_possible_slugs(coin):
    """Generate all possible cryptologos.cc slug variations"""
    name = coin["name"].lower().strip()
    symbol = coin["symbol"].lower().strip()
    id_slug = coin["id"].lower().strip()

    variations = [
        f"{name}-{symbol}-logo",           # bitcoin-btc-logo
        f"{name.replace(' ', '-')}-{symbol}-logo",
        f"{symbol}-{name.replace(' ', '-')}-logo",
        f"{id_slug}-{symbol}-logo",         # coingecko id fallback
        f"{id_slug}-logo",
        f"{symbol}-logo",
        name.replace(" ", "-"),
        symbol,
        id_slug
    ]
    return list(dict.fromkeys(variations))  # remove duplicates, preserve order

def download_coin_logos(coin):
    coin_name = coin["name"]
    symbol = coin["symbol"]
    coin_dir = os.path.join(LOGO_DIR, f"{coin_name.replace(' ', '_')}_{symbol}")
    os.makedirs(coin_dir, exist_ok=True)

    if coin_name in mapping and len(mapping[coin_name]["files"]) > 0:
        return  # Already has at least one logo

    downloaded = False
    files = []

    # Try all slug variations
    for slug in generate_possible_slugs(coin):
        if downloaded and len(files) >= 2:  # Already have SVG + PNG
            break

        # Try SVG
        svg_url = f"{CRYPTOLOGOS_BASE}/{slug}.svg{VERSION_PARAM}"
        svg_path = os.path.join(coin_dir, f"{coin_name}.svg")
        if download_file(svg_url, svg_path):
            files.append(svg_path.replace("\\", "/"))
            downloaded = True

        # Try PNG variants
        for size in SIZES:
            size_part = size if size else ""
            png_url = f"{CRYPTOLOGOS_BASE}/{slug}{size_part}.png{VERSION_PARAM}"
            filename = f"{coin_name}{size_part or ''}.png"
            png_path = os.path.join(coin_dir, filename)
            if download_file(png_url, png_path):
                files.append(png_path.replace("\\", "/"))
                downloaded = True

        if downloaded:
            mapping[coin_name] = {
                "symbol": symbol,
                "coingecko_id": coin["id"],
                "files": files
            }
            return

    # If nothing worked
    mapping[coin_name] = {
        "symbol": symbol,
        "coingecko_id": coin["id"],
        "files": files or None,
        "note": "not found on cryptologos.cc"
    }

def main():
    print("Fetching coin list from CoinGecko API...")
    all_coins = []
    page = 1

    with tqdm(desc="Fetching pages from CoinGecko", unit="page") as pbar:
        while True:
            url = f"{COINGECKO_API}?vs_currency=usd&order=market_cap_desc&per_page=250&page={page}&sparkline=false"
            try:
                r = requests.get(url, timeout=20)
                if r.status_code != 200:
                    break
                data = r.json()
                if not data:
                    break
                all_coins.extend(data)
                pbar.update(1)
                pbar.set_postfix({"Coins": len(all_coins)})
                page += 1
                time.sleep(1 / REQUESTS_PER_SECOND)
            except:
                break

    print(f"\nFetched {len(all_coins)} coins from CoinGecko. Starting download...\n")

    # Resume: filter out already fully processed
    coins_to_process = [
        coin for coin in all_coins
        if coin["name"] not in mapping or not mapping[coin["name"]].get("files")
    ]

    print(f"Resuming: {len(coins_to_process)} coins need checking/download...\n")

    for coin in tqdm(coins_to_process, desc="Downloading logos", unit="coin"):
        download_coin_logos(coin)
        time.sleep(0.05)  # Be gentle

    # Save final mapping
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(mapping, f, indent=4, ensure_ascii=False)

    successful = sum(1 for v in mapping.values() if v.get("files"))
    print(f"\nFINISHED!")
    print(f"Total coins processed: {len(mapping)}")
    print(f"Logos found: {successful}")
    print(f"Missing: {len(mapping) - successful}")
    print(f"Logos saved in: {LOGO_DIR}/")
    print(f"Mapping saved: {OUTPUT_JSON}")

if __name__ == "__main__":
    main()