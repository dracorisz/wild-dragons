# Wild Dragons Design Tokens

## Overview

This document outlines the comprehensive design token system used in the Wild Dragons NFT Marketplace. Design tokens provide a single source of truth for design decisions, ensuring consistency across all components and platforms.

## Color System

### Primary Colors
- `--color-primary: #00fff7` - Cyan accent color used for primary actions and highlights
- `--color-secondary: #ff00cc` - Magenta accent color used for secondary elements
- `--color-dragon: #ff6b35` - Dragon orange for collection-specific elements
- `--color-sky: #5f9cff` - Sky blue for informational elements

### Background Colors
- `--color-bg-primary: #181828` - Main dark purple background
- `--color-bg-secondary: #23234b` - Medium purple for cards and panels
- `--color-bg-tertiary: #1a1a2e` - Darker purple for overlays
- `--color-bg-gradient: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)` - Main background gradient

### Text Colors
- `--color-text-primary: #ffffff` - Primary text color
- `--color-text-secondary: rgba(255, 255, 255, 0.8)` - Secondary text
- `--color-text-tertiary: rgba(255, 255, 255, 0.6)` - Tertiary text
- `--color-text-disabled: rgba(255, 255, 255, 0.4)` - Disabled text

### Semantic Colors
- `--color-success: #05f57d` - Success states
- `--color-warning: #f8310e` - Warning states
- `--color-error: #ff6b6b` - Error states
- `--color-info: #5f9cff` - Informational states

## Element Colors

### NFT Elements
- `--element-fire: #ff4500` - Fire element
- `--element-water: #1e90ff` - Water element
- `--element-earth: #8b4513` - Earth element
- `--element-air: #add8e6` - Air element
- `--element-light: #fffacd` - Light element
- `--element-dark: #4b0082` - Dark element
- `--element-cosmic: #9370db` - Cosmic element
- `--element-nature: #228b22` - Nature element
- `--element-mechanical: #808080` - Mechanical element

### Rarity Colors
- `--rarity-common: #a9a9a9` - Common rarity
- `--rarity-uncommon: #2e8b57` - Uncommon rarity
- `--rarity-rare: #4169e1` - Rare rarity
- `--rarity-epic: #800080` - Epic rarity
- `--rarity-legendary: #ffd700` - Legendary rarity
- `--rarity-mythic: #ff69b4` - Mythic rarity

## Spacing System

- `--space-0: 0`
- `--space-1: 0.25rem` (4px)
- `--space-2: 0.5rem` (8px)
- `--space-3: 0.75rem` (12px)
- `--space-4: 1rem` (16px)
- `--space-5: 1.25rem` (20px)
- `--space-6: 1.5rem` (24px)
- `--space-8: 2rem` (32px)
- `--space-10: 2.5rem` (40px)
- `--space-12: 3rem` (48px)
- `--space-16: 4rem` (64px)

## Typography

### Font Families
- `--font-family-base: 'Nova Round', sans-serif` - Primary font
- `--font-family-heading: 'Cinzel', serif` - Headings
- `--font-family-code: 'Orbitron', monospace` - Code elements
- `--font-family-fantasy: 'MedievalSharp', cursive` - Fantasy elements

### Font Sizes
- `--font-size-xs: 0.75rem` (12px)
- `--font-size-sm: 0.875rem` (14px)
- `--font-size-base: 1rem` (16px)
- `--font-size-lg: 1.125rem` (18px)
- `--font-size-xl: 1.25rem` (20px)
- `--font-size-2xl: 1.5rem` (24px)
- `--font-size-3xl: 1.875rem` (30px)
- `--font-size-4xl: 2.25rem` (36px)
- `--font-size-5xl: 3rem` (48px)

### Font Weights
- `--font-weight-light: 300`
- `--font-weight-normal: 400`
- `--font-weight-medium: 500`
- `--font-weight-semibold: 600`
- `--font-weight-bold: 700`
- `--font-weight-black: 900`

### Line Heights
- `--line-height-tight: 1.2`
- `--line-height-normal: 1.5`
- `--line-height-relaxed: 1.75`

## Border Radius

- `--radius-sm: 4px`
- `--radius-md: 8px`
- `--radius-lg: 12px`
- `--radius-xl: 16px`
- `--radius-2xl: 24px`
- `--radius-full: 9999px`

## Shadows

- `--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- `--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)`
- `--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)`
- `--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)`
- `--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)`
- `--shadow-neon: 0 0 8px var(--color-primary), 0 0 16px var(--color-secondary)`
- `--shadow-neon-hover: 0 0 12px var(--color-primary), 0 0 24px var(--color-secondary)`

## Transitions

- `--transition-fast: all 0.1s ease`
- `--transition-normal: all 0.2s ease`
- `--transition-slow: all 0.3s ease`

## Breakpoints

- `--breakpoint-sm: 640px`
- `--breakpoint-md: 768px`
- `--breakpoint-lg: 1024px`
- `--breakpoint-xl: 1280px`
- `--breakpoint-2xl: 1536px`

## NFT-Specific Tokens

### Card Styling
- `--nft-card-bg: var(--color-bg-secondary)`
- `--nft-card-border: var(--color-border-primary)`
- `--nft-card-border-hover: var(--color-secondary)`
- `--nft-card-shadow: var(--shadow-neon)`
- `--nft-card-shadow-hover: var(--shadow-neon-hover)`

### Badge Styling
- `--nft-badge-bg: rgba(0, 0, 0, 0.7)`
- `--nft-badge-text: var(--color-white)`

### Modal Styling
- `--nft-modal-bg: var(--color-bg-secondary)`
- `--nft-modal-border: var(--color-primary)`

### Filter Styling
- `--nft-filter-bg: rgba(24, 24, 40, 0.5)`
- `--nft-filter-border: var(--color-border-primary)`

## Usage Guidelines

### Color Usage
1. **Primary Color (#00fff7)**: Use for primary actions, links, and key interactive elements
2. **Secondary Color (#ff00cc)**: Use for secondary actions and accent elements
3. **Semantic Colors**: Use appropriate semantic colors for status indicators and feedback

### Spacing
1. Use the spacing scale consistently across all components
2. Maintain consistent spacing ratios (multiples of 4px)
3. Use space-4 (16px) as the base unit for most spacing

### Typography
1. Use font-family-base for body text and general UI elements
2. Use font-family-heading for headings and titles
3. Maintain proper text hierarchy using the font-size scale

### Shadows and Effects
1. Use shadow-neon for NFT cards and interactive elements
2. Use standard shadows for subtle depth
3. Reserve neon effects for premium/highlighted content

### Responsive Design
1. Mobile-first approach with breakpoints at 480px, 640px, 768px, 1024px, 1280px, 1920px
2. Ensure all components are usable across all viewport sizes
3. Test touch targets are at least 44px on mobile devices

## Implementation

### CSS Variables
All tokens are defined as CSS custom properties (variables) in `variables.css` and can be used throughout the stylesheet:

```css
.my-element {
  color: var(--color-primary);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-neon);
}
```

### JavaScript Access
Tokens can be accessed in JavaScript for dynamic styling:

```javascript
const primaryColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--color-primary');
```

### Component Integration
Components should use these tokens consistently to maintain design system integrity.

## Maintenance

### Adding New Tokens
1. Add the token definition to `variables.css`
2. Document the token in this file
3. Update usage guidelines if needed
4. Test across all components

### Modifying Existing Tokens
1. Assess impact on existing components
2. Update token value in `variables.css`
3. Update documentation
4. Test for visual regressions

### Deprecating Tokens
1. Mark token as deprecated in documentation
2. Provide migration path
3. Remove after grace period

## Version History

- **v1.0.0**: Initial design token system implementation
- Comprehensive color, spacing, typography, and component-specific tokens
- Mobile-first responsive design support
- NFT marketplace specific theming