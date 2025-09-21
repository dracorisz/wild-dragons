# Wild Dragons Project

## Project Overview
Wild Dragons is an engaging web application designed to provide users with an interactive platform to manage their heroes and dragons. The project combines modern web technologies to deliver a seamless user experience, including authentication, dynamic content, and real-time updates.

### Idea and Concept
The core idea of Wild Dragons is to allow users to create, customize, and manage their heroes and dragons. Users can log in, register, and interact with their personalized content. The platform is designed to be scalable and user-friendly, with a focus on security and performance.

## Tech Stack
- **Frontend**: Vue.js
- **Backend**: Supabase (PostgreSQL, Authentication, and APIs)
- **Build Tool**: Vite
- **Deployment**: Vercel
- **Styling**: Tailwind CSS

## Folder Structure
- **src/**: Contains the main application code.
  - **assets/**: Static files like images, styles, and database schema.
  - **components/**: Reusable Vue components.
  - **pages/**: Vue components representing different pages (e.g., Connect, Game, Landing).
  - **router/**: Vue Router configuration.
  - **stores/**: Pinia stores for state management.
- **public/**: Public assets like icons and service worker files.
- **api/**: Backend API logic (e.g., user checks).

## Database Schema
The database is managed using Supabase and includes the following tables:
- **users**: Stores user information such as email, username, and metadata.
- **heroes**: Stores hero data linked to users.
- **dragons**: Stores dragon data linked to users.
DB pass on Supabase = Ybrh&!qsd0oPM4Js-Xe\0/

### Key Features
- UUIDs for primary keys.
- JSONB fields for flexible data storage (e.g., skills, wallets).
- Row-level security policies for user-specific data access.

## Useful Links
- [Supabase Authentication Documentation](https://supabase.com/docs/guides/auth)
- [GitHub Repository](https://github.com/dracorisz/wild-dragons)
- [Live Application](https://wild-dragons.vercel.app/)