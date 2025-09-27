import { createGlobalStyle } from 'styled-components';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, BREAKPOINTS, TRANSITIONS } from './services/theme';

// Global styles
const GlobalStyle = createGlobalStyle`
  /* CSS Reset */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    line-height: 1.5;
    scroll-behavior: smooth;
  }

  /* Root styles with CSS variables for fallback */
  :root {
    /* Colors */
    --primary-main: ${COLORS.primary};
    --primary-light: ${COLORS.primaryLight};
    --primary-dark: ${COLORS.primaryDark};
    --secondary-main: ${COLORS.secondary};
    --secondary-light: ${COLORS.secondaryLight};
    --secondary-dark: ${COLORS.secondaryDark};
    --success-main: ${COLORS.success};
    --error-main: ${COLORS.danger};
    --warning-main: ${COLORS.warning};
    --info-main: ${COLORS.primary};
    --text-primary: ${COLORS.textPrimary};
    --text-secondary: ${COLORS.textSecondary};
    --text-muted: ${COLORS.textTertiary};
    --background-main: ${COLORS.bgPrimary};
    --background-light: ${COLORS.bgSecondary};
    --surface-main: ${COLORS.bgPrimary};
    --surface-light: ${COLORS.bgSecondary};
    --border-light: ${COLORS.borderLight};
    --border-main: ${COLORS.borderMedium};
    
    /* Typography */
    --font-family: ${TYPOGRAPHY.fontFamily};
    --font-size-xs: ${TYPOGRAPHY.fontSizes.xs};
    --font-size-sm: ${TYPOGRAPHY.fontSizes.sm};
    --font-size-md: ${TYPOGRAPHY.fontSizes.base};
    --font-size-lg: ${TYPOGRAPHY.fontSizes.lg};
    --font-size-xl: ${TYPOGRAPHY.fontSizes.xl};
    --font-size-h1: ${TYPOGRAPHY.headings.h1};
    --font-size-h2: ${TYPOGRAPHY.headings.h2};
    --font-size-h3: ${TYPOGRAPHY.headings.h3};
    --font-size-h4: ${TYPOGRAPHY.headings.h4};
    --font-size-h5: ${TYPOGRAPHY.headings.h5};
    --font-size-h6: ${TYPOGRAPHY.headings.h6};
    
    /* Spacing */
    --spacing-xs: ${SPACING.xs};
    --spacing-sm: ${SPACING.sm};
    --spacing-md: ${SPACING.md};
    --spacing-lg: ${SPACING.lg};
    --spacing-xl: ${SPACING.xl};
    --spacing-2xl: ${SPACING['2xl']};
    
    /* Border radius */
    --border-radius-sm: ${BORDER_RADIUS.sm};
    --border-radius-md: ${BORDER_RADIUS.md};
    --border-radius-lg: ${BORDER_RADIUS.lg};
    --border-radius-xl: ${BORDER_RADIUS.xl};
    --border-radius-full: ${BORDER_RADIUS.full};
    
    /* Shadows */
    --shadow-sm: ${SHADOWS.sm};
    --shadow-md: ${SHADOWS.md};
    --shadow-lg: ${SHADOWS.lg};
    --shadow-xl: ${SHADOWS.xl};
    
    /* Transitions */
    --transition-fast: ${TRANSITIONS.fast};
    --transition-normal: ${TRANSITIONS.normal};
    --transition-slow: ${TRANSITIONS.slow};
  }

  body {
    font-family: var(--font-family);
    font-size: var(--font-size-md);
    color: var(--text-primary);
    background-color: var(--background-main);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: var(--spacing-md);
    color: var(--text-primary);
    transition: color ${TRANSITIONS.fast} ease;
  }

  h1 {
    font-size: var(--font-size-h1);
  }

  h2 {
    font-size: var(--font-size-h2);
  }

  h3 {
    font-size: var(--font-size-h3);
  }

  h4 {
    font-size: var(--font-size-h4);
  }

  h5 {
    font-size: var(--font-size-h5);
  }

  h6 {
    font-size: var(--font-size-h6);
  }

  p {
    margin-bottom: var(--spacing-md);
    color: var(--text-secondary);
  }

  a {
    color: var(--primary-main);
    text-decoration: none;
    transition: color ${TRANSITIONS.fast} ease, transform ${TRANSITIONS.fast} ease;
  }

  a:hover {
    color: var(--primary-dark);
    text-decoration: underline;
  }

  /* List styles */
  ul, ol {
    padding-left: var(--spacing-xl);
    margin-bottom: var(--spacing-md);
  }

  li {
    margin-bottom: var(--spacing-xs);
  }

  /* Button base styles */
  button {
    font-family: inherit;
    font-size: inherit;
    cursor: pointer;
    transition: all ${TRANSITIONS.fast} ease;
  }

  /* Form elements */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  /* Utilities */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
  }

  /* Responsive typography */
  @media (max-width: ${BREAKPOINTS.sm}) {
    html {
      font-size: 14px;
    }

    h1 {
      font-size: calc(var(--font-size-h1) * 0.85);
    }

    h2 {
      font-size: calc(var(--font-size-h2) * 0.85);
    }
  }

  /* Animation keyframes */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Utility animation classes */
  .animate-fade-in {
    animation: fadeIn ${TRANSITIONS.normal} ease-out;
  }

  .animate-slide-in-up {
    animation: slideInUp ${TRANSITIONS.normal} ease-out;
  }

  .animate-slide-in-right {
    animation: slideInRight ${TRANSITIONS.normal} ease-out;
  }

  .animate-pulse {
    animation: pulse 2s infinite;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  /* Layout utilities */
  .flex {
    display: flex;
  }

  .flex-column {
    flex-direction: column;
  }

  .items-center {
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .flex-1 {
    flex: 1;
  }

  .gap-sm {
    gap: var(--spacing-sm);
  }

  .gap-md {
    gap: var(--spacing-md);
  }

  .gap-lg {
    gap: var(--spacing-lg);
  }

  /* Spacing utilities */
  .mt-sm {
    margin-top: var(--spacing-sm);
  }

  .mt-md {
    margin-top: var(--spacing-md);
  }

  .mt-lg {
    margin-top: var(--spacing-lg);
  }

  .mb-sm {
    margin-bottom: var(--spacing-sm);
  }

  .mb-md {
    margin-bottom: var(--spacing-md);
  }

  .mb-lg {
    margin-bottom: var(--spacing-lg);
  }

  .pt-sm {
    padding-top: var(--spacing-sm);
  }

  .pt-md {
    padding-top: var(--spacing-md);
  }

  .pt-lg {
    padding-top: var(--spacing-lg);
  }

  .pb-sm {
    padding-bottom: var(--spacing-sm);
  }

  .pb-md {
    padding-bottom: var(--spacing-md);
  }

  .pb-lg {
    padding-bottom: var(--spacing-lg);
  }

  /* Text utilities */
  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  .text-primary {
    color: var(--primary-main);
  }

  .text-secondary {
    color: var(--text-secondary);
  }

  .text-muted {
    color: var(--text-muted);
  }

  .text-success {
    color: var(--success-main);
  }

  .text-error {
    color: var(--error-main);
  }

  .text-warning {
    color: var(--warning-main);
  }

  .text-info {
    color: var(--info-main);
  }

  .font-weight-bold {
    font-weight: 700;
  }

  .font-weight-medium {
    font-weight: 500;
  }

  /* Card utilities */
  .card {
    background-color: var(--surface-main);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    transition: all ${TRANSITIONS.normal} ease;
  }

  .card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  /* Glassmorphism utility */
  .glassmorphism {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
  }

  /* Neumorphism utility */
  .neumorphism {
    background: var(--background-main);
    box-shadow: 8px 8px 16px var(--shadow-sm), -8px -8px 16px var(--surface-light);
    border-radius: var(--border-radius-md);
  }

  /* Loading state overlay */
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeIn ${TRANSITIONS.fast} ease-out;
  }

  /* Skeleton loader animation */
  .skeleton-loader {
    background: linear-gradient(90deg, var(--border-light) 25%, var(--surface-light) 50%, var(--border-light) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--background-light);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--border-main);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--text-muted);
  }

  /* Focus styles for accessibility */
  button:focus-visible,
  a:focus-visible,
  input:focus-visible,
  textarea:focus-visible,
  select:focus-visible {
    outline: 2px solid var(--primary-main);
    outline-offset: 2px;
    border-radius: 2px;
  }

  /* Visually hidden element (for accessibility) */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Responsive grid layout */
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--spacing-md);
  }

  @media (min-width: ${BREAKPOINTS.md}) {
    .grid {
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }
  }

  @media (min-width: ${BREAKPOINTS.lg}) {
    .grid {
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    }
  }

  /* Media query helpers */
  .only-mobile {
    display: none;
  }

  .only-tablet {
    display: none;
  }

  .only-desktop {
    display: block;
  }

  @media (max-width: ${BREAKPOINTS.sm}) {
    .only-mobile {
      display: block;
    }
    
    .only-desktop {
      display: none;
    }
  }

  @media (min-width: ${BREAKPOINTS.md}) and (max-width: ${BREAKPOINTS.lg - 1}) {
    .only-tablet {
      display: block;
    }
    
    .only-desktop {
      display: none;
    }
  }

  /* Print styles */
  @media print {
    * {
      background: transparent !important;
      color: black !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
    
    a, a:visited {
      text-decoration: underline;
    }
    
    pre, blockquote {
      border: 1px solid #999;
      page-break-inside: avoid;
    }
    
    thead {
      display: table-header-group;
    }
    
    tr, img {
      page-break-inside: avoid;
    }
    
    img {
      max-width: 100% !important;
    }
    
    p, h2, h3 {
      orphans: 3;
      widows: 3;
    }
    
    h2, h3 {
      page-break-after: avoid;
    }
  }
`;

export default GlobalStyle;
