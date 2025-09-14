# 🎨 Theme Creation Guide

## How to Create a New Theme

Creating a new theme for Wild Dragons is simple! Follow these steps to add your own theme.

### Step 1: Understanding the Theme Structure

Themes are stored in `src/data/themes.json`. Each theme contains:
- **meta**: Basic information about the theme
- **ui**: All text content displayed in the game
- **colors**: Color scheme for the theme
- **assets**: Icons and asset paths
- **enemies**: Enemy names and descriptions
- **loot**: Item names

### Step 2: Create Your Theme

1. Open `src/data/themes.json`
2. Copy the entire "dragons" or "puppies" theme section
3. Paste it with a new theme name (e.g., "robots", "pirates", "space")
4. Customize all the content for your new theme

### Step 3: Theme Content Customization

#### Basic Meta Information
```json
"your_theme_name": {
  "meta": {
    "name": "Your Theme Name",
    "description": "Description of your theme",
    "icon": "🤖", // Single emoji icon
    "version": "1.0.0"
  }
}
```

#### UI Text Customization
Replace all the text in the `ui` section:
```json
"ui": {
  "game_title": "Your Game Title",
  "game_subtitle": "Your game description",
  "hero_single": "Robot", // What you call the main character
  "hero_plural": "Robots",
  "arena_name": "Robot Factory",
  "collection_name": "Robot Army",
  // ... continue with all other text
}
```

#### Color Scheme
Set your theme colors in hex format:
```json
"colors": {
  "primary": "#0066cc",      // Main theme color
  "primary_hover": "#0052a3", // Hover state
  "accent": "#00aaff",       // Accent color
  "background": "#f0f8ff",   // Background color
  // ... other colors
}
```

#### Icons and Assets
```json
"assets": {
  "hero_icon": "🤖",         // Main character emoji
  "battle_icon": "⚡",        // Battle/action emoji
  "treasure_icon": "⚙️",     // Treasure/reward emoji
  "building_icon": "🏭",     // Building/base emoji
  // ... other assets
}
```

#### Enemies and Loot
```json
"enemies": {
  "basic_enemy": {
    "name": "Malware Bot",
    "description": "A corrupted robot spreading chaos"
  }
  // ... more enemies
},
"loot": {
  "common_skin": "Basic Circuit Board",
  "hero_egg": "Robot Core",
  // ... more loot items
}
```

### Step 4: Quick Theme Examples

#### Space Theme
- **Hero**: Spaceship → Spaceships
- **Arena**: Space Station
- **Enemies**: Asteroids, Aliens, Black Holes
- **Colors**: Dark blue, silver, purple
- **Icons**: 🚀, ⭐, 🛸, 🌌

#### Pirates Theme
- **Hero**: Pirate → Pirates  
- **Arena**: Pirate Ship
- **Enemies**: Sea Monsters, Navy Ships, Storms
- **Colors**: Brown, gold, blue
- **Icons**: 🏴‍☠️, ⚔️, 💰, 🏴

#### Magic Theme
- **Hero**: Wizard → Wizards
- **Arena**: Magic Academy
- **Enemies**: Dark Spirits, Trolls, Dragons
- **Colors**: Purple, gold, mystical blue
- **Icons**: 🧙‍♂️, ✨, 🔮, 🏰

### Step 5: Testing Your Theme

1. Save your changes to `themes.json`
2. Refresh the game in your browser
3. Click the theme switcher in the top navigation
4. Select your new theme from the dropdown
5. Check that all text, colors, and icons look correct

### Step 6: Theme Switching

Users can switch themes by:
1. Clicking the theme dropdown in the top navigation bar
2. Selecting any available theme
3. Changes apply instantly across the entire game

### Pro Tips

✅ **Do**: 
- Keep enemy names consistent with your theme
- Use emojis that match your theme concept
- Test color contrast for readability
- Make sure all text makes sense together

❌ **Don't**:
- Use very similar colors that are hard to distinguish
- Forget to update enemy names and descriptions
- Use offensive or inappropriate content
- Leave placeholder text like "TODO" or "CHANGEME"

### Advanced: Custom Assets

For custom graphics (beyond emojis):
1. Create a folder `public/assets/your_theme_name/`
2. Add your images and sounds
3. Update the asset paths in your theme's `assets` section
4. Reference them like `/assets/your_theme_name/hero_sprite.png`

### Example: Complete Mini Theme

```json
"ninja": {
  "meta": {
    "name": "Shadow Ninjas",
    "description": "Stealth, honor, and ancient martial arts",
    "icon": "🥷",
    "version": "1.0.0"
  },
  "ui": {
    "game_title": "Shadow Ninjas",
    "game_subtitle": "Master the ancient arts of stealth and combat",
    "hero_single": "Ninja",
    "hero_plural": "Ninjas",
    "arena_name": "Training Dojo",
    "collection_name": "Ninja Clan"
  },
  "colors": {
    "primary": "#2c1810",
    "accent": "#8b0000",
    "background": "#f5f5dc"
  },
  "assets": {
    "hero_icon": "🥷",
    "battle_icon": "⚔️",
    "treasure_icon": "📿",
    "building_icon": "🏯"
  },
  "enemies": {
    "bandit": {
      "name": "Mountain Bandit",
      "description": "A ruthless warrior who preys on travelers"
    }
  },
  "loot": {
    "common_skin": "Ninja Mask",
    "hero_egg": "Ancient Scroll"
  }
}
```

That's it! Your theme will now be available in the game. Have fun creating unique experiences! 🎨
