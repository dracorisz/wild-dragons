# Wild Dragons CSS Architecture

## Overview

This document describes the CSS architecture used in the Wild Dragons NFT Marketplace project. The architecture follows modern CSS best practices with a focus on maintainability, scalability, and performance.

## Architecture Principles

### 1. Component-Based Structure
- Each component has its own CSS file following BEM naming convention
- Components are self-contained with scoped styles
- Clear separation of concerns between components

### 2. Design Token System
- Centralized design tokens in `variables.css`
- Consistent use of CSS custom properties
- Single source of truth for design decisions

### 3. Mobile-First Responsive Design
- Mobile-first approach with progressive enhancement
- Comprehensive breakpoint system
- Touch-friendly interactions on mobile devices

### 4. Performance Optimization
- Minimal CSS footprint through utility classes
- Efficient selector usage
- Optimized for fast loading and rendering

## File Structure

```
src/assets/css/
├── styles.css          # Main application styles
├── variables.css       # Design tokens and CSS variables
├── utils.css          # Utility classes
├── nft.css            # NFT-specific styles
└── components/
    └── nft-card.css   # Component-specific styles
```

## CSS Organization

### 1. styles.css - Main Application Styles
Contains global styles, typography, layout, and base component styles.

**Contents:**
- CSS imports
- Global resets and base styles
- Navigation styles
- Page layout
- Form elements
- Responsive breakpoints

### 2. variables.css - Design Tokens
Centralized design system with CSS custom properties.

**Categories:**
- Colors (primary, secondary, semantic, element-specific)
- Spacing scale
- Typography (fonts, sizes, weights)
- Shadows and effects
- Border radius
- Transitions
- Breakpoints

### 3. utils.css - Utility Classes
Tailwind-inspired utility classes for rapid development.

**Features:**
- Spacing utilities (margin, padding)
- Display utilities
- Flexbox utilities
- Absolute sizing utilities

### 4. nft.css - NFT-Specific Styles
Specialized styles for NFT marketplace features.

**Contents:**
- NFT card hover effects
- Slider/carousel styles
- Modal overlays
- Filter interfaces
- Loading animations

### 5. components/ - Component Styles
Individual component stylesheets following BEM convention.

**Example: nft-card.css**
- `.nft-card` - Base component styles
- `.nft-card__image` - Image element styles
- `.nft-card__info` - Information section styles
- `.nft-card--modifier` - Modifier classes

## Naming Convention - BEM

The project uses the BEM (Block Element Modifier) naming convention for CSS classes.

### Structure
```
.block {}
.block__element {}
.block--modifier {}
```

### Examples
```css
/* Block */
.nft-card {}

/* Elements */
.nft-card__image {}
.nft-card__name {}
.nft-card__price {}

/* Modifiers */
.nft-card--featured {}
.nft-card__image--large {}
```

### Benefits
- Clear component structure
- Avoids CSS specificity conflicts
- Self-documenting code
- Scalable and maintainable

## Responsive Design System

### Breakpoints
- `320px` - Extra small mobile
- `480px` - Small mobile
- `640px` - Large mobile/small tablet
- `768px` - Tablet
- `1024px` - Small desktop
- `1280px` - Large desktop
- `1920px` - Extra large desktop

### Implementation
```css
/* Mobile-first approach */
.my-component {
  font-size: 14px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .my-component {
    font-size: 16px;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .my-component {
    font-size: 18px;
  }
}
```

## CSS Variables Usage

### Global Variables
```css
:root {
  --color-primary: #00fff7;
  --space-4: 1rem;
  --font-size-lg: 1.125rem;
}
```

### Component Variables
```css
.nft-card {
  --card-padding: var(--space-4);
  --card-border-radius: var(--radius-lg);
}
```

### Dynamic Variables
```css
.nft-card--fire {
  --element-color: var(--element-fire);
}
```

## Performance Considerations

### 1. CSS Delivery
- Minimize CSS file size
- Use CSS compression
- Load critical CSS inline
- Defer non-critical CSS

### 2. Selector Optimization
- Use class selectors over ID selectors
- Avoid deep nesting
- Minimize universal selectors
- Prefer direct child selectors

### 3. Animation Performance
- Use transform and opacity for animations
- Avoid animating layout properties
- Use will-change for complex animations
- Limit animation scope

## Browser Support

### Target Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### CSS Features Used
- CSS Custom Properties (CSS Variables)
- CSS Grid and Flexbox
- CSS Transforms and Animations
- CSS Blend Modes
- CSS Color Functions (color-mix)

### Fallbacks
```css
/* Modern syntax with fallback */
.my-element {
  color: #00fff7; /* Fallback */
  color: var(--color-primary);
}
```

## Development Workflow

### 1. Adding New Styles
1. Identify if it's a component, utility, or global style
2. Use appropriate file based on scope
3. Follow BEM naming convention
4. Use design tokens for consistency
5. Test across all breakpoints

### 2. Modifying Existing Styles
1. Check for dependencies
2. Update design tokens if needed
3. Test for regressions
4. Update documentation

### 3. CSS Maintenance
- Regular audit for unused styles
- Performance monitoring
- Cross-browser testing
- Documentation updates

## Build Process

### CSS Compilation
- PostCSS for processing
- Autoprefixer for vendor prefixes
- CSSNano for minification
- PurgeCSS for unused style removal

### Development Tools
- Hot reloading for CSS changes
- CSS source maps
- Stylelint for code quality
- Visual regression testing

## Quality Assurance

### CSS Testing
- Visual regression tests
- Cross-browser compatibility
- Performance benchmarks
- Accessibility compliance

### Code Quality
- Stylelint configuration
- CSS architecture guidelines
- Documentation standards
- Code review checklist

## Migration Guide

### From Legacy CSS
1. Identify global styles to migrate
2. Convert to component-based structure
3. Implement design token system
4. Add responsive breakpoints
5. Test thoroughly

### Best Practices
- Avoid !important declarations
- Use semantic class names
- Maintain consistent spacing
- Document complex selectors
- Test in production environment

## Future Enhancements

### Planned Improvements
- CSS-in-JS integration for dynamic theming
- Advanced animation system
- Enhanced accessibility features
- Performance monitoring dashboard

### Technology Evaluation
- Evaluate CSS Modules
- Consider CSS-in-JS frameworks
- Monitor new CSS features
- Assess build tool improvements

## Conclusion

The CSS architecture provides a solid foundation for scalable, maintainable styling. By following these guidelines, the codebase remains consistent, performant, and easy to maintain as the project grows.