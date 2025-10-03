<template>
  <div class="cosmic-bg min-h-screen px-10 py-5">
    <!-- Top Collections Slider -->
     <div class="h-3 bg-grad down"></div>
     
    <div class="nft-slider mb-8 overflow-x-scroll relative !pt-10 !px-[167px]">
        <div class="w-full div-up"></div>
      <div v-for="col in topCollections" :key="col.id" class="nft-slider-item group relative flex h-[600px] w-full flex-col items-center justify-between gap-5">
        <div class="relative flex w-full z-10 flex-col items-center">
          <div
            class="relative mb-2 h-[600px] max-h-[600px] min-h-[600px] w-full overflow-hidden bg-cover bg-center saturate-200 hue-rotate-60"
            :style="{ backgroundImage: `url(${col.image})` }"
          >
            <div class="pointer-events-none absolute inset-0 h-full" style="background-image: linear-gradient(0deg, #000 15%, rgba(0, 0, 0, 0.01) 100%)"></div>
            <!-- <span class="absolute inset-x-0 bottom-2 bg-black/60 px-2 py-1 text-xs text-gray-400" style="z-index: 2">Collection</span> -->
          </div>
          <div class="relative z-10 -mt-[300px] h-[90px] flex items-center justify-center gap-5">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 178 161" xml:space="preserve" class="!aw-12 !ah-12 fill-white text-white">
              <path
                class="!fill-[#6C00F6]"
                d="M66.8,54.7l-16.7-9.7L0,74.1v58l50.1,29l50.1-29V41.9L128,25.8l27.8,16.1v32.2L128,90.2l-16.7-9.7v25.8
	                l16.7,9.7l50.1-29V29L128,0L77.9,29v90.2l-27.8,16.1l-27.8-16.1V86.9l27.8-16.1l16.7,9.7V54.7z"
              />
            </svg>
            <!-- <img src="/src/assets/chains/polygon-matic-logo.svg" class="nft-icon !ah-8 !aw-8" /> -->
            <span class="text-left text-xl font-semibold text-white">{{ col.name }}</span>
          </div>
          <div class="text-gray relative z-10 mb-2 text-center text-xs whitespace-pre-line">
            {{ col.description || "Minimal cosmic collection." }}
          </div>
          <div class="relative z-10 mb-2 flex flex-row justify-center gap-4 text-xs text-[#b2b2ff]">
            <span>Items: {{ col.items || "---" }}</span>
            <span>Floor: {{ col.floor || "--" }}</span>
            <span>Volume: {{ col.volume || "--" }}</span>
          </div>
          <div class="p-5 w-full flex justify-center">

              <button class="nft-btn relative z-10 w-24" @click="$emit('viewCollection', col)">View</button>
            </div>
        </div>
        <!-- <div class="absolute inset-x-0 border-2 border-transparent group-hover:border-[#00fff7] transition-all pointer-events-none"></div> -->
      </div>
      <div class="h-3 bg-grad up"></div>
    </div>
    <!-- Tabs/Filters -->
    <div class="nft-tabs">
      <div v-for="tab in tabs" :key="tab" :class="['nft-tab', { active: tab === activeTab }]" @click="activeTab = tab">{{ tab }}</div>
    </div>
    <!-- Faucet/External Links -->
    <div class="mb-4 flex flex-wrap items-center justify-center gap-4 text-center">
      <a class="nft-faucet-link flex items-center gap-2" href="https://goerlifaucet.com/" target="_blank">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="4" width="16" height="16" rx="6" fill="#00fff7" opacity="0.7" />
        </svg>
        Goerli Faucet
      </a>
      <a class="nft-faucet-link flex items-center gap-2" href="https://faucet.testnet.immutable.com/" target="_blank">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="4" width="16" height="16" rx="6" fill="#00fff7" opacity="0.7" />
        </svg>
        Immutable Faucet
      </a>
      <a class="nft-faucet-link flex items-center gap-2" href="https://faucet.roninchain.com/" target="_blank">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="4" width="16" height="16" rx="6" fill="#00fff7" opacity="0.7" />
        </svg>
        Ronin Faucet
      </a>
      <a class="nft-market-link flex items-center gap-2" href="https://tokentrove.com/search?q=" target="_blank">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="4" width="16" height="16" rx="6" fill="#ff00cc" opacity="0.7" />
        </svg>
        TokenTrove
      </a>
    </div>
    <!-- NFT Grid -->
    <NFTGrid :nfts="filteredNFTs" @buy="openModal('buy', $event)" @mint="openModal('mint', $event)" @list="openModal('list', $event)" @transfer="openModal('transfer', $event)" @view="openModal('view', $event)">
      <template #toast>
        <div v-if="toastMsg" class="nft-toast">{{ toastMsg }}</div>
      </template>
      <template #modals>
        <div v-if="modalType" class="nft-modal" @click.self="closeModal">
          <div class="nft-modal-content">
            <h2 class="nft-name mb-2 text-center uppercase">{{ modalType }} NFT</h2>
            <div v-if="modalNFT">
              <img :src="modalNFT.image" class="nft-icon mb-2" />
              <div class="nft-details">
                <div class="nft-name">{{ modalNFT.name }}</div>
                <div class="nft-desc">{{ modalNFT.description }}</div>
                <div class="nft-meta">
                  <span>Chain: {{ modalNFT.chain }}</span>
                  <span>Price: {{ modalNFT.price }}</span>
                  <span>Royalty: {{ modalNFT.royalty }}</span>
                  <span>Owner: {{ modalNFT.owner }}</span>
                </div>
              </div>
              <div class="nft-actions mt-4">
                <button v-if="modalType === 'buy'" class="nft-btn" @click="doAction('buy')">Buy</button>
                <button v-if="modalType === 'mint'" class="nft-btn" @click="doAction('mint')">Mint</button>
                <button v-if="modalType === 'list'" class="nft-btn" @click="doAction('list')">List</button>
                <button v-if="modalType === 'transfer'" class="nft-btn" @click="doAction('transfer')">Transfer</button>
                <button v-if="modalType === 'view'" class="nft-btn" @click="closeModal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </NFTGrid>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import NFTGrid from "./NFTGrid.vue";

// Sample data for demo
const topCollections = [
  { id: 1, name: "Dragon Lords", image: "/images/nft/dragon-lords-copy.jpg" },
//   { id: 2, name: "Cosmic Heroes", image: "/images/nft/cosmic-heroes.jpg" },
  { id: 3, name: "Tiamat Relics", image: "/images/nft/tiamat-relics.jpg" },
  { id: 4, name: "Cosmic Heroes", image: "/images/nft/dragon-lords-exp.jpg" },
  { id: 5, name: "Tiamat Relics", image: "/images/nft/tiamat-relics.jpg" },
  { id: 6, name: "Cosmic Heroes", image: "/images/nft/dragon-lords-exp.jpg" },
  { id: 7, name: "Cosmic Heroes", image: "/images/nft/dragon-lords-exp.jpg" },
  { id: 8, name: "Cosmic Heroes", image: "/images/nft/dragon-lords-exp.jpg" },
  { id: 9, name: "Tiamat Relics", image: "/images/nft/tiamat-relics.jpg" },
  { id: 10, name: "Cosmic Heroes", image: "/images/nft/dragon-lords-exp.jpg" },
];

const tabs = ["All", "ETH", "Immutable", "Ronin", "Trending", "Dragons", "Heroes"];
const activeTab = ref("All");
const nfts = ref([
  {
    id: 101,
    name: "Tiamat Egg",
    description: "A rare cosmic dragon egg.",
    image: "/src/assets/chains/ethereum-eth-logo.svg",
    chain: "ETH",
    price: "0.2",
    royalty: "5%",
    owner: "0xA1B2...C3D4",
  },
  {
    id: 102,
    name: "Heroic Sword",
    description: "Forged for the bravest hero.",
    image: "/src/assets/chains/polygon-matic-logo.svg",
    chain: "Immutable",
    price: "12",
    royalty: "2%",
    owner: "0xE5F6...A7B8",
  },
  {
    id: 103,
    name: "Ronin Dragon",
    description: "A legendary Ronin chain dragon.",
    image: "/src/assets/chains/arbitrum-arb-logo.svg",
    chain: "Ronin",
    price: "3",
    royalty: "3%",
    owner: "0xC9D0...E1F2",
  },
  // ...more NFTs
]);
const filteredNFTs = computed(() => {
  if (activeTab.value === "All") return nfts.value;
  if (activeTab.value === "Trending") return nfts.value.slice(0, 2);
  if (activeTab.value === "Dragons") return nfts.value.filter((n) => n.name.toLowerCase().includes("dragon"));
  if (activeTab.value === "Heroes") return nfts.value.filter((n) => n.name.toLowerCase().includes("hero"));
  return nfts.value.filter((n) => n.chain === activeTab.value);
});

// Modal and toast logic
const modalType = ref("");
const modalNFT = ref(null);
const toastMsg = ref("");
function openModal(type, nft) {
  modalType.value = type;
  modalNFT.value = nft;
}
function closeModal() {
  modalType.value = "";
  modalNFT.value = null;
}
function doAction(type) {
  toastMsg.value = `${type.charAt(0).toUpperCase() + type.slice(1)} successful!`;
  closeModal();
  setTimeout(() => (toastMsg.value = ""), 2000);
}
</script>

<style scoped>
.aslider-image {
  @apply w-full max-w-[320px] min-w-[320px] object-contain;
  height: 756px;
  max-height: 756px;
  min-height: 756px;
}

.hue-rotate-60{
filter: hue-rotate(60deg) saturate(1) brightness(1);
/* Example: animate hue, saturation, and brightness */
animation: hueSaturateLight 3s linear infinite alternate;
}

@keyframes hueSaturateLight {
0% {
    filter: hue-rotate(-145deg) saturate(0.8) brightness(0.9);
}
50% {
    filter: hue-rotate(0deg) saturate(1.28) brightness(1.05);
}
100% {
    filter: hue-rotate(145deg) saturate(1.56) brightness(1.1);
}


}
</style>
