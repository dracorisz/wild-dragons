// Centralized NFT data source for DevSTon components
// All NFT-related components should use this shared data for consistency

export const NFT_DATA = {
  // Genesis Collection NFTs - Shared across all components
  genesis: [
    {
      id: "genesis-001",
      title: "Community Spirit",
      description: "Expressing love and appreciation for DevSTon community. The final piece of our Genesis collection, celebrating the heart of DevSTon - our community.",
      image: "/images/NFTs/nft002.png",
      video: "/images/NFTs/nft002.mp4",
      price: "50 IMX", // $100 equivalent
      rarity: "Epic",
      tier: "epic",
      category: "Genesis",
      artist: "DevSTon Community",
      properties: [
        { label: "Collection", value: "DevSTon Genesis" },
        { label: "Edition", value: "Limited" },
        { label: "Year", value: "2024" },
        { label: "Origin", value: "Community Created" }
      ],
      hasVideo: true,
      stats: {
        price: 100,
        rarity: "Epic",
        collection: "Genesis"
      }
    },
    {
      id: "genesis-002",
      title: "Tech Innovators",
      description: "Global innovators pioneering blockchain technology. This NFT represents the future of DevSTon - where technology meets tradition, innovation meets heritage.",
      image: "/images/NFTs/nft003.png",
      video: "/images/NFTs/nft003.mp4",
      price: "50 IMX", // $100 equivalent
      rarity: "Legendary",
      tier: "legendary",
      category: "Genesis",
      artist: "Global Innovation Creators",
      properties: [
        { label: "Collection", value: "DevSTon Genesis" },
        { label: "Edition", value: "Limited" },
        { label: "Year", value: "2024" },
        { label: "Origin", value: "Global Community" }
      ],
      hasVideo: true,
      stats: {
        price: 100,
        rarity: "Legendary",
        collection: "Genesis"
      }
    },
    {
      id: "genesis-003",
      title: "Heritage Warriors",
      description: "Global innovators showcasing the spirit of DevSTon. The foundation of our community, representing courage, strength, and the evolutionary spirit that drives DevSTon.",
      image: "/images/NFTs/nft004.png",
      video: "/images/NFTs/nft004.mp4",
      price: "50 IMX", // $100 equivalent
      rarity: "Legendary",
      tier: "rare",
      category: "Genesis",
      artist: "DevSTon Founders",
      properties: [
        { label: "Collection", value: "DevSTon Genesis" },
        { label: "Edition", value: "Limited" },
        { label: "Year", value: "2024" },
        { label: "Origin", value: "Internet" }
      ],
      hasVideo: true,
      stats: {
        price: 100,
        rarity: "Legendary",
        collection: "Genesis"
      }
    }
  ],
};

// Helper functions to get NFT data
export const getGenesisNFTs = () => NFT_DATA.genesis;
export const getNFTById = (id) => getAllNFTs().find(nft => nft.id === id);

// Rarity styling helper
export const getRarityBadgeStyle = (rarity) => {
  switch (rarity) {
    case "Legendary":
      return "bg-yellow-900 text-yellow-200";
    case "Epic":
      return "bg-purple-900 text-purple-200";
    case "Rare":
      return "bg-blue-900 text-blue-200";
    default:
      return "bg-gray-900 text-gray-200";
  }
};

// Price conversion helper (for display consistency)
export const formatPrice = (price) => {
  if (typeof price === 'string') return price;
  return `${price} DEVS`;
};