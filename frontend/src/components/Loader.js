import React from 'react';
import './Loader.css';

// Main Loader component
const Loader = ({ 
  size = 'medium', 
  variant = 'spinner', 
  color = 'primary', 
  label = '', 
  fullScreen = false, 
  className = '' 
}) => {
  // Define size options
  const sizeOptions = {
    small: '20px',
    medium: '40px',
    large: '60px'
  };
  
  const currentSize = sizeOptions[size] || sizeOptions.medium;
  
  // Render different loader types
  const renderLoader = () => {
    // Handle bar variant
    if (variant === 'bar') {
      return (
        <div 
          className={`loader-bar loader-color-${color} ${className}`}
          style={{
            width: '200px',
            height: '4px'
          }}
        >
          <div className="loader-bar-fill"></div>
        </div>
      );
    }
    
    // Handle dots variant
    if (variant === 'dots') {
      return (
        <div className={`loader-dots ${className}`}>
          <div className={`dot dot-1 loader-color-${color}`}></div>
          <div className={`dot dot-2 loader-color-${color}`}></div>
          <div className={`dot dot-3 loader-color-${color}`}></div>
        </div>
      );
    }
    
    // Default to spinner
    return (
      <div 
        className={`loader-spinner loader-color-${color} ${className}`}
        style={{ width: currentSize, height: currentSize }}
      >
        <div className="loader-spinner-inner"></div>
      </div>
    );
  };
  
  return (
    <div className={`loader-container ${fullScreen ? 'loader-fullscreen' : ''}`}>
      {renderLoader()}
      {label && <div className="loader-label">{label}</div>}
    </div>
  );
};

// Skeleton component
export const Skeleton = ({ 
  type = 'block', 
  width, 
  height, 
  shape, 
  className = '' 
}) => {
  // Render different skeleton types
  switch(type) {
    case 'avatar':
      return (
        <div 
          className={`skeleton skeleton-avatar ${className}`}
          style={{ width: height || '48px', height: height || '48px' }}
        ></div>
      );
      
    case 'text':
      return (
        <div 
          className={`skeleton skeleton-text ${className}`}
          style={{ width: width || '100%', height: height || '16px' }}
        ></div>
      );
      
    case 'card':
      return (
        <div className={`skeleton-card ${className}`}>
          <div className="skeleton skeleton-text" style={{ width: '80%', height: '24px', marginBottom: '12px' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '100%', height: '16px', marginBottom: '8px' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '60%', height: '16px', marginBottom: '12px' }}></div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div className="skeleton skeleton-text" style={{ width: '40%', height: '36px' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '40%', height: '36px' }}></div>
          </div>
        </div>
      );
      
    case 'block':
    default:
      return (
        <div 
          className={`skeleton skeleton-block ${className}`}
          style={{
            width: width || '100%',
            height: height || '20px',
            borderRadius: shape === 'circle' ? '50%' : '4px'
          }}
        ></div>
      );
  }
};

// Loading overlay component
export const LoadingOverlay = ({ 
  isLoading = true, 
  children, 
  size = '50px',
  color = 'primary', 
  text,
  className = '' 
}) => {
  if (!isLoading) {
    return <>{children}</>;
  }
  
  return (
    <div className="loading-overlay-container">
      {children && (
        <div className="loading-overlay-children">
          {children}
        </div>
      )}
      <div className={`loading-overlay-content ${className}`}>
        <Loader 
          size={size}
          color={color}
        />
        {text && (
          <span className="loading-overlay-text">
            {text}
          </span>
        )}
      </div>
    </div>
  );
};

// Export components
Loader.Skeleton = Skeleton;
Loader.LoadingOverlay = LoadingOverlay;

export default Loader;