import React from 'react';
import './Loader.css';

/**
 * Loader component with glassmorphism effects
 * @param {Object} props
 * @param {string} props.type - Type of loader ('spinner', 'dots')
 * @param {string} props.size - Size of the loader ('small', 'medium', 'large')
 * @param {string} props.variant - Style variant ('default', 'glass', 'pulse')
 * @param {boolean} props.fullScreen - Whether to show full screen loader
 * @param {string} props.text - Optional loading text
 * @param {number} props.opacity - Overlay opacity
 * @returns {React.ReactElement}
 */
const Loader = ({ 
  type = 'spinner', 
  size = 'medium', 
  variant = 'default', 
  fullScreen = false, 
  text = '', 
  opacity = 1 
}) => {
  // Build class names
  const containerClasses = [
    'loader-container',
    fullScreen && 'full-screen',
    variant === 'glass' && 'glass'
  ].filter(Boolean).join(' ');

  // Render different loader types
  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        const spinnerClasses = [
          'loader-spinner',
          size,
          variant === 'glass' && 'glass',
          variant === 'pulse' && 'pulse'
        ].filter(Boolean).join(' ');
        
        return <div className={spinnerClasses}></div>;
        
      case 'dots':
        return (
          <div className="loader-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        );
        
      default:
        return <div className="loader-spinner"></div>;
    }
  };

  return (
    <div 
      className={containerClasses}
      style={{ opacity }}
    >
      {renderLoader()}
      {text && <span className="loader-text">{text}</span>}
    </div>
  );
};

/**
 * Skeleton loader component
 * @param {Object} props
 * @param {number} props.width - Width of the skeleton
 * @param {number} props.height - Height of the skeleton
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement}
 */
const Skeleton = ({ width, height, className = '' }) => {
  return (
    <div 
      className={`loader-skeleton ${className}`}
      style={{ width, height }}
    ></div>
  );
};

/**
 * Loading overlay component
 * @param {Object} props
 * @param {boolean} props.isLoading - Whether the overlay should be visible
 * @param {React.ReactNode} props.children - Content to show underneath
 * @param {string} props.type - Type of loader
 * @param {string} props.size - Size of the loader
 * @param {string} props.variant - Style variant
 * @param {string} props.text - Optional loading text
 * @param {number} props.opacity - Overlay opacity
 * @returns {React.ReactElement}
 */
const LoadingOverlay = ({ 
  isLoading, 
  children, 
  type = 'spinner', 
  size = 'medium', 
  variant = 'default', 
  text = '', 
  opacity = 1 
}) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div style={{
      position: 'relative',
      display: 'inline-block',
      width: '100%'
    }}>
      {children && (
        <div style={{
          opacity: 0.5,
          filter: 'blur(2px)'
        }}>
          {children}
        </div>
      )}
      <div className={`loader-overlay ${variant === 'glass' ? 'glass' : ''}`} style={{ opacity }}>
        <Loader 
          type={type} 
          size={size}
          variant={variant}
        />
        {text && (
          <span className="loader-text">{text}</span>
        )}
      </div>
    </div>
  );
};

// Export components
Loader.Skeleton = Skeleton;
Loader.LoadingOverlay = LoadingOverlay;

export default Loader;