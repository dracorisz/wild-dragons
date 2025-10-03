<template>
  <div class="cosmic-bg min-h-screen px-10 py-10">
    <h1 class="text-3xl font-bold text-white mb-6">NFT Marketplace Genesis Backlog</h1>
    <pre class="bg-black/80 text-green-400 p-6 rounded-lg overflow-x-auto text-xs">
{{ genesisJson }}
    </pre>
  </div>
</template>

<script setup>
const genesisJson = `
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
      "Mobile-friendly, spacy, costy layout"
    ],
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
</script>
