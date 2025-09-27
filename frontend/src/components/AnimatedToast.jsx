import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { colors, typography, spacing, borderRadius, transitions, zIndex } from '../services/theme';

// Animation for fading in
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Animation for fading out
const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
`;

// Animation for sliding in from left
const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Animation for sliding in from right
const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Animation for sliding in from top
const slideInTop = keyframes`
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Animation for pulse effect
const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
`;

// Animation for bounce effect
const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

// Toast container
const ToastContainer = styled.div`
  position: fixed;
  z-index: ${zIndex.toast};
  padding: ${spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${spacing[3]};
  max-width: 400px;
  width: calc(100% - ${spacing[8]});
  box-sizing: border-box;
  
  // Position based on position prop
  ${({ position }) => {
    switch(position) {
      case 'top-left':
        return 'top: 0; left: 0;';
      case 'bottom-left':
        return 'bottom: 0; left: 0;';
      case 'top-right':
        return 'top: 0; right: 0;';
      case 'bottom-right':
        return 'bottom: 0; right: 0;';
      case 'top-center':
        return 'top: 0; left: 50%; transform: translateX(-50%);';
      case 'bottom-center':
        return 'bottom: 0; left: 50%; transform: translateX(-50%);';
      default:
        return 'top: 0; right: 0;';
    }
  }}
  
  // Responsive adjustments
  @media (max-width: 640px) {
    width: calc(100% - ${spacing[4]});
    padding: ${spacing[2]};
    max-width: none;
    
    ${({ position }) => {
      switch(position) {
        case 'top-center':
        case 'bottom-center':
          return 'left: 0; transform: none;';
        default:
          return '';
      }
    }}
  }
`;

// Individual toast notification
const Toast = styled.div`
  background-color: ${({ type, variant }) => {
    if (variant === 'glass') {
      return colors.glassBg;
    }
    if (variant === 'neumorph') {
      return colors.neuBg;
    }
    switch(type) {
      case 'success':
        return colors.successLight;
      case 'error':
        return colors.dangerLight;
      case 'warning':
        return colors.warningLight;
      case 'info':
        return colors.primaryLight;
      default:
        return colors.bgSecondary;
    }
  }};
  
  border: 1px solid ${({ type }) => {
    switch(type) {
      case 'success':
        return colors.success;
      case 'error':
        return colors.danger;
      case 'warning':
        return colors.warning;
      case 'info':
        return colors.primary;
      default:
        return colors.borderLight;
    }
  }};
  
  color: ${({ type }) => {
    switch(type) {
      case 'success':
        return colors.successDark;
      case 'error':
        return colors.dangerDark;
      case 'warning':
        return colors.warningDark;
      case 'info':
        return colors.primaryDark;
      default:
        return colors.textPrimary;
    }
  }};
  
  border-radius: ${borderRadius.md};
  padding: ${spacing[3]} ${spacing[4]};
  display: flex;
  align-items: flex-start;
  gap: ${spacing[3]};
  box-shadow: ${colors.shadows.md};
  opacity: 0;
  animation: 
    ${({ animation, position }) => {
      if (animation === 'slide') {
        if (position.includes('left')) return slideInLeft;
        if (position.includes('right')) return slideInRight;
        if (position.includes('top')) return slideInTop;
        return fadeIn;
      }
      return fadeIn;
    }}
    ${transitions.normal} ease-out forwards,
    ${({ autoClose }) => autoClose ? `${fadeOut} ${transitions.normal} ease-in forwards ${autoClose - transitions.normalTime}ms` : 'none'};
  
  // Glassmorphism effect
  ${({ variant }) => variant === 'glass' && `
    backdrop-filter: blur(12px);
    border: 1px solid ${colors.glassBorder};
    box-shadow: ${colors.glassShadow};
  `}
  
  // Neumorphism effect
  ${({ variant }) => variant === 'neumorph' && `
    border: none;
    box-shadow: ${colors.neuShadowLight}, ${colors.neuShadowDark};
  `}
  
  // Pulse animation for certain types
  ${({ type, pulse: shouldPulse }) => 
    (type === 'error' || shouldPulse) && `
    animation: 
      ${fadeIn} ${transitions.normal} ease-out forwards,
      ${pulse} 2s ease-in-out infinite,
      ${({ autoClose }) => autoClose ? `${fadeOut} ${transitions.normal} ease-in forwards ${autoClose - transitions.normalTime}ms` : 'none'};
  `}
  
  // Bounce animation for success type
  ${({ type }) => type === 'success' && `
    animation: 
      ${fadeIn} ${transitions.normal} ease-out forwards,
      ${bounce} 0.5s ease-out 0.2s,
      ${({ autoClose }) => autoClose ? `${fadeOut} ${transitions.normal} ease-in forwards ${autoClose - transitions.normalTime}ms` : 'none'};
  `}
  
  // Close button hover effect
  &:hover button {
    opacity: 1;
  }
  
  // Transition for auto-remove
  transition: transform ${transitions.normal} ease-in-out, opacity ${transitions.normal} ease-in-out;
`;

// Toast content wrapper
const ToastContent = styled.div`
  flex: 1;
  min-width: 0;
`;

// Toast title
const ToastTitle = styled.h3`
  font-size: ${typography.fontSizes.base};
  font-weight: ${typography.fontWeights.bold};
  margin: 0 0 ${spacing[1]} 0;
  color: inherit;
`;

// Toast message
const ToastMessage = styled.p`
  font-size: ${typography.fontSizes.sm};
  margin: 0;
  color: inherit;
  line-height: 1.4;
`;

// Toast icon
const ToastIcon = styled.div`
  font-size: ${typography.fontSizes.lg};
  margin-top: 2px;
  flex-shrink: 0;
`;

// Close button
const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  opacity: 0.7;
  cursor: pointer;
  padding: ${spacing[1]};
  border-radius: ${borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${transitions.normal};
  font-size: ${typography.fontSizes.base};
  flex-shrink: 0;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    opacity: 1;
  }
  
  &:focus {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;

// Toast component
export const AnimatedToast = ({ 
  message, 
  type = 'info', 
  title, 
  autoClose = 5000, 
  onClose, 
  showCloseButton = true,
  animation = 'fade',
  position = 'top-right',
  variant = 'default',
  pulse = false,
  className = ''
}) => {
  const [visible, setVisible] = useState(true);
  
  // Handle auto-close
  useEffect(() => {
    let timer;
    if (autoClose && visible) {
      timer = setTimeout(() => {
        handleClose();
      }, autoClose);
    }
    
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [autoClose, visible]);
  
  // Handle close with animation
  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, transitions.normalTime);
  };
  
  // Get icon based on type
  const getIcon = () => {
    switch(type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return 'ℹ';
    }
  };
  
  // If not visible, don't render
  if (!visible) {
    return null;
  }
  
  return (
    <Toast 
      type={type} 
      animation={animation}
      position={position}
      autoClose={autoClose}
      variant={variant}
      pulse={pulse}
      className={className}
    >
      <ToastIcon>{getIcon()}</ToastIcon>
      <ToastContent>
        {title && <ToastTitle>{title}</ToastTitle>}
        <ToastMessage>{message}</ToastMessage>
      </ToastContent>
      {showCloseButton && (
        <CloseButton onClick={handleClose} aria-label="Close notification">
          ✕
        </CloseButton>
      )}
    </Toast>
  );
};

// Toast container provider component
export const ToastProvider = ({ 
  children, 
  position = 'top-right',
  variant = 'default',
  maxToasts = 5
}) => {
  const [toasts, setToasts] = useState([]);
  
  // Add a new toast
  const addToast = ({ 
    message, 
    type = 'info', 
    title, 
    autoClose = 5000,
    animation = 'fade',
    showCloseButton = true,
    pulse = false,
    variant: toastVariant = variant
  }) => {
    const id = Date.now() + Math.random();
    
    // Create new toast
    const newToast = {
      id,
      message,
      type,
      title,
      autoClose,
      animation,
      showCloseButton,
      pulse,
      variant: toastVariant,
      position
    };
    
    // Add to list and limit to maxToasts
    setToasts(prev => {
      const updated = [...prev, newToast];
      return updated.slice(-maxToasts);
    });
    
    // Return remove function
    return () => removeToast(id);
  };
  
  // Remove a toast
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  // Success toast shortcut
  const success = (message, options = {}) => {
    return addToast({ message, type: 'success', ...options });
  };
  
  // Error toast shortcut
  const error = (message, options = {}) => {
    return addToast({ message, type: 'error', ...options });
  };
  
  // Warning toast shortcut
  const warning = (message, options = {}) => {
    return addToast({ message, type: 'warning', ...options });
  };
  
  // Info toast shortcut
  const info = (message, options = {}) => {
    return addToast({ message, type: 'info', ...options });
  };
  
  return (
    <>
      {children}
      <ToastContainer position={position}>
        {toasts.map(toast => (
          <AnimatedToast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </ToastContainer>
    </>
  );
};

// Export utility functions
const toast = {
  success: (message, options = {}) => {
    // This is a placeholder. In a real app, you would use context or a global state manager.
    console.warn('Toast utility requires ToastProvider to be used in your app.');
    console.log('Success:', message);
  },
  error: (message, options = {}) => {
    console.warn('Toast utility requires ToastProvider to be used in your app.');
    console.log('Error:', message);
  },
  warning: (message, options = {}) => {
    console.warn('Toast utility requires ToastProvider to be used in your app.');
    console.log('Warning:', message);
  },
  info: (message, options = {}) => {
    console.warn('Toast utility requires ToastProvider to be used in your app.');
    console.log('Info:', message);
  }
};

// Default export
AnimatedToast.Provider = ToastProvider;
AnimatedToast.toast = toast;

export default AnimatedToast;