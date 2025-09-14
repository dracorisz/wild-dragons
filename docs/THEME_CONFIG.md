# 🎮 Theme Configuration

## Current Active Theme
The app is currently using: **dragons**

## How to Switch Themes (Development Mode)
1. Open `src/lib/themeManager.js`
2. Find line 5: `this.currentTheme = 'dragons'`
3. Change to your desired theme:
   - `'dragons'` - Epic dragon battles
   - `'puppies'` - Cute puppy adventures
4. Save the file - changes apply immediately!
5. Refresh the browser if changes don't appear instantly

## Theme Options
- **dragons**: Wild Dragons (Red theme, epic battles)
- **puppies**: Cute Puppies (Pink theme, playful activities)

## Development vs Production
- **Development**: LocalStorage disabled for instant theme switching
- **Production**: Uncomment localStorage lines in themeManager.js for persistence

## Adding New Themes
See `THEME_CREATION_GUIDE.md` for instructions on creating new themes.

---
*Note: This is the developer configuration. End users won't see theme switching options as each theme becomes its own separate app.*
