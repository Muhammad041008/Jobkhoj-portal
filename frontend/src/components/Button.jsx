import React from 'react';
import styled from 'styled-components';
import { COLORS, typography, spacing, borderRadius, shadows, transitions } from '../services/theme';

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
  ...props 
}) => {
  // Create a variant-based style
  const ButtonVariant = styled(As)`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${spacing[2]};
    padding: 
      ${size === 'small' ? `${spacing[1.5]} ${spacing[3]}` : size === 'medium' ? `${spacing[2]} ${spacing[4]}` : `${spacing[3]} ${spacing[6]}`};
    border: none;
    border-radius: ${borderRadius.md};
    font-weight: ${typography.fontWeights.semibold};
    font-size: 
      ${size === 'small' ? typography.fontSizes.sm : size === 'medium' ? typography.fontSizes.base : typography.fontSizes.lg};
    font-family: ${typography.fontFamily};
    cursor: ${disabled || loading ? 'not-allowed' : 'pointer'};
    transition: ${transitions.all};
    text-decoration: none;
    width: ${fullWidth ? '100%' : 'auto'};
    height: auto;
    overflow: hidden;
    position: relative;
    outline: none;
    ${className};

    // Base styles
    &:focus {
      outline: 2px solid ${COLORS.primary};
      outline-offset: 2px;
    }
    
    &:disabled,
    &[disabled] {
      opacity: 0.6;
      filter: grayscale(30%);
    }

    // Loading state
    ${loading && `
      opacity: 0.8;
      pointer-events: none;
    `}

    // Primary variant - Gradient background
    ${variant === 'primary' && `
      background-image: ${COLORS.primaryGradient};
      color: white;
      box-shadow: ${shadows.md};
      
      &:hover:not(:disabled):not(:loading) {
        background-image: ${COLORS.primaryHover};
        transform: translateY(-2px);
        box-shadow: ${shadows.hover};
        text-shadow: 0 1px 2px rgba(0,0,0,0.1);
      }
      
      &:active:not(:disabled):not(:loading) {
        transform: translateY(-1px);
        box-shadow: ${shadows.active};
      }
      
      &:focus {
        outline: 2px solid ${COLORS.primaryLight};
      }
    `}

    // Secondary variant - Subtle gradient
    ${variant === 'secondary' && `
      background-color: ${COLORS.secondary};
      color: white;
      box-shadow: ${shadows.md};
      
      &:hover:not(:disabled):not(:loading) {
        background-color: ${COLORS.secondaryDark};
        transform: translateY(-2px);
        box-shadow: ${shadows.hover};
      }
      
      &:active:not(:disabled):not(:loading) {
        transform: translateY(-1px);
        box-shadow: ${shadows.active};
      }
    `}

    // Success variant
    ${variant === 'success' && `
      background-color: ${COLORS.success};
      color: white;
      box-shadow: ${shadows.md};
      
      &:hover:not(:disabled):not(:loading) {
        background-color: ${COLORS.successDark};
        transform: translateY(-2px);
        box-shadow: ${shadows.hover};
      }
      
      &:active:not(:disabled):not(:loading) {
        transform: translateY(-1px);
        box-shadow: ${shadows.active};
      }
    `}

    // Danger variant
    ${variant === 'danger' && `
      background-color: ${COLORS.danger};
      color: white;
      box-shadow: ${shadows.md};
      
      &:hover:not(:disabled):not(:loading) {
        background-color: ${COLORS.dangerDark};
        transform: translateY(-2px);
        box-shadow: ${shadows.hover};
      }
      
      &:active:not(:disabled):not(:loading) {
        transform: translateY(-1px);
        box-shadow: ${shadows.active};
      }
    `}

    // Warning variant
    ${variant === 'warning' && `
      background-color: ${COLORS.warning};
      color: white;
      box-shadow: ${shadows.md};
      
      &:hover:not(:disabled):not(:loading) {
        background-color: ${COLORS.warningDark};
        transform: translateY(-2px);
        box-shadow: ${shadows.hover};
      }
      
      &:active:not(:disabled):not(:loading) {
        transform: translateY(-1px);
        box-shadow: ${shadows.active};
      }
    `}

    // Info variant
    ${variant === 'info' && `
      background-color: ${COLORS.primaryLight};
      color: white;
      box-shadow: ${shadows.md};
      
      &:hover:not(:disabled):not(:loading) {
        background-color: ${COLORS.primary};
        transform: translateY(-2px);
        box-shadow: ${shadows.hover};
      }
      
      &:active:not(:disabled):not(:loading) {
        transform: translateY(-1px);
        box-shadow: ${shadows.active};
      }
    `}
    
    // Outline variant
    ${variant === 'outline' && `
      background-color: transparent;
      color: ${COLORS.textPrimary};
      border: 2px solid ${COLORS.borderMedium};
      
      &:hover:not(:disabled):not(:loading) {
        border-color: ${COLORS.primary};
        color: ${COLORS.primary};
        background-color: ${COLORS.bgTertiary};
      }
      
      &:focus {
        outline: 2px solid ${COLORS.primaryLight};
      }
    `}
    
    // Ghost variant
    ${variant === 'ghost' && `
      background-color: transparent;
      color: ${COLORS.textSecondary};
      
      &:hover:not(:disabled):not(:loading) {
        background-color: ${COLORS.bgTertiary};
        color: ${COLORS.textPrimary};
      }
    `}
    
    // Link variant
    ${variant === 'link' && `
      background-color: transparent;
      color: ${colors.primary};
      text-decoration: underline;
      padding: 0;
      
      &:hover:not(:disabled):not(:loading) {
        color: ${colors.primaryDark};
        text-decoration: none;
      }
    `}
    
    // Glassmorphism variant
    ${variant === 'glass' && `
      background: ${colors.glassBg};
      color: ${colors.textPrimary};
      backdrop-filter: blur(12px);
      border: 1px solid ${colors.glassBorder};
      box-shadow: ${colors.glassShadow};
      
      &:hover:not(:disabled):not(:loading) {
        background: rgba(255, 255, 255, 0.9);
        transform: translateY(-2px);
      }
    `}
    
    // Neumorphism variant
    ${variant === 'neumorph' && `
      background: ${colors.neuBg};
      color: ${colors.textPrimary};
      border: none;
      box-shadow: ${colors.neuShadowLight}, ${colors.neuShadowDark};
      
      &:hover:not(:disabled):not(:loading) {
        transform: translateY(-1px);
      }
      
      &:active:not(:disabled):not(:loading) {
        box-shadow: inset ${colors.neuShadowDark},
                    inset ${colors.neuShadowLight};
        transform: translateY(0);
      }
    `}
    
    // Responsive adjustments
    @media (max-width: 640px) {
      padding: 
        ${size === 'small' ? `${spacing[1]} ${spacing[2]}` : size === 'medium' ? `${spacing[1.5]} ${spacing[3]}` : `${spacing[2]} ${spacing[4]}`};
      
      font-size: 
        ${size === 'small' ? typography.fontSizes.xs : size === 'medium' ? typography.fontSizes.sm : typography.fontSizes.base};
      
      border-radius: ${borderRadius.sm};
    }
  `; 
    
  // Loading spinner
  const Spinner = styled.div`
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    // Adjust spinner colors for different variants
    ${variant === 'outline' && `
      border: 2px solid rgba(59, 130, 246, 0.3);
      border-top-color: #3b82f6;
    `}
    
    ${variant === 'ghost' && `
      border: 2px solid rgba(59, 130, 246, 0.3);
      border-top-color: #3b82f6;
    `}
    
    ${variant === 'link' && `
      border: 2px solid rgba(59, 130, 246, 0.3);
      border-top-color: #3b82f6;
    `}
    
    ${variant === 'neumorph' && `
      border: 2px solid rgba(107, 114, 128, 0.3);
      border-top-color: #6b7280;
    `}
  `;

  return (
    <ButtonVariant 
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {Icon && !loading && <Icon size={size === 'small' ? 16 : 20} />}
      {loading ? <Spinner /> : children}
    </ButtonVariant>
  );
};

export default Button;