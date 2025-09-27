import React from 'react';
import './Button.css';

/**
 * Simple Button component with minimal styling
 * @param {Object} props - Button properties
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button variant (primary, secondary, etc.)
 * @param {string} props.size - Button size (small, medium, large)
 * @param {boolean} props.disabled - Disable button state
 * @param {boolean} props.fullWidth - Make button full width
 * @param {boolean} props.loading - Show loading state
 * @param {React.ElementType} props.icon - Icon component
 * @param {string} props.as - HTML element type (button, a, etc.)
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.rest - Additional HTML attributes
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  fullWidth = false, 
  loading = false,
  icon: Icon,
  as: As = 'button',
  onClick,
  className = '',
  ...rest 
}) => {
  // Combine base classes with variant, size, and custom classes
  const buttonClasses = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    disabled || loading ? 'button--disabled' : '',
    fullWidth ? 'button--full-width' : '',
    className
  ].filter(Boolean).join(' ');

  // Create the button element with minimal props
  const ButtonElement = As;
  
  return (
    <ButtonElement 
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {Icon && !loading && <Icon size={size === 'small' ? 16 : 20} className="button__icon" />}
      {loading ? <span className="button__spinner"></span> : children}
    </ButtonElement>
  );
};

export default Button;