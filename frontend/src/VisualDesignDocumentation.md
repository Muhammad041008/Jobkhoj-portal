# Visual Design Documentation

## Overview
This document outlines the visual design system for the JobKhoj application. It provides guidelines for component styling, layout principles, and responsive design approaches.

## Design Philosophy
Our design approach focuses on:
- Clean, minimal aesthetics with purposeful visual hierarchy
- Modern glassmorphism effects for depth and elegance
- Consistent spacing and typography
- Subtle animations that enhance user experience without being distracting
- Full responsiveness across all device sizes

## Color System
The application uses a consistent color palette defined in `css-variables.css`:

### Primary Colors
- **Primary**: `--primary` (#3b82f6) - Used for main actions and highlights
- **Primary Light**: `--primary-light` (#60a5fa) - Used for hover states
- **Primary Dark**: `--primary-dark` (#2563eb) - Used for active states

### Secondary Colors
- **Secondary**: `--secondary` (#6366f1) - Used for secondary actions
- **Success**: `--success` (#10b981) - Used for success states
- **Warning**: `--warning` (#f59e0b) - Used for warning states
- **Danger**: `--danger` (#ef4444) - Used for error states

### Neutral Colors
- **Text Primary**: `--text-primary` (#1f2937) - Used for main text
- **Text Secondary**: `--text-secondary` (#4b5563) - Used for secondary text
- **Text Tertiary**: `--text-tertiary` (#6b7280) - Used for tertiary text
- **Background Primary**: `--bg-primary` (#ffffff) - Main background color
- **Background Secondary**: `--bg-secondary` (#f9fafb) - Secondary background color
- **Border Light**: `--border-light` (#e5e7eb) - Used for light borders
- **Border Medium**: `--border-medium` (#d1d5db) - Used for medium borders

## Typography
The application uses a modern, readable typography system:

### Font Family
- `--font-family`: System UI stack (San Francisco, Segoe UI, Roboto, etc.)

### Font Sizes
- **xs**: `--font-size-xs` (0.75rem / 12px)
- **sm**: `--font-size-sm` (0.875rem / 14px)
- **base**: `--font-size-base` (1rem / 16px) - Default text size
- **md**: `--font-size-md` (1.125rem / 18px)
- **lg**: `--font-size-lg` (1.25rem / 20px)
- **xl**: `--font-size-xl` (1.5rem / 24px)
- **2xl**: `--font-size-2xl` (1.875rem / 30px)
- **3xl**: `--font-size-3xl` (2.25rem / 36px)
- **4xl**: `--font-size-4xl` (3rem / 48px)

### Font Weights
- **Light**: `--font-weight-light` (300)
- **Regular**: `--font-weight-regular` (400)
- **Medium**: `--font-weight-medium` (500)
- **Semibold**: `--font-weight-semibold` (600)
- **Bold**: `--font-weight-bold` (700)

## Spacing System
The application uses a consistent spacing scale defined in `css-variables.css`:

- `--spacing-1`: 0.25rem (4px)
- `--spacing-2`: 0.5rem (8px)
- `--spacing-3`: 0.75rem (12px)
- `--spacing-4`: 1rem (16px)
- `--spacing-5`: 1.25rem (20px)
- `--spacing-6`: 1.5rem (24px)
- `--spacing-8`: 2rem (32px)
- `--spacing-10`: 2.5rem (40px)
- `--spacing-12`: 3rem (48px)
- `--spacing-16`: 4rem (64px)

## Border Radius
The application uses consistent border radius values:

- `--border-radius-sm`: 4px
- `--border-radius-md`: 8px
- `--border-radius-lg`: 12px
- `--border-radius-xl`: 16px
- `--border-radius-full`: 9999px

## Shadows
The application uses subtle shadows for depth:

- `--shadow-sm`: Subtle shadow for small elements
- `--shadow-md`: Medium shadow for cards and containers
- `--shadow-lg`: Larger shadow for important elements
- `--shadow-xl`: Extra large shadow for overlays

## Components

### Navbar
The Navbar component provides navigation with responsive behavior:

- **Structure**: Contains logo, navigation links, and user actions
- **Responsive Behavior**: Collapses to a hamburger menu on mobile devices
- **Styling**: Uses `Navbar.css` with clean, minimal styling without complex animations
- **Key Classes**: `navbar`, `navbar-container`, `logo`, `nav-links`, `nav-link`, `active`, `mobile-menu-button`

### Button
The Button component provides consistent styling for all interactive elements:

- **Variants**: Primary, secondary, success, danger, warning, info, outline, ghost, link
- **Sizes**: Small, medium, large
- **States**: Disabled, loading
- **Styling**: Uses `Button.css` with minimal styling
- **Key Classes**: `button`, `button-primary`, `button-secondary`, `button-small`, `button-large`, `button-disabled`, `button-loading`

### Card
The Card component provides a container for displaying content:

- **Variants**: Default, primary, success, warning, danger, outline
- **Padding Options**: Small, medium, large, none
- **Styling**: Uses `Card.css` with minimal styling
- **Key Classes**: `card`, `card-primary`, `card-success`, `card-warning`, `card-danger`, `card-outline`, `card-padding-small`, `card-padding-large`, `card-full-width`

### Footer
The Footer component provides site information and links:

- **Structure**: Contains company info, social media links, quick links, job seeker resources, and employer resources
- **Responsive Behavior**: Adjusts layout for different screen sizes
- **Styling**: Uses `Footer.css` with minimal styling
- **Key Classes**: `footer`, `footer-content`, `footer-section`, `footer-title`, `footer-link`, `social-links`, `social-link`

### Loader
The Loader component provides loading indicators with glassmorphism effects:

- **Types**: Spinner, dots
- **Variants**: Default, glass, pulse
- **Sizes**: Small, medium, large
- **Components**: Main Loader, Skeleton, LoadingOverlay
- **Styling**: Uses `Loader.css` with modern glassmorphism effects
- **Key Classes**: `loader-container`, `loader-spinner`, `loader-dots`, `loader-text`, `loader-overlay`, `loader-skeleton`, `glass`, `pulse`, `full-screen`

### Toast
The Toast component provides non-intrusive notifications:

- **Types**: Success, error, warning, info
- **Styling**: Uses `Toast.css` with minimal styling
- **Key Classes**: `toast-container`, `toast`, `toast-success`, `toast-error`, `toast-warning`, `toast-info`, `toast-content`, `toast-title`, `toast-message`, `toast-close-button`

## Layout Principles

### Responsive Design
The application follows a mobile-first approach with breakpoints defined in `css-variables.css`:

- `--breakpoint-sm`: 640px - Mobile landscape and small tablets
- `--breakpoint-md`: 768px - Tablets
- `--breakpoint-lg`: 1024px - Laptops and small desktops
- `--breakpoint-xl`: 1280px - Desktops
- `--breakpoint-2xl`: 1536px - Large desktops

### Grid System
The application uses a flexible grid system for layout:

- Container widths adjust based on screen size
- Elements stack vertically on mobile devices
- Horizontal layouts used for larger screens
- Proper spacing between elements maintained across devices

### Z-index Management
The application uses a consistent z-index system:

- `--z-index-dropdown`: 1000
- `--z-index-modal`: 10000
- `--z-index-toast`: 5000
- Ensures proper layering of components

## Performance Considerations

- Minimal use of animations to avoid performance issues
- CSS variables for consistent theming
- Efficient CSS selectors
- Avoidance of complex styling that could impact rendering performance
- Responsive images and assets

## Browser Compatibility

- Chrome: Full support
- Firefox: Full support (with some limitations for backdrop-filter)
- Safari: Full support
- Edge: Full support
- Note: For glassmorphism effects in Firefox, you may need to enable the `layout.css.backdrop-filter.enabled` flag