# 🐉 Wild Dragons

## Project Overview
Wild Dragons is an engaging web application designed to provide users with an interactive platform to manage their heroes and dragons. The project combines modern web technologies to deliver a seamless user experience, including authentication, dynamic content, and real-time updates.

### Idea and Concept
The core idea of Wild Dragons is to allow users to create, customize, and manage their heroes and dragons. Users can log in, register, and interact with their personalized content. The platform is designed to be scalable and user-friendly, with a focus on security and performance.

## Features

### Game Mechanics
- **Advanced Battle System**: Status effects, critical hits, and environmental conditions.
- **Battle Types**: Normal, Elite, Boss, Tournament, and Survival modes.
- **Progression System**: XP, achievements, combo bonuses, and daily rewards.
- **Dynamic Scaling**: Enemies with unique abilities and loot systems.

### Modern Architecture
- **Frontend**: Vue 3 Composition API for optimal performance.
- **Reusable Components**: 6+ UI components for rapid development.
- **Styling**: Tailwind CSS with centralized theming.
- **PWA Support**: Offline capabilities and mobile optimization.

### Developer Experience
- **Optimized Build**: Minimal bundle size and fast loading.
- **TypeScript-Ready**: Component props with proper validation.
- **Comprehensive Documentation**: Guides and usage examples.

## Tech Stack
- **Frontend**: Vue.js
- **Backend**: Supabase (PostgreSQL, Authentication, and APIs)
- **Build Tool**: Vite
- **Deployment**: Vercel
- **Styling**: Tailwind CSS

## Folder Structure
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

## Getting Started

### Prerequisites
- Node.js 22+
- Supabase account
- Vercel account

### Setup
1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Add your Supabase URL and anon key
   ```
3. **Set up database**:
   - Run `supabase-schema.sql` in your Supabase SQL Editor.
4. **Start development**:
   ```bash
   npm run dev
   ```

### Development Commands
```bash
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

