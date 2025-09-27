import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { colors, typography, spacing, borderRadius, transitions, zIndex } from '../services/theme';
import Button from './Button.jsx';

// Animation for modal appearing
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Animation for modal sliding up
const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Animation for modal scaling in
const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Animation for modal pulse (optional effect)
const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.01);
  }
`;

// Modal overlay (backdrop)
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${colors.overlay};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${zIndex.modal};
  opacity: 0;
  animation: ${fadeIn} ${transitions.normal} forwards;
  backdrop-filter: blur(4px);
  
  &.closing {
    animation: ${fadeIn} ${transitions.normal} reverse;
  }
  
  // For mobile responsiveness
  padding: ${spacing[4]};
  box-sizing: border-box;
`;

// Modal container
const ModalContainer = styled.div`
  background-color: ${({ variant }) => 
    variant === 'glass' ? colors.glassBg : 
    variant === 'neumorph' ? colors.neuBg : colors.bgPrimary};
  border-radius: ${borderRadius.lg};
  width: 100%;
  max-width: ${({ maxWidth }) => maxWidth || '500px'};
  max-height: ${({ fullHeight }) => fullHeight ? '90vh' : '80vh'};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: ${zIndex.modal + 1};
  
  // Animation based on animation type
  animation: 
    ${({ animation }) => animation === 'slideUp' ? slideUp : scaleIn} 
    ${transitions.normal} ease-out forwards;
  
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
  
  // Default shadow
  ${({ variant }) => variant === 'default' && `
    box-shadow: ${colors.shadows.xl};
    border: 1px solid ${colors.borderLight};
  `}
  
  // Close animation
  &.closing {
    animation: 
      ${({ animation }) => animation === 'slideUp' ? slideUp : scaleIn} 
      ${transitions.normal} ease-in reverse;
  }
  
  // Pulse animation (when pulse prop is true)
  ${({ pulse: shouldPulse }) => shouldPulse && `
    animation: ${pulse} 2s ease-in-out infinite;
  `}
  
  @media (max-width: 640px) {
    max-width: 100%;
    max-height: 95vh;
    margin: 0;
  }
`;

// Modal header
const ModalHeader = styled.div`
  padding: ${spacing[5]} ${spacing[6]};
  border-bottom: 1px solid ${colors.borderLight};
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  // For glass and neumorphism variants
  ${({ variant }) => variant === 'glass' || variant === 'neumorph' && `
    border-bottom-color: ${variant === 'glass' ? colors.glassBorder : colors.borderLight};
  `}
  
  @media (max-width: 640px) {
    padding: ${spacing[4]} ${spacing[5]};
  }
`;

// Modal title
const ModalTitle = styled.h2`
  font-size: ${typography.fontSizes.xl};
  font-weight: ${typography.fontWeights.bold};
  color: ${colors.textPrimary};
  margin: 0;
  line-height: 1.3;
`;

// Modal body
const ModalBody = styled.div`
  padding: ${spacing[6]};
  overflow-y: auto;
  flex: 1;
  
  // Custom scrollbar
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${colors.bgSecondary};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${colors.borderMedium};
    border-radius: ${borderRadius.full};
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${colors.borderDark};
  }
  
  @media (max-width: 640px) {
    padding: ${spacing[4]} ${spacing[5]};
  }
`;

// Modal footer
const ModalFooter = styled.div`
  padding: ${spacing[5]} ${spacing[6]};
  border-top: 1px solid ${colors.borderLight};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${spacing[3]};
  flex-wrap: wrap;
  
  // For glass and neumorphism variants
  ${({ variant }) => variant === 'glass' || variant === 'neumorph' && `
    border-top-color: ${variant === 'glass' ? colors.glassBorder : colors.borderLight};
  `}
  
  @media (max-width: 640px) {
    padding: ${spacing[4]} ${spacing[5]};
    flex-direction: column;
    gap: ${spacing[2]};
    
    // Full width buttons on mobile
    button {
      width: 100%;
    }
  }
`;

// Close button
const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${colors.textSecondary};
  cursor: pointer;
  padding: ${spacing[1]};
  border-radius: ${borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${transitions.normal};
  font-size: ${typography.fontSizes.lg};
  
  &:hover {
    background-color: ${colors.bgSecondary};
    color: ${colors.textPrimary};
  }
  
  &:focus {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

// AnimatedModal component
export const AnimatedModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer, 
  maxWidth, 
  fullHeight = false,
  variant = 'default',
  animation = 'scaleIn',
  pulse = false,
  closeOnOverlayClick = true,
  className = ''
}) => {
  const modalRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  
  // Handle close with animation
  const handleClose = () => {
    if (!isClosing) {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
        setIsClosing(false);
      }, transitions.normalTime);
    }
  };
  
  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === modalRef.current) {
      handleClose();
    }
  };
  
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !isClosing) {
        handleClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent body scrolling
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = ''; // Restore body scrolling
    };
  }, [isOpen, isClosing]);
  
  // If not open, don't render
  if (!isOpen && !isClosing) {
    return null;
  }
  
  return (
    <ModalOverlay 
      ref={modalRef}
      onClick={handleOverlayClick}
      className={isClosing ? 'closing' : ''}
    >
      <ModalContainer 
        maxWidth={maxWidth}
        fullHeight={fullHeight}
        variant={variant}
        animation={animation}
        pulse={pulse}
        className={isClosing ? 'closing' : className}
      >
        {title && (
          <ModalHeader variant={variant}>
            <ModalTitle>{title}</ModalTitle>
            <CloseButton onClick={handleClose} aria-label="Close modal">
              ✕
            </CloseButton>
          </ModalHeader>
        )}
        
        <ModalBody>
          {children}
        </ModalBody>
        
        {footer && (
          <ModalFooter variant={variant}>
            {footer}
          </ModalFooter>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};

// Default modal with standard buttons
export const DefaultModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  confirmVariant = 'primary',
  cancelVariant = 'outline',
  isConfirming = false,
  ...props 
}) => {
  const footer = (
    <>
      <Button 
        variant={cancelVariant}
        onClick={onClose}
        disabled={isConfirming}
      >
        {cancelText}
      </Button>
      <Button 
        variant={confirmVariant}
        onClick={onConfirm}
        loading={isConfirming}
      >
        {confirmText}
      </Button>
    </>
  );
  
  return (
    <AnimatedModal 
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      {...props}
    >
      {children}
    </AnimatedModal>
  );
};

// Export components
AnimatedModal.Default = DefaultModal;

export default AnimatedModal;