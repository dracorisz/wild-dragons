# 🍞 Toast Notification System Documentation

## Overview
The Toast Notification System provides beautiful, theme-aware notifications that adapt to both Dragon and Puppy themes with rich features and smooth animations.

## Features

### 🎨 Theme Awareness
- **Dragon Theme**: Epic, dark styling with medieval aesthetics
- **Puppy Theme**: Light, playful styling with cute elements
- Automatic theme switching support
- Theme-appropriate icons and messaging

### 🚀 Rich Functionality
- Multiple toast types (success, error, warning, info, custom)
- Auto-dismiss with customizable timing
- Progress bar indicators
- Action buttons with custom handlers
- Queue management (max 5 toasts)
- Multiple positioning options
- Swipe-to-dismiss on mobile
- Hover-to-pause functionality

### ♿ Accessibility
- ARIA live regions for screen readers
- Keyboard navigation support
- Focus management
- High contrast mode support
- Reduced motion support

## Usage Examples

### Basic Toast Types

```javascript
// Simple notifications
toastManager.success('Operation completed successfully!')
toastManager.error('Something went wrong!')
toastManager.warning('Please check your input')
toastManager.info('Here\'s some helpful information')
```

### Advanced Configuration

```javascript
// Custom toast with actions
toastManager.showToast({
  type: 'info',
  title: 'Confirm Action',
  message: 'Do you want to proceed with this operation?',
  duration: 0, // Persistent until action
  actions: [
    {
      text: 'Confirm',
      type: 'primary',
      icon: '✓',
      id: 'confirm'
    },
    {
      text: 'Cancel',
      type: 'secondary',
      icon: '✕',
      id: 'cancel'
    }
  ],
  onAction: (actionId, toastId) => {
    if (actionId === 'confirm') {
      // Handle confirmation
      toastManager.success('Action confirmed!')
    }
    toastManager.hideToast(toastId)
  }
})
```

### Theme-Aware Content

```javascript
// The system automatically adapts content based on current theme
const theme = themeManager.getTheme()
const isPlayful = theme.meta.name.includes('Puppies')

toastManager.showToast({
  type: 'success',
  title: isPlayful ? 'Yay! Success!' : 'Victory Achieved!',
  message: isPlayful ? 'Your puppy is happy! 🐕' : 'The dragon is defeated! ⚔️',
  icon: isPlayful ? '🎉' : '✅'
})
```

## Configuration Options

### Toast Configuration
```javascript
{
  id: 'unique-id',                    // Optional: Custom ID
  type: 'success',                    // 'success', 'error', 'warning', 'info', 'custom'
  title: 'Toast Title',               // Optional: Toast title
  message: 'Toast message',           // Toast content
  duration: 5000,                     // Auto-dismiss time (0 = persistent)
  persistent: false,                  // If true, won't auto-dismiss
  closable: true,                     // Show close button
  icon: '🎉',                        // Custom icon override
  actions: [],                        // Array of action buttons
  className: 'custom-class',          // Additional CSS classes
  position: 'top-right',              // Toast position
  showProgress: true,                 // Show progress bar
  sound: false,                       // Play sound (future feature)
  onShow: (id) => {},                 // Callback when shown
  onHide: (id) => {},                 // Callback when hidden
  onClick: (id) => {},                // Callback when clicked
  onAction: (actionId, toastId) => {} // Callback for action buttons
}
```

### Action Button Configuration
```javascript
{
  text: 'Button Text',               // Button label
  type: 'primary',                   // 'primary', 'secondary', 'default'
  icon: '✓',                        // Button icon
  id: 'action-id',                  // Action identifier
  handler: 'functionName',          // Global function name
  className: 'custom-class',        // Additional CSS classes
  disabled: false,                  // Button state
  ariaLabel: 'Accessible label'     // Accessibility label
}
```

## Position Options

```javascript
// Available positions
toastManager.setPosition('top-right')    // Default
toastManager.setPosition('top-left')
toastManager.setPosition('top-center')
toastManager.setPosition('bottom-right')
toastManager.setPosition('bottom-left')
toastManager.setPosition('bottom-center')
```

## Methods

### Core Methods
```javascript
// Show toast with full configuration
toastManager.showToast(config)

// Convenience methods
toastManager.success(message, options)
toastManager.error(message, options)
toastManager.warning(message, options)
toastManager.info(message, options)

// Management methods
toastManager.hideToast(id)           // Hide specific toast
toastManager.clearAll()              // Clear all toasts
toastManager.setPosition(position)   // Change position
```

### Timer Control
```javascript
toastManager.pauseDismissTimer(id)   // Pause auto-dismiss
toastManager.resumeDismissTimer(id)  // Resume auto-dismiss
toastManager.clearDismissTimer(id)   // Clear timer
```

## Development Testing

### Test Functions Available in Console

```javascript
// Test basic toast types
testToast('success')    // Theme-aware success toast
testToast('error')      // Theme-aware error toast
testToast('warning')    // Theme-aware warning toast
testToast('info')       // Theme-aware info toast

// Test action toasts
testToastActions()      // Toast with action buttons

// Test queue management
testToastQueue()        // Multiple toasts with queue

// Test positioning
testToastPositions()    // Cycle through all positions

// Test with theme switching
testThemeSwitch('dragons')
testToast('success')

testThemeSwitch('puppies')
testToast('error')
```

## Theme Adaptations

### 🐉 Dragon Theme
- **Colors**: Dark backgrounds with red accents
- **Typography**: Medieval-style fonts (Cinzel)
- **Icons**: Battle-themed (⚔️, 🗡️, ✅, ❌)
- **Messaging**: Epic terminology ("Victory Achieved!", "Battle Failed!")
- **Styling**: Gothic gradients and shadows

### 🐕 Puppy Theme  
- **Colors**: Light backgrounds with orange accents
- **Typography**: Playful fonts (Comic Neue)
- **Icons**: Cute-themed (🎉, 🐕, 💡, 😢)
- **Messaging**: Friendly terminology ("Yay! Success!", "Oops!")
- **Styling**: Bright gradients and soft shadows

## Mobile Features

### Swipe Gestures
- **Swipe Right**: Dismiss toast
- **Swipe Threshold**: 100px minimum
- **Visual Feedback**: Toast follows finger movement
- **Snap Back**: Returns to position if swipe is insufficient

### Responsive Design
- **Mobile**: Stack vertically, full-width buttons
- **Tablet**: Reduced padding, smaller fonts
- **Desktop**: Full feature set with hover effects

## Accessibility Features

### Screen Reader Support
- ARIA live regions announce new toasts
- Proper role attributes for alerts
- Descriptive labels for all interactive elements

### Keyboard Navigation
- Tab navigation through action buttons
- Enter/Space to activate buttons
- Escape key to dismiss closable toasts

### Visual Accessibility
- High contrast mode support
- Focus indicators for keyboard users
- Reduced motion support for sensitive users
- Color-blind friendly color schemes

## Integration with Other Systems

### Theme Manager Integration
```javascript
// Automatic theme updates
window.addEventListener('themeChanged', () => {
  toastManager.updateAllToastsTheme()
})
```

### Modal Manager Compatibility
- Toast z-index (2000) higher than modals (1000)
- Both systems work together seamlessly
- Independent focus management

## Performance Considerations

### Queue Management
- Maximum 5 concurrent toasts
- Automatic removal of oldest dismissible toasts
- Efficient DOM manipulation with RAF

### Memory Management
- Automatic cleanup of dismissed toasts
- Timer management prevents memory leaks
- Event listener cleanup on removal

## Browser Support

### Modern Features
- CSS Grid and Flexbox for layouts
- CSS Custom Properties for theming
- ES6 Modules and Classes
- Touch Events for mobile gestures

### Fallbacks
- Graceful degradation for older browsers
- Reduced motion fallbacks
- High contrast mode support
- Basic functionality without advanced features

## Customization

### CSS Custom Properties
```css
:root {
  --toast-z-index: 2000;
  --toast-max-width: 400px;
  --toast-border-radius: 12px;
  --toast-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  --toast-backdrop-filter: blur(8px);
}
```

### Theme Variables
```css
/* Epic theme variables */
--theme-primary: #dc2626;
--theme-secondary: #7c2d12;
--theme-accent: #dc2626;
--theme-text-primary: #ffffff;

/* Playful theme variables */
--theme-primary: #f97316;
--theme-secondary: #fb923c;
--theme-accent: #f97316;
--theme-text-primary: #1f2937;
```

## Future Enhancements

### Planned Features
- [ ] Sound effects for different toast types
- [ ] Toast templates for common use cases
- [ ] Batch operations for multiple toasts
- [ ] Advanced positioning with collision detection
- [ ] Integration with push notifications
- [ ] Toast history and replay functionality

### API Extensions
- [ ] Toast groups and categories
- [ ] Custom animation types
- [ ] Rich media support (images, videos)
- [ ] Interactive content areas
- [ ] Integration with form validation

## Troubleshooting

### Common Issues

**Toasts not appearing**
- Check if container exists in DOM
- Verify z-index conflicts
- Ensure theme manager is initialized

**Theme not updating**
- Verify theme change event listeners
- Check theme manager integration
- Confirm CSS imports are correct

**Mobile gestures not working**
- Ensure touch events are supported
- Check for conflicting touch handlers
- Verify swipe threshold settings

**Accessibility issues**
- Validate ARIA attributes
- Test with screen readers
- Verify keyboard navigation

### Debug Mode
```javascript
// Enable debug logging
toastManager.debug = true

// Check active toasts
console.log(toastManager.toasts)
console.log(toastManager.toastQueue)

// Test theme integration
console.log(themeManager.getTheme())
```
