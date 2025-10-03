<template>
  <div class="cosmic-bg min-h-screen px-10 text-white py-10" style="font-family: 'Orbitron', sans-serif;">
    
    <h2 class="text-3xl font-bold mb-6" style="font-family: 'Orbitron', sans-serif;">About Wild Dragons NFT Marketplace</h2>
    <p class="mb-6 text-lg text-gray-300" style="font-family: 'Orbitron', sans-serif;">
      Welcome to the Wild Dragons NFT Marketplace. This platform is built for minimal cosmic vibes, neon accents, and fantasy/game-inspired collections. Explore top collections, mint, buy, and trade NFTs, and enjoy a seamless, mobile-friendly experience.
    </p>
    <!-- Genesis Input & Auto-DAO Legendary Concept -->
    <div class="mb-10">
      <h3 class="text-2xl font-bold mb-2" style="font-family: 'Orbitron', sans-serif;">Genesis Input & Auto-DAO Legendary</h3>
      <p class="mb-2 text-base text-gray-300">
        The first unique user to submit a genesis input (user ID 557) will receive the <span class="text-[#00fff7] font-bold">Auto-DAO Legendary</span> status for the first city and <span class="text-[#ff00cc] font-bold">Global-Cosmic-Summit C</span> status. All genesis inputs must be approved by current DAO members. This creates a living, evolving DAO where new members and cities are tracked live.
      </p>
      <div class="bg-black/60 rounded-lg p-4 mb-4">
        <strong>How it works:</strong>
        <ul class="list-disc ml-6 mt-2 text-sm text-gray-300">
          <li>Each user can submit one genesis input (first input is special).</li>
          <li>Inputs are reviewed and approved by current DAO members.</li>
          <li>The first city gets an Auto-DAO Legendary founder.</li>
          <li>Global-Cosmic-Summit status is tracked for global leaders.</li>
          <li>Leaderboard shows live member counts for each city and global DAO.</li>
        </ul>
      </div>
      <div class="mb-6">
        <h4 class="text-lg font-bold mb-2">Leaderboard (Live)</h4>
        <div class="flex gap-8">
          <div class="bg-black/70 rounded-lg p-4 flex-1">
            <div class="text-xl font-bold text-[#00fff7] mb-1">City DAO</div>
            <div class="text-3xl font-bold">{{ leaderboard.city }}</div>
            <div class="text-xs text-gray-400">Members</div>
          </div>
          <div class="bg-black/70 rounded-lg p-4 flex-1">
            <div class="text-xl font-bold text-[#ff00cc] mb-1">Global DAO</div>
            <div class="text-3xl font-bold">{{ leaderboard.global }}</div>
            <div class="text-xs text-gray-400">Members</div>
          </div>
        </div>
      </div>
    </div>
    <!-- CC0/Open Source Slider -->
    <div class="nft-slider mb-8 overflow-x-scroll">
      <div v-for="img in cc0Images" :key="img.src" class="nft-slider-item flex flex-col items-center justify-center p-6 gap-2" style="min-width:320px;max-width:320px;">
        <div class="w-full rounded-lg overflow-hidden mb-2" style="height:120px;position:relative;background: url(''+img.src+'') center center / cover no-repeat;">
          <div style="position:absolute;left:0;right:0;bottom:0;height:100%;background:linear-gradient(0deg,#000 80%,rgba(0,0,0,0.01) 100%);pointer-events:none;"></div>
        </div>
        <span class="text-white font-semibold text-lg" style="font-family: 'Orbitron', sans-serif;">{{ img.title }}</span>
        <span class="text-xs text-gray-400">{{ img.credit }}</span>
      </div>
    </div>
    <!-- Genesis Backlog JSON -->
    <h3 class="text-xl font-bold text-white mb-2" style="font-family: 'Orbitron', sans-serif;">Genesis Backlog</h3>
    <pre class="bg-black/80 text-green-400 p-6 rounded-lg overflow-x-auto text-xs" style="font-family: 'Orbitron', monospace;">
{{ genesisJsonA }}
    </pre>
    <!-- Resources Preview -->
    <h3 class="text-xl font-bold text-white mt-10 mb-2" style="font-family: 'Orbitron', sans-serif;">Marketplace Resources</h3>
    <div class="bg-black/60 rounded-lg p-4 mb-4 flex flex-wrap gap-4">
      <div v-for="res in resources.slice(0,12)" :key="res.id" class="flex flex-col items-center justify-center w-32 h-32 bg-[#181828] border border-[#00fff7] rounded-lg p-2">
        <span class="font-bold text-[#00fff7] text-sm mb-1">{{ res.name }}</span>
        <span class="text-xs text-gray-400">{{ res.type }}</span>
        <span class="text-xs text-gray-500">{{ res.category }}</span>
      </div>
      <div class="flex items-center justify-center w-32 h-32">
        <a href="/resources.json" target="_blank" class="nft-market-link text-xs">View All Resources (349+)</a>
      </div>
    </div>
    <div class="mb-6 flex gap-8 items-center">
      <a href="/marketplace" class="nft-market-link text-xs">Back to Marketplace</a>
      <span class="text-xs text-gray-400">Live DAO Members: {{ leaderboard.global }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const cc0Images = [
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    title: "Cosmic Landscape",
    credit: "Photo by Johannes Plenio (Unsplash, CC0)"
  },
  {
    src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    title: "Fantasy Mountain",
    credit: "Photo by Samuel Ferrara (Unsplash, CC0)"
  },
  {
    src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
    title: "Dragon Sky",
    credit: "Photo by Casey Horner (Unsplash, CC0)"
  },
  {
    src: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=600&q=80",
    title: "Nebula",
    credit: "Photo by NASA (Unsplash, CC0)"
  },
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
    title: "Starfield",
    credit: "Photo by Jeremy Thomas (Unsplash, CC0)"
  }
];

const genesisJsonA = `
{
  "marketplace": {
    "title": "Wild Dragons NFT Marketplace",
    "theme": "Minimal cosmic, neon accent, fantasy/game-inspired",
    "features": [
      "Top collections slider with background images and fade effect",
      "Tabs/filters for chain, trending, categories",
      "Responsive NFT grid with card backgrounds and fade",
      "NFT card: image, name, description, chain, price, royalty, owner, actions",
      "Prominent action buttons: Buy, Mint, List, Transfer, View",
      "Modals for all main actions",
      "Toast notifications for feedback",
      "Faucet and external marketplace links with icons",
      "Mobile-friendly, spacy, costy layout",
      "Genesis input, Auto-DAO Legendary, City/Global Leaderboard"
    ],
    "dao": {
      "genesisInput": {
        "firstUser": 557,
        "status": "Auto-DAO Legendary",
        "city": "First City",
        "globalSummit": "Global-Cosmic-Summit C"
      },
      "approvalRequired": true,
      "leaderboard": {
        "city": 1,
        "global": 1
      }
    },
    "collections": [
      {
        "id": 1,
        "name": "Dragon Lords",
        "description": "Genesis collection of cosmic dragons.",
        "image": "/images/nft/dragon-lords-copy.jpg",
        "items": 888,
        "floor": "0.15",
        "volume": "1200"
      },
      {
        "id": 2,
        "name": "Tiamat Relics",
        "description": "Artifacts from the World of Tiamat.",
        "image": "/images/nft/tiamat-relics.jpg",
        "items": 333,
        "floor": "0.22",
        "volume": "800"
      },
      {
        "id": 3,
        "name": "Cosmic Heroes",
        "description": "Heroes of the cosmic realms.",
        "image": "/images/nft/dragon-lords-exp.jpg",
        "items": 555,
        "floor": "0.18",
        "volume": "950"
      }
    ],
    "nfts": [
      {
        "id": 101,
        "name": "Tiamat Egg",
        "description": "A rare cosmic dragon egg.",
        "image": "/src/assets/chains/ethereum-eth-logo.svg",
        "chain": "ETH",
        "price": "0.2",
        "royalty": "5%",
        "owner": "0xA1B2...C3D4"
      },
      {
        "id": 102,
        "name": "Heroic Sword",
        "description": "Forged for the bravest hero.",
        "image": "/src/assets/chains/polygon-matic-logo.svg",
        "chain": "Immutable",
        "price": "12",
        "royalty": "2%",
        "owner": "0xE5F6...A7B8"
      },
      {
        "id": 103,
        "name": "Ronin Dragon",
        "description": "A legendary Ronin chain dragon.",
        "image": "/src/assets/chains/arbitrum-arb-logo.svg",
        "chain": "Ronin",
        "price": "3",
        "royalty": "3%",
        "owner": "0xC9D0...E1F2"
      }
    ],
    "actions": [
      "Buy NFT",
      "Mint NFT",
      "List NFT",
      "Transfer NFT",
      "View NFT Details"
    ],
    "externalLinks": [
      { "name": "Goerli Faucet", "url": "https://goerlifaucet.com/" },
      { "name": "Immutable Faucet", "url": "https://faucet.testnet.immutable.com/" },
      { "name": "Ronin Faucet", "url": "https://faucet.roninchain.com/" },
      { "name": "TokenTrove", "url": "https://tokentrove.com/search?q=" }
    ]
  }
}
`;

// Simulated live leaderboard (replace with store/db logic)
const leaderboard = ref({ city: 1, global: 1 });
onMounted(() => {
  // Simulate live updates (replace with real db/store logic)
  setInterval(() => {
    leaderboard.value.city = 1 + Math.floor(Math.random() * 10);
    leaderboard.value.global = 1 + Math.floor(Math.random() * 100);
  }, 3000);
});

const resources = [
  // Sample from resources.json
  { id: 1, name: "Hydrogen", type: "Element", category: "Periodic Table" },
  { id: 2, name: "Helium", type: "Element", category: "Periodic Table" },
  { id: 3, name: "Lithium", type: "Element", category: "Periodic Table" },
  { id: 4, name: "Gold", type: "Element", category: "Precious Metal" },
  { id: 5, name: "Water", type: "Compound", category: "Essential" },
  { id: 6, name: "Dark Matter", type: "Cosmic", category: "Generated" },
  { id: 7, name: "Dragon Scale", type: "Fantasy", category: "Generated" },
  { id: 8, name: "Stardust", type: "Cosmic", category: "Generated" },
  { id: 9, name: "Platinum", type: "Element", category: "Precious Metal" },
  { id: 10, name: "Neutronium", type: "Cosmic", category: "Generated" },
  { id: 11, name: "Mana Crystal", type: "Fantasy", category: "Generated" },
  { id: 12, name: "Quantum Foam", type: "Cosmic", category: "Generated" }
  // ...up to 349+ resources in resources.json
];
</script>
