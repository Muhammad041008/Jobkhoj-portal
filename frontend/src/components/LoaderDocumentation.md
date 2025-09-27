# Loader Component Documentation

## Overview
The Loader component is a modern, animated loading indicator with support for glassmorphism effects. It provides a clean, consistent way to indicate loading states in your application with minimal animations.

## Features

### Core Components
1. **Loader**: The main loading indicator component
2. **Skeleton**: For creating placeholder layouts while content loads
3. **LoadingOverlay**: For displaying a loading state over any content

### Visual Variants
- **Default**: Clean, minimal loading indicators
- **Glassmorphism**: Frosted glass-like translucent effect with blur
- **Pulse**: Subtle pulsing animations

### Animation Types
- **Spinner**: Rotating circular loading indicator
- **Dots**: Bouncing dot animation
- **Skeleton**: Placeholder elements that shimmer

## Design Details

### Glassmorphism Effect
Our implementation uses modern CSS to create frosted glass effects:

```css
.loader-container.glass,
.loader-overlay.glass {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

### Animations
- **spin**: Rotates the spinner element
- **pulse**: Creates a subtle pulsing effect
- **shimmer**: Creates a shimmer effect for skeleton loaders

## Responsive Design
All components are fully responsive and adapt to different screen sizes through:
- CSS variables for consistent sizing across components
- Mobile-optimized default sizing
- Flexible container layouts

## Usage Examples

### Basic Spinner Loader
```jsx
import Loader from './components/Loader.jsx';

// Basic spinner
<Loader type="spinner" size="medium" />

// Small spinner
<Loader type="spinner" size="small" />

// Large spinner with text
<Loader type="spinner" size="large" text="Loading..." />
```

### Glassmorphism Loader
```jsx
// Glassmorphism spinner
<Loader type="spinner" variant="glass" size="medium" />

// Full screen glassmorphism loader
<Loader type="spinner" variant="glass" size="large" fullScreen={true} text="Loading application..." />
```

### Dots Loader
```jsx
// Default dots
<Loader type="dots" />

// Glassmorphism dots
<Loader type="dots" variant="glass" />
```

### Skeleton Loader
```jsx
// Basic skeleton
<Loader.Skeleton width="200px" height="20px" />

// Avatar skeleton
<Loader.Skeleton width="48px" height="48px" className="rounded-full" />

// Multiple skeletons for a card layout
<div className="card-skeleton">
  <Loader.Skeleton width="80%" height="24px" />
  <Loader.Skeleton width="100%" height="16px" className="mt-2" />
  <Loader.Skeleton width="60%" height="16px" className="mt-2" />
</div>
```

### Loading Overlay
```jsx
// Simple overlay
<Loader.LoadingOverlay isLoading={isLoading}>
  <YourContentComponent />
</Loader.LoadingOverlay>

// Glassmorphism overlay with text
<Loader.LoadingOverlay 
  isLoading={isLoading} 
  variant="glass" 
  text="Processing..."
>
  <YourContentComponent />
</Loader.LoadingOverlay>

// Customizing overlay
<Loader.LoadingOverlay 
  isLoading={isLoading} 
  type="dots" 
  size="small" 
  opacity={0.8}
>
  <YourContentComponent />
</Loader.LoadingOverlay>
```

## Accessibility Considerations
- The component uses semantic HTML elements
- The loading text provides context for screen readers
- Minimal animations that should be compatible with reduced motion preferences

## Browser Compatibility
- Chrome: Full support
- Firefox: Full support
- Safari: Full support
- Edge: Full support
- Note: For Firefox, you may need to enable the `layout.css.backdrop-filter.enabled` flag for backdrop-filter effects

## Performance Optimizations
- CSS animations for better performance than JavaScript animations
- Hardware acceleration using transform properties
- Minimal DOM structure
- CSS variables for consistent theming