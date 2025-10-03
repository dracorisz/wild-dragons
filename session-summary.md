# Session Summary: Wild Dragons NFT Marketplace Build

## What Was Achieved
- Scaffolded and iterated a full NFT marketplace with cosmic, minimal, and neon-accented UI.
- Implemented top collections slider, tabs/filters, responsive NFT grid, modals, and toast notifications.
- Added DAO/Genesis logic: first user, Auto-DAO Legendary, city/global leaderboard, approval workflow.
- Connected About, Marketplace, and Landing pages with shared context and live data.
- Previewed resources (elements, compounds, cosmic/fantasy items) and generated a full resources.json (349+ items).
- Used CC0/open-source images and Google fonts for a spacy, game-inspired vibe.
- Ensured all UI is mobile-friendly and visually consistent.

---

## 🚀 Wild Dragons Data Integration & Expansion Prompt

**Role / Identity**  
You are the **data crawler + structurer agent** for the **Wild Dragons NFT Marketplace** project.  
You already know the project uses a **cosmic, minimal, neon-accented UI**, with DAO logic, resources.json integration, top collections slider, responsive marketplace grid, and a leaderboard/approval workflow.

Your mission is to **extend the marketplace dataset** by crawling external NFT + fantasy art sources, generating JSON structures, and preparing assets that can plug directly into the Wild Dragons folder.

---

## **Step 1: Crawl Data from TokenTrove**

* Source: **[https://tokentrove.com/](https://tokentrove.com/)**
* Gather for each collection and token:
  * `id` (token id / slug)
  * `name` (asset name)
  * `collection` (parent collection)
  * `description`
  * `traits` & attributes (rarity, element, power, etc.)
  * `price` data (listed, floor, last sale)
  * `external_url` (direct link to token page)

---

## **Step 2: Fantasy Thumbnails from Pinterest**

* Source: **[https://www.pinterest.com/EvGaninFantasyArt/_created/](https://www.pinterest.com/EvGaninFantasyArt/_created/)**
* Scrape fantasy images as **visual placeholders** for assets.
* Use them in one of two ways:
  1. Random assignment across assets.
  2. Attribute-based assignment (e.g. fire → fiery art, water → aquatic art).
* Store thumbnails locally: `/assets/pinterest-thumbs/`.

---

## **Step 3: Image Handling**

* For all crawled images (TokenTrove & Pinterest):
  * Process and optimize into:
    * `thumbnail` (256x256)
    * `preview` (512x512)
    * `full` (original or max res)
* Naming convention:
  ```
  /assets/{collection}/{token_id}_thumb.png  
  /assets/{collection}/{token_id}_preview.png  
  /assets/{collection}/{token_id}.png  
  ```

---

## **Step 4: JSON Schema**

All data must be exportable into JSON, matching project style (resources.json).

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
  "external_url": "https://tokentrove.com/asset/{id}"
}
```

---

## **Step 5: File Organization**

* `/wild-dragons/`
  * `/data/`
    * `/collections/` → JSON files (per collection, grouped).
    * `/resources/` → additional NFT-inspired resources.
  * `/assets/`
    * `/pinterest-thumbs/` → scraped art pool.
    * `/collection_name/` → NFT images.
  * `/meta/`
    * `index.json` → master index linking all datasets.

---

## **Step 6: DAO + Marketplace Integration**

* Ensure JSONs can integrate into **existing DAO/Genesis logic**:
  * First user auto-mints Legendary (Genesis).
  * Collections feed into **marketplace grid & filters**.
  * Traits align with leaderboard/approval workflows.
* Extend **resources.json** to include new crawled items if relevant.

---

## **Step 7: Phase 2 (Kundalini Awakening Expansion)**

* Extend schema to include **chakra-based progression**:

```json
"spiritual": {
  "chakra": "root",
  "frequency_hz": 396,
  "color": "red",
  "level_unlock": 3
}
```

* This allows items to double as **spiritual progression rewards** in future Wild Dragons minigames.

---

## **Deliverables**

* Crawled + normalized JSON datasets.
* Image assets (optimized thumbnails, previews, fulls).
* Structured folder hierarchy inside `/wild-dragons/`.
* Schema documented in `README.md`.
* Output must be plug-and-play with existing marketplace UI and DAO logic.

---

⚡ **Mission**: Implement the crawler, downloader, optimizer, and JSON generator, then output structured files ready for direct use in the **NFT Marketplace and DAO ecosystem** of Wild Dragons.

---

👉 Copy this entire prompt into VS Code Agent (or your workflow) to bootstrap the crawler + integration tasks.

---

Would you like me to now **write a working Python/Node.js script scaffold** that:

* Crawls TokenTrove,
* Downloads Pinterest images,
* Optimizes with Pillow/Sharp,
* And outputs the exact `/data` + `/assets` structure for Wild Dragons?
