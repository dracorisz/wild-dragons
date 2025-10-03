# Wild Dragons Project

## Project Overview
Wild Dragons is an engaging web application designed to provide users with an interactive platform to manage their heroes and dragons. The project now features a fully integrated NFT Marketplace module, inspired by top GameFi and trending NFT platforms like TokenTrove, with a focus on immersive fantasy/game-inspired UI and seamless user experience.

### NFT Marketplace UI & UX
The NFT Marketplace is designed for a minimal, spacy, and costy cosmic vibe:
- **Minimal layout** with whitespace and subtle neon accents.
- **Single chain icon** for all NFTs (`/src/assets/chains/polygon-matic-logo.svg`).
- **Image placeholder text** for NFTs with missing images.
- **Horizontal slider** at the top for showcasing top/trending collections.
- **Tabs and filters** for chain selection, trending NFTs, and categories.
- **Responsive grid layout** with card-based NFT display.
- **NFT cards** show image, name, description, chain, price, royalty, and owner.
- **Prominent action buttons**: Buy, Mint, List, Transfer, View.
- **Modals** for all main actions (Buy, Mint, List, Transfer, View Details).
- **Toast notifications** for instant feedback on user actions.
- **Faucet links** and external marketplace links (e.g., TokenTrove) for onboarding and exploration.
- **Fantasy/game-inspired images and icons** from the assets folder.
- **Mobile-friendly** and visually matches the World of Tiamat vibe.
- **Styled exclusively with `nft.css`** for consistent branding and theme.

### Idea and Concept
The core idea of Wild Dragons is to allow users to create, customize, and manage their heroes and dragons, and now also trade, mint, and showcase NFTs in a GameFi-inspired marketplace. Users can log in, register, and interact with their personalized content and NFT assets. The platform is scalable, secure, and performance-focused.

## Tech Stack
- **Frontend**: Vue.js
- **Backend**: Supabase (PostgreSQL, Authentication, and APIs)
- **Build Tool**: Vite
- **Deployment**: Vercel
- **Styling**: Tailwind CSS, `nft.css` for NFT marketplace

## Folder Structure
- **src/**: Main application code.
  - **assets/**: Static files (images, styles, icons, database schema).
  - **components/**: Reusable Vue components (NFT cards, sliders, modals, toasts).
  - **pages/**: Vue components for pages (Connect, Game, Landing, Marketplace).
  - **router/**: Vue Router configuration.
  - **stores/**: Pinia stores for state management.
- **public/**: Public assets (icons, service worker).
- **api/**: Backend API logic (user checks, NFT actions).

## Database Schema
Managed via Supabase, including:
- **users**: User info (email, username, metadata).
- **heroes**: Hero data linked to users.
- **dragons**: Dragon data linked to users.
- **nfts**: NFT metadata, ownership, chain, price, royalty, etc.
DB pass on Supabase = Ybrh&!qsd0oPM4Js-Xe\0/

### Key Features
- UUIDs for primary keys.
- JSONB fields for flexible data storage (skills, wallets, NFT metadata).
- Row-level security policies for user-specific data access.

## NFT Marketplace Features
- Multi-chain support (ETH, Immutable, Ronin testnets).
- Modular Vue components for NFT actions and display.
- Horizontal slider for top collections.
- Tabs/filters for chain, trending, and categories.
- Card-based NFT grid with minimal, cosmic visuals.
- Modals for Buy, Mint, List, Transfer, View actions.
- Toast notifications for feedback.
- Faucet links and external marketplace links for onboarding.
- Mobile-friendly, responsive design.

## Useful Links
- [Supabase Authentication Documentation](https://supabase.com/docs/guides/auth)
- [GitHub Repository](https://github.com/dracorisz/wild-dragons)
- [Live Application](https://wild-dragons.vercel.app/)
- [TokenTrove](https://tokentrove.com/search?q=)

## Session URLs (actual)
- https://goerlifaucet.com/
- https://docs.web3j.io/4.14.0/transactions/ethereum_testnets/
- https://faucet.testnet.immutable.com/
- https://www.immutable.com/blog/the-gold-standard-of-gaming-on-ethereum-immutable-zkevm-testnet-is-finally-here
- https://faucet.roninchain.com/
- https://docs.tenderly.co/node/rpc-reference/ronin-testnet
- https://tokentrove.com/search?q=

## GameFi/Trending UI/UX Analysis
Best practices from TokenTrove and GameFi sites:
- Minimal, spacy, cosmic backgrounds with neon accent colors.
- Card-based layouts for NFTs and collections.
- Horizontal sliders for trending/top collections.
- Tabs and filters for chain, category, and trending.
- Prominent action buttons (Buy, Mint, List, Transfer).
- Modals for all main actions.
- Toast notifications for instant feedback.
- Responsive grid and mobile-friendly design.
- Fantasy/game-inspired images and icons.