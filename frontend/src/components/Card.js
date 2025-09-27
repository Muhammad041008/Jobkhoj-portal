import React from 'react';
import './Card.css';

/**
 * Simple Card component with minimal styling
 * @param {Object} props - Card properties
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.variant - Card variant (default, primary, etc.)
 * @param {string} props.padding - Padding size (small, medium, large)
 * @param {boolean} props.fullWidth - Make card full width
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.rest - Additional HTML attributes
 */
const Card = ({ 
  children, 
  variant = 'default', 
  padding = 'medium', 
  fullWidth = false, 
  className = '', 
  ...rest 
}) => {
  // Combine base classes with variant, padding, and custom classes
  const cardClasses = [
    'card',
    `card--${variant}`,
    `card--padding-${padding}`,
    fullWidth ? 'card--full-width' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...rest}>
      {children}
    </div>
  );
};

export default Card;