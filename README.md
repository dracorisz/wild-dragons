# Wild Dragons NFT Marketplace

A blockchain-based NFT marketplace for fantasy dragon collectibles with cosmic, minimal, and neon-accented UI.

## 🐉 Project Overview

Wild Dragons NFT Marketplace (also known as "Heroine's Dragon") is a Play-to-Earn fantasy RPG that allows users to:

- Collect, mint, and trade dragon-themed NFTs
- Battle with legendary creatures
- Earn rewards through gameplay
- Participate in DAO governance
- Progress through a chakra-based spiritual system

## 📋 Features

- **NFT Marketplace**: Browse, filter, and purchase dragon NFTs
- **Collection Management**: View owned NFTs and their stats
- **Spiritual Progression**: Level up through chakra-based system
- **Responsive Design**: Works across desktop, tablet, and mobile
- **PWA Support**: Install as native app experience

## 🚀 Getting Started

### Prerequisites

- Node.js v16+
- Python 3.8+ (for data generation scripts)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/wild-dragons.git
   cd wild-dragons
   ```

2. Set up the environment
   ```
   ./build-wild-dragons.bat
   ```
   
3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser to http://localhost:5173

## 🏗️ Project Structure
```
📁 src/
├── assets/          # Static files (images, styles, database schema)
├── components/      # Reusable Vue components
├── pages/           # Route pages (e.g., Connect, Game, Landing)
├── router/          # Vue Router configuration
├── stores/          # Pinia state management
└── main.js          # Application entry point
```

## Database Schema
The database is managed using Supabase and includes the following tables:

- **users**: Stores user information such as email, username, and metadata.
- **heroes**: Stores hero data linked to users.
- **dragons**: Stores dragon data linked to users.

### Key Features
- UUIDs for primary keys.
- JSONB fields for flexible data storage (e.g., skills, wallets).
- Row-level security policies for user-specific data access.

## Useful Links
- [Supabase Authentication Documentation](https://supabase.com/docs/guides/auth)
- [GitHub Repository](https://github.com/dracorisz/wild-dragons)
- [Live Application](https://wild-dragons.vercel.app/)

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Vue 3, Vite, Tailwind CSS, and Supabase**
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Useful Links
- [Supabase Authentication Documentation](https://supabase.com/docs/guides/auth)
- [GitHub Repository](https://github.com/dracorisz/wild-dragons)
- [Live Application](https://wild-dragons.vercel.app/)

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Vue 3, Vite, Tailwind CSS, and Supabase**

