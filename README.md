# Wild Dragons NFT Marketplace Data

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
