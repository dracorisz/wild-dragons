@echo off
echo ===================================================
echo Wild Dragons NFT Marketplace - Complete Build Script
echo ===================================================
echo.

echo Step 1: Checking Python installation...
call check-python.bat
if %errorlevel% neq 0 (
  echo Python environment check failed. Please install Python and try again.
  goto :error
)

echo.
echo Step 2: Creating directory structure...
call create-directories.bat
if %errorlevel% neq 0 (
  echo Directory creation failed.
  goto :error
)

echo.
echo Step 3: Generating mock data...
if not exist "crawler" mkdir crawler
if not exist "crawler\mock_data_generator.py" (
  echo Creating mock data generator script...
  call :create_mock_data_generator
)
python crawler\mock_data_generator.py
if %errorlevel% neq 0 (
  echo Mock data generation failed.
  goto :error
)

echo.
echo Step 4: Creating placeholder images...
python create-placeholder-images.py
if %errorlevel% neq 0 (
  echo Placeholder image generation failed.
  goto :error
)

echo.
echo Step 5: Checking frontend dependencies...
if not exist "node_modules" (
  echo Installing Node.js dependencies...
  npm install
  if %errorlevel% neq 0 (
    echo Node.js dependency installation failed.
    goto :error
  )
)

echo.
echo Step 6: Creating Vue component files...
call :create_vue_components
if %errorlevel% neq 0 (
  echo Vue component creation failed.
  goto :error
)

echo.
echo Step 7: Building the application...
npm run build
if %errorlevel% neq 0 (
  echo Application build failed.
  goto :error
)

echo.
echo ===================================================
echo Wild Dragons NFT Marketplace build completed successfully!
echo.
echo To start the development server:
echo   npm run dev
echo.
echo To view the application, navigate to:
echo   http://localhost:5173/
echo ===================================================
goto :end

:error
echo.
echo Build process encountered an error.
exit /b 1

:create_mock_data_generator
echo import os > crawler\mock_data_generator.py
echo import json >> crawler\mock_data_generator.py
echo import random >> crawler\mock_data_generator.py
echo from datetime import datetime >> crawler\mock_data_generator.py
echo. >> crawler\mock_data_generator.py
echo # Define constants for mock data generation >> crawler\mock_data_generator.py
echo COLLECTION_COUNT = 5 >> crawler\mock_data_generator.py
echo ITEMS_PER_COLLECTION = 10 >> crawler\mock_data_generator.py
echo RARITY_LEVELS = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"] >> crawler\mock_data_generator.py
echo ELEMENTS = ["Fire", "Water", "Earth", "Air", "Light", "Dark", "Cosmic", "Nature", "Mechanical"] >> crawler\mock_data_generator.py
echo COLLECTIONS = [ >> crawler\mock_data_generator.py
echo     {"id": "dragons", "name": "Wild Dragons", "description": "Mythical dragons from another dimension"}, >> crawler\mock_data_generator.py
echo     {"id": "cosmic", "name": "Cosmic Entities", "description": "Beings from the far reaches of space"}, >> crawler\mock_data_generator.py
echo     {"id": "elemental", "name": "Elemental Guardians", "description": "Protectors of the natural forces"}, >> crawler\mock_data_generator.py
echo     {"id": "fantasy", "name": "Fantasy Heroes", "description": "Legendary heroes from ancient tales"}, >> crawler\mock_data_generator.py
echo     {"id": "mythical", "name": "Mythical Creatures", "description": "Creatures from myths and legends"} >> crawler\mock_data_generator.py
echo ] >> crawler\mock_data_generator.py
echo CHAKRAS = [ >> crawler\mock_data_generator.py
echo     {"name": "root", "frequency_hz": 396, "color": "red", "level_unlock": 1}, >> crawler\mock_data_generator.py
echo     {"name": "sacral", "frequency_hz": 417, "color": "orange", "level_unlock": 2}, >> crawler\mock_data_generator.py
echo     {"name": "solar_plexus", "frequency_hz": 528, "color": "yellow", "level_unlock": 3}, >> crawler\mock_data_generator.py
echo     {"name": "heart", "frequency_hz": 639, "color": "green", "level_unlock": 4}, >> crawler\mock_data_generator.py
echo     {"name": "throat", "frequency_hz": 741, "color": "blue", "level_unlock": 5}, >> crawler\mock_data_generator.py
echo     {"name": "third_eye", "frequency_hz": 852, "color": "indigo", "level_unlock": 6}, >> crawler\mock_data_generator.py
echo     {"name": "crown", "frequency_hz": 963, "color": "violet", "level_unlock": 7} >> crawler\mock_data_generator.py
echo ] >> crawler\mock_data_generator.py
echo. >> crawler\mock_data_generator.py
echo def generate_random_price(): >> crawler\mock_data_generator.py
echo     """Generate random ETH price string""" >> crawler\mock_data_generator.py
echo     price = random.uniform(0.1, 5.0) >> crawler\mock_data_generator.py
echo     return f"{price:.2f} ETH" >> crawler\mock_data_generator.py
echo. >> crawler\mock_data_generator.py
echo def generate_nft(collection, index): >> crawler\mock_data_generator.py
echo     """Generate a single NFT item""" >> crawler\mock_data_generator.py
echo. >> crawler\mock_data_generator.py
echo     element = random.choice(ELEMENTS) >> crawler\mock_data_generator.py
echo     rarity = random.choices(RARITY_LEVELS, weights=[50, 30, 15, 10, 3, 1])[0] >> crawler\mock_data_generator.py
echo     chakra = random.choice(CHAKRAS) >> crawler\mock_data_generator.py
echo     power = random.randint(30, 100) >> crawler\mock_data_generator.py
echo. >> crawler\mock_data_generator.py
echo     # Make power value correlate with rarity >> crawler\mock_data_generator.py
echo     rarity_boost = RARITY_LEVELS.index(rarity) * 10 >> crawler\mock_data_generator.py
echo     power = min(100, power + rarity_boost) >> crawler\mock_data_generator.py
echo. >> crawler\mock_data_generator.py
echo     return { >> crawler\mock_data_generator.py
echo         "id": f"{collection['id']}_{index}", >> crawler\mock_data_generator.py
echo         "name": f"{element} {collection['name']} #{index}", >> crawler\mock_data_generator.py
echo         "collection": collection["name"], >> crawler\mock_data_generator.py
echo         "description": f"A powerful {rarity.lower()} {element.lower()} from the {collection['name']} collection. {collection['description']}.", >> crawler\mock_data_generator.py
echo         "image": { >> crawler\mock_data_generator.py
echo             "thumbnail": f"/assets/{collection['id']}/{collection['id']}_{index}_thumb.png", >> crawler\mock_data_generator.py
echo             "preview": f"/assets/{collection['id']}/{collection['id']}_{index}_preview.png", >> crawler\mock_data_generator.py
echo             "full": f"/assets/{collection['id']}/{collection['id']}_{index}.png" >> crawler\mock_data_generator.py
echo         }, >> crawler\mock_data_generator.py
echo         "traits": { >> crawler\mock_data_generator.py
echo             "rarity": rarity, >> crawler\mock_data_generator.py
echo             "element": element, >> crawler\mock_data_generator.py
echo             "power": power >> crawler\mock_data_generator.py
echo         }, >> crawler\mock_data_generator.py
echo         "spiritual": { >> crawler\mock_data_generator.py
echo             "chakra": chakra["name"], >> crawler\mock_data_generator.py
echo             "frequency_hz": chakra["frequency_hz"], >> crawler\mock_data_generator.py
echo             "color": chakra["color"], >> crawler\mock_data_generator.py
echo             "level_unlock": chakra["level_unlock"] >> crawler\mock_data_generator.py
echo         }, >> crawler\mock_data_generator.py
echo         "price": { >> crawler\mock_data_generator.py
echo             "listed": generate_random_price(), >> crawler\mock_data_generator.py
echo             "floor": generate_random_price(), >> crawler\mock_data_generator.py
echo             "last_sale": generate_random_price() >> crawler\mock_data_generator.py
echo         }, >> crawler\mock_data_generator.py
echo         "external_url": f"https://example.com/nft/{collection['id']}/{index}", >> crawler\mock_data_generator.py
echo         "created_at": datetime.now().isoformat() >> crawler\mock_data_generator.py
echo     } >> crawler\mock_data_generator.py
echo. >> crawler\mock_data_generator.py
echo def generate_mock_data(): >> crawler\mock_data_generator.py
echo     """Generate mock data for Wild Dragons NFT Marketplace""" >> crawler\mock_data_generator.py
echo. >> crawler\mock_data_generator.py
echo     # Create directory structure >> crawler\mock_data_generator.py
echo     os.makedirs("data/collections", exist_ok=True) >> crawler\mock_data_generator.py
echo     os.makedirs("meta", exist_ok=True) >> crawler\mock_data_generator.py
echo. >> crawler\mock_data_generator.py
echo     collections_data = {} >> crawler\mock_data_generator.py
echo     all_nfts = [] >> crawler\mock_data_generator.py
echo. >> crawler\mock_data_generator.py
echo     # Use pre-defined collections >> crawler\mock_data_generator.py
echo     collections = COLLECTIONS[:COLLECTION_COUNT] >> crawler\mock_data_generator.py
echo. >> crawler\mock_data_generator.py
echo     # Generate data for each collection >> crawler\mock_data_generator.py
echo     for collection in collections: >> crawler\mock_data_generator.py
echo         nfts = [generate_nft(collection, i+1) for i in range(ITEMS_PER_COLLECTION)] >> crawler\mock_data_generator.py
echo. >> crawler\mock_data_generator.py
echo         # Save collection data >> crawler\mock_data_generator.py
echo         collection_path = f"data/collections/{collection['id']}.json" >> crawler\mock_data_generator.py
echo         with open(collection_path, "w") as f: >> crawler\mock_data_generator.py
echo             json.dump(nfts, f, indent=2) >> crawler\mock_data_generator.py
echo. >> crawler\mock_data_generator.py
echo         # Add to master collection >> crawler\mock_data_generator.py
echo         collections_data[collection["id"]] = { >> crawler\mock_data_generator.py
echo             "name": collection["name"], >> crawler\mock_data_generator.py
echo             "item_count": len(nfts), >> crawler\mock_data_generator.py
echo             "description": collection["description"], >> crawler\mock_data_generator.py
echo             "file_path": f"/data/collections/{collection['id']}.json" >> crawler\mock_data_generator.py
echo         } >> crawler\mock_data_generator.py
echo. >> crawler\mock_data_generator.py
echo         all_nfts.extend(nfts) >> crawler\mock_data_generator.py
echo. >> crawler\mock_data_generator.py
echo     # Create master index >> crawler\mock_data_generator.py
echo     master_index = { >> crawler\mock_data_generator.py
echo         "version": "1.0.0", >> crawler\mock_data_generator.py
echo         "generated_at": datetime.now().isoformat(), >> crawler\mock_data_generator.py
echo         "collection_count": len(collections), >> crawler\mock_data_generator.py
echo         "total_items": len(all_nfts), >> crawler\mock_data_generator.py
echo         "collections": collections_data >> crawler\mock_data_generator.py
echo     } >> crawler\mock_data_generator.py
echo. >> crawler\mock_data_generator.py
echo     with open("meta/index.json", "w") as f: >> crawler\mock_data_generator.py
echo         json.dump(master_index, f, indent=2) >> crawler\mock_data_generator.py
echo. >> crawler\mock_data_generator.py
echo     print(f"Generated mock data for {len(collections)} collections with {len(all_nfts)} total NFTs") >> crawler\mock_data_generator.py
echo     print("Files saved to data/collections/ and meta/") >> crawler\mock_data_generator.py
echo. >> crawler\mock_data_generator.py
echo if __name__ == "__main__": >> crawler\mock_data_generator.py
echo     print("Generating mock data for Wild Dragons NFT Marketplace...") >> crawler\mock_data_generator.py
echo     generate_mock_data() >> crawler\mock_data_generator.py
echo     print("Done!") >> crawler\mock_data_generator.py
exit /b 0

:create_vue_components
echo Creating Vue components...

if not exist "src" mkdir src
if not exist "src\components" mkdir src\components
if not exist "src\views" mkdir src\views
if not exist "src\router" mkdir src\router
if not exist "src\stores" mkdir src\stores

echo Creating App.vue...
echo ^<template^> > src\App.vue
echo   ^<router-view /^> >> src\App.vue
echo ^</template^> >> src\App.vue

echo Creating main.js...
echo import { createApp } from 'vue' > src\main.js
echo import { createPinia } from 'pinia' >> src\main.js
echo import App from './App.vue' >> src\main.js
echo import router from './router' >> src\main.js
echo import './style.css' >> src\main.js
echo. >> src\main.js
echo const app = createApp(App) >> src\main.js
echo const pinia = createPinia() >> src\main.js
echo. >> src\main.js
echo app.use(router) >> src\main.js
echo app.use(pinia) >> src\main.js
echo. >> src\main.js
echo app.mount('#app') >> src\main.js

echo Creating style.css...
echo @tailwind base; > src\style.css
echo @tailwind components; >> src\style.css
echo @tailwind utilities; >> src\style.css
echo. >> src\style.css
echo body { >> src\style.css
echo   @apply bg-primary text-white; >> src\style.css
echo   font-family: 'Merriweather', serif; >> src\style.css
echo } >> src\style.css
echo. >> src\style.css
echo h1, h2, h3, h4, h5, h6 { >> src\style.css
echo   font-family: 'MedievalSharp', cursive; >> src\style.css
echo } >> src\style.css

echo Creating NFTMarketplace.vue component...
call :create_marketplace_component

echo Creating HomePage.vue view...
call :create_home_page

echo Done creating Vue components!
exit /b 0

:create_marketplace_component
echo ^<template^> > src\components\NFTMarketplace.vue
echo   ^<div class="nft-marketplace p-4"^> >> src\components\NFTMarketplace.vue
echo     ^<!-- Collection Filter --^> >> src\components\NFTMarketplace.vue
echo     ^<div class="collection-filters mb-8 overflow-x-auto"^> >> src\components\NFTMarketplace.vue
echo       ^<h2 class="text-2xl font-bold mb-4 text-dragon"^>Collections^</h2^> >> src\components\NFTMarketplace.vue
echo       ^<div class="filters-row flex space-x-3"^> >> src\components\NFTMarketplace.vue
echo         ^<button >> src\components\NFTMarketplace.vue
echo           v-for="(collection, id) in collections" >> src\components\NFTMarketplace.vue
echo           :key="id" >> src\components\NFTMarketplace.vue
echo           @click="selectedCollection = id === selectedCollection ? null : id" >> src\components\NFTMarketplace.vue
echo           :class="[ >> src\components\NFTMarketplace.vue
echo             'px-4 py-2 rounded-lg whitespace-nowrap transition-all', >> src\components\NFTMarketplace.vue
echo             selectedCollection === id  >> src\components\NFTMarketplace.vue
echo               ? 'bg-accent text-white'  >> src\components\NFTMarketplace.vue
echo               : 'bg-primary/20 hover:bg-primary/40 text-white' >> src\components\NFTMarketplace.vue
echo           ]" >> src\components\NFTMarketplace.vue
echo         ^> >> src\components\NFTMarketplace.vue
echo           {{ collection.name }} ({{ collection.item_count }}) >> src\components\NFTMarketplace.vue
echo         ^</button^> >> src\components\NFTMarketplace.vue
echo       ^</div^> >> src\components\NFTMarketplace.vue
echo     ^</div^> >> src\components\NFTMarketplace.vue
echo. >> src\components\NFTMarketplace.vue
echo     ^<!-- NFT Grid --^> >> src\components\NFTMarketplace.vue
echo     ^<div v-if="!loading" class="nft-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"^> >> src\components\NFTMarketplace.vue
echo       ^<div >> src\components\NFTMarketplace.vue
echo         v-for="nft in filteredNFTs" >> src\components\NFTMarketplace.vue
echo         :key="nft.id" >> src\components\NFTMarketplace.vue
echo         class="nft-card bg-primary/10 rounded-xl overflow-hidden border border-primary/30 hover:border-accent transition-all cursor-pointer" >> src\components\NFTMarketplace.vue
echo         @click="selectedNFT = nft" >> src\components\NFTMarketplace.vue
echo       ^> >> src\components\NFTMarketplace.vue
echo         ^<div class="nft-image relative aspect-square overflow-hidden"^> >> src\components\NFTMarketplace.vue
echo           ^<img  >> src\components\NFTMarketplace.vue
echo             :src="nft.image.preview"  >> src\components\NFTMarketplace.vue
echo             :alt="nft.name" >> src\components\NFTMarketplace.vue
echo             class="w-full h-full object-cover" >> src\components\NFTMarketplace.vue
echo           /^> >> src\components\NFTMarketplace.vue
echo           ^<div class="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs"^> >> src\components\NFTMarketplace.vue
echo             {{ nft.traits.rarity }} >> src\components\NFTMarketplace.vue
echo           ^</div^> >> src\components\NFTMarketplace.vue
echo         ^</div^> >> src\components\NFTMarketplace.vue
echo         ^<div class="p-4"^> >> src\components\NFTMarketplace.vue
echo           ^<h3 class="text-lg font-bold mb-1"^>{{ nft.name }}^</h3^> >> src\components\NFTMarketplace.vue
echo           ^<p class="text-sm text-gray-400 h-12 overflow-hidden"^>{{ nft.description }}^</p^> >> src\components\NFTMarketplace.vue
echo           ^<div class="flex justify-between items-center mt-4"^> >> src\components\NFTMarketplace.vue
echo             ^<div class="price text-dragon font-medium"^>{{ nft.price.listed }}^</div^> >> src\components\NFTMarketplace.vue
echo             ^<div class="power flex items-center"^> >> src\components\NFTMarketplace.vue
echo               ^<span class="text-sm mr-1"^>Power:^</span^> >> src\components\NFTMarketplace.vue
echo               ^<span class="text-accent font-bold"^>{{ nft.traits.power }}^</span^> >> src\components\NFTMarketplace.vue
echo             ^</div^> >> src\components\NFTMarketplace.vue
echo           ^</div^> >> src\components\NFTMarketplace.vue
echo         ^</div^> >> src\components\NFTMarketplace.vue
echo       ^</div^> >> src\components\NFTMarketplace.vue
echo     ^</div^> >> src\components\NFTMarketplace.vue
echo. >> src\components\NFTMarketplace.vue
echo     ^<!-- NFT Modal --^> >> src\components\NFTMarketplace.vue
echo     ^<div v-if="selectedNFT" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"^> >> src\components\NFTMarketplace.vue
echo       ^<div class="bg-primary max-w-4xl w-full rounded-xl overflow-hidden"^> >> src\components\NFTMarketplace.vue
echo         ^<button @click="selectedNFT = null" class="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full"^>×^</button^> >> src\components\NFTMarketplace.vue
echo         ^<div class="grid md:grid-cols-2"^> >> src\components\NFTMarketplace.vue
echo           ^<div class="bg-black"^> >> src\components\NFTMarketplace.vue
echo             ^<img :src="selectedNFT.image.full" :alt="selectedNFT.name" class="w-full h-full object-contain" /^> >> src\components\NFTMarketplace.vue
echo           ^</div^> >> src\components\NFTMarketplace.vue
echo           ^<div class="p-6"^> >> src\components\NFTMarketplace.vue
echo             ^<h2 class="text-2xl font-bold"^>{{ selectedNFT.name }}^</h2^> >> src\components\NFTMarketplace.vue
echo             ^<p class="text-sm text-dragon mb-4"^>{{ selectedNFT.collection }}^</p^> >> src\components\NFTMarketplace.vue
echo             ^<p class="mb-4"^>{{ selectedNFT.description }}^</p^> >> src\components\NFTMarketplace.vue
echo             ^<div class="grid grid-cols-2 gap-2 mb-4"^> >> src\components\NFTMarketplace.vue
echo               ^<div class="p-2 bg-primary/20 rounded"^> >> src\components\NFTMarketplace.vue
echo                 ^<span class="block text-xs opacity-70"^>Rarity^</span^> >> src\components\NFTMarketplace.vue
echo                 ^<span class="font-medium"^>{{ selectedNFT.traits.rarity }}^</span^> >> src\components\NFTMarketplace.vue
echo               ^</div^> >> src\components\NFTMarketplace.vue
echo               ^<div class="p-2 bg-primary/20 rounded"^> >> src\components\NFTMarketplace.vue
echo                 ^<span class="block text-xs opacity-70"^>Element^</span^> >> src\components\NFTMarketplace.vue
echo                 ^<span class="font-medium"^>{{ selectedNFT.traits.element }}^</span^> >> src\components\NFTMarketplace.vue
echo               ^</div^> >> src\components\NFTMarketplace.vue
echo               ^<div class="p-2 bg-primary/20 rounded"^> >> src\components\NFTMarketplace.vue
echo                 ^<span class="block text-xs opacity-70"^>Power^</span^> >> src\components\NFTMarketplace.vue
echo                 ^<span class="font-medium"^>{{ selectedNFT.traits.power }}^</span^> >> src\components\NFTMarketplace.vue
echo               ^</div^> >> src\components\NFTMarketplace.vue
echo               ^<div class="p-2 bg-primary/20 rounded"^> >> src\components\NFTMarketplace.vue
echo                 ^<span class="block text-xs opacity-70"^>Chakra^</span^> >> src\components\NFTMarketplace.vue
echo                 ^<span class="font-medium"^>{{ selectedNFT.spiritual.chakra }}^</span^> >> src\components\NFTMarketplace.vue
echo               ^</div^> >> src\components\NFTMarketplace.vue
echo             ^</div^> >> src\components\NFTMarketplace.vue
echo             ^<div class="border-t border-primary/30 pt-4 mt-4"^> >> src\components\NFTMarketplace.vue
echo               ^<div class="flex justify-between mb-2"^> >> src\components\NFTMarketplace.vue
echo                 ^<span^>Listed Price:^</span^> >> src\components\NFTMarketplace.vue
echo                 ^<span class="text-dragon font-bold"^>{{ selectedNFT.price.listed }}^</span^> >> src\components\NFTMarketplace.vue
echo               ^</div^> >> src\components\NFTMarketplace.vue
echo               ^<button class="w-full py-3 bg-accent text-white rounded-lg font-bold mt-4"^>Mint Now^</button^> >> src\components\NFTMarketplace.vue
echo             ^</div^> >> src\components\NFTMarketplace.vue
echo           ^</div^> >> src\components\NFTMarketplace.vue
echo         ^</div^> >> src\components\NFTMarketplace.vue
echo       ^</div^> >> src\components\NFTMarketplace.vue
echo     ^</div^> >> src\components\NFTMarketplace.vue
echo   ^</div^> >> src\components\NFTMarketplace.vue
echo ^</template^> >> src\components\NFTMarketplace.vue
echo. >> src\components\NFTMarketplace.vue
echo ^<script^> >> src\components\NFTMarketplace.vue
echo export default { >> src\components\NFTMarketplace.vue
echo   name: 'NFTMarketplace', >> src\components\NFTMarketplace.vue
echo   data() { >> src\components\NFTMarketplace.vue
echo     return { >> src\components\NFTMarketplace.vue
echo       loading: true, >> src\components\NFTMarketplace.vue
echo       collections: {}, >> src\components\NFTMarketplace.vue
echo       nfts: [], >> src\components\NFTMarketplace.vue
echo       selectedCollection: null, >> src\components\NFTMarketplace.vue
echo       selectedNFT: null >> src\components\NFTMarketplace.vue
echo     } >> src\components\NFTMarketplace.vue
echo   }, >> src\components\NFTMarketplace.vue
echo   computed: { >> src\components\NFTMarketplace.vue
echo     filteredNFTs() { >> src\components\NFTMarketplace.vue
echo       if (!this.selectedCollection) { >> src\components\NFTMarketplace.vue
echo         return this.nfts; >> src\components\NFTMarketplace.vue
echo       } >> src\components\NFTMarketplace.vue
echo       return this.nfts.filter(nft =^> nft.collection === this.collections[this.selectedCollection].name); >> src\components\NFTMarketplace.vue
echo     } >> src\components\NFTMarketplace.vue
echo   }, >> src\components\NFTMarketplace.vue
echo   mounted() { >> src\components\NFTMarketplace.vue
echo     this.fetchData(); >> src\components\NFTMarketplace.vue
echo   }, >> src\components\NFTMarketplace.vue
echo   methods: { >> src\components\NFTMarketplace.vue
echo     async fetchData() { >> src\components\NFTMarketplace.vue
echo       try { >> src\components\NFTMarketplace.vue
echo         // Load index file >> src\components\NFTMarketplace.vue
echo         const indexResponse = await fetch('/meta/index.json'); >> src\components\NFTMarketplace.vue
echo         if (!indexResponse.ok) throw new Error('Failed to fetch index'); >> src\components\NFTMarketplace.vue
echo         const indexData = await indexResponse.json(); >> src\components\NFTMarketplace.vue
echo         this.collections = indexData.collections; >> src\components\NFTMarketplace.vue
echo. >> src\components\NFTMarketplace.vue
echo         // Load NFT data from collections >> src\components\NFTMarketplace.vue
echo         const allNfts = []; >> src\components\NFTMarketplace.vue
echo         for (const [id, collection] of Object.entries(this.collections)) { >> src\components\NFTMarketplace.vue
echo           const collectionResponse = await fetch(`/data/collections/${id}.json`); >> src\components\NFTMarketplace.vue
echo           if (!collectionResponse.ok) continue; >> src\components\NFTMarketplace.vue
echo           const nftData = await collectionResponse.json(); >> src\components\NFTMarketplace.vue
echo           allNfts.push(...nftData); >> src\components\NFTMarketplace.vue
echo         } >> src\components\NFTMarketplace.vue
echo         this.nfts = allNfts; >> src\components\NFTMarketplace.vue
echo       } catch (error) { >> src\components\NFTMarketplace.vue
echo         console.error('Error loading NFT data:', error); >> src\components\NFTMarketplace.vue
echo         // Use fallback data if API fails >> src\components\NFTMarketplace.vue
echo         this.useFallbackData(); >> src\components\NFTMarketplace.vue
echo       } finally { >> src\components\NFTMarketplace.vue
echo         this.loading = false; >> src\components\NFTMarketplace.vue
echo       } >> src\components\NFTMarketplace.vue
echo     }, >> src\components\NFTMarketplace.vue
echo     useFallbackData() { >> src\components\NFTMarketplace.vue
echo       this.collections = { >> src\components\NFTMarketplace.vue
echo         'dragons': { name: 'Wild Dragons', item_count: 5 }, >> src\components\NFTMarketplace.vue
echo         'cosmic': { name: 'Cosmic Entities', item_count: 5 } >> src\components\NFTMarketplace.vue
echo       }; >> src\components\NFTMarketplace.vue
echo       this.nfts = []; >> src\components\NFTMarketplace.vue
echo     } >> src\components\NFTMarketplace.vue
echo   } >> src\components\NFTMarketplace.vue
echo } >> src\components\NFTMarketplace.vue
echo ^</script^> >> src\components\NFTMarketplace.vue
exit /b 0

:create_home_page
echo ^<template^> > src\views\HomePage.vue
echo   ^<div class="min-h-screen flex flex-col"^> >> src\views\HomePage.vue
echo     ^<header class="bg-primary/80 py-12 text-center"^> >> src\views\HomePage.vue
echo       ^<h1 class="text-5xl font-bold mb-4 bg-gradient-to-r from-dragon to-accent bg-clip-text text-transparent"^>Heroine's Dragon^</h1^> >> src\views\HomePage.vue
echo       ^<p class="max-w-2xl mx-auto text-lg px-4"^> >> src\views\HomePage.vue
echo         Explore the World of Tiamat, where legends awaken, dragons soar, and every heroine shapes the fate of realms untold. >> src\views\HomePage.vue
echo       ^</p^> >> src\views\HomePage.vue
echo     ^</header^> >> src\views\HomePage.vue
echo. >> src\views\HomePage.vue
echo     ^<main class="flex-grow container mx-auto py-8 px-4"^> >> src\views\HomePage.vue
echo       ^<h2 class="text-3xl font-bold mb-8 text-center"^>NFT Marketplace^</h2^> >> src\views\HomePage.vue
echo       ^<NFTMarketplace /^> >> src\views\HomePage.vue
echo     ^</main^> >> src\views\HomePage.vue
echo. >> src\views\HomePage.vue
echo     ^<footer class="bg-primary/50 py-6 text-center"^> >> src\views\HomePage.vue
echo       ^<p^>© {{ new Date().getFullYear() }} Heroine's Dragon. All rights reserved.^</p^> >> src\views\HomePage.vue
echo     ^</footer^> >> src\views\HomePage.vue
echo   ^</div^> >> src\views\HomePage.vue
echo ^</template^> >> src\views\HomePage.vue
echo. >> src\views\HomePage.vue
echo ^<script^> >> src\views\HomePage.vue
echo import NFTMarketplace from '../components/NFTMarketplace.vue' >> src\views\HomePage.vue
echo. >> src\views\HomePage.vue
echo export default { >> src\views\HomePage.vue
echo   name: 'HomePage', >> src\views\HomePage.vue
echo   components: { >> src\views\HomePage.vue
echo     NFTMarketplace >> src\views\HomePage.vue
echo   } >> src\views\HomePage.vue
echo } >> src\views\HomePage.vue
echo ^</script^> >> src\views\HomePage.vue
exit /b 0

:end
echo.
pause
