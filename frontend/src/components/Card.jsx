import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { COLORS, spacing, borderRadius, shadows, transitions, breakpoints } from '../services/theme';

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

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const Card = ({ 
  children, 
  variant = 'default', 
  elevation = 'medium', 
  padding = 'medium', 
  fullWidth = false, 
  className = '', 
  animation = 'fade', // 'fade', 'scale', 'slide', or false to disable
  animationDuration = '300ms',
  animationDelay = '0ms',
  ...props 
}) => {
  const [visible, setVisible] = useState(false);
  const cardRef = useRef(null);
  
  // Intersection Observer to trigger animation when card enters viewport
  useEffect(() => {
    if (!animation) {
      setVisible(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px'
      }
    );
    
    const currentRef = cardRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [animation]);
  
  // Get animation keyframe
  const getAnimation = () => {
    switch (animation) {
      case 'scale':
        return scaleIn;
      case 'slide':
        return slideIn;
      case 'fade':
      default:
        return fadeIn;
    }
  };

  // Define the card container with configurable styles
  const CardContainer = styled.div`
    background-color: ${colors.bgPrimary};
    border-radius: ${borderRadius.md};
    overflow: hidden;
    transition: all ${transitions.normal};
    width: ${fullWidth ? '100%' : 'auto'};
    position: relative;
    display: flex;
    flex-direction: column;
    ${className};
    
    // Animation styles
    ${animation && !visible && `
      opacity: 0;
    `}
    
    ${animation && visible && `
      animation: ${getAnimation()} ${animationDuration} ease-out ${animationDelay} forwards;
    `}

    // Set padding based on size
    padding: 
      ${padding === 'small' ? spacing[3] : padding === 'medium' ? spacing[4] : padding === 'large' ? spacing[6] : 0};

    // Elevation/shadow based on level
    ${elevation === 'none' && `
      box-shadow: ${shadows.none};
    `}

    ${elevation === 'low' && `
      box-shadow: ${shadows.sm};
    `}

    ${elevation === 'medium' && `
      box-shadow: ${shadows.md};
    `}

    ${elevation === 'high' && `
      box-shadow: ${shadows.lg};
    `}

    // Variant styles
    ${variant === 'default' && `
      background-color: ${COLORS.bgPrimary};
      border: 1px solid ${COLORS.borderLight};
    `}

    ${variant === 'primary' && `
      background-color: ${COLORS.primaryLight};
      border: 1px solid ${COLORS.primary};
      color: ${COLORS.textPrimary};
    `}

    ${variant === 'success' && `
      background-color: ${COLORS.successLight};
      border: 1px solid ${COLORS.success};
      color: ${COLORS.textPrimary};
    `}

    ${variant === 'warning' && `
      background-color: ${COLORS.warningLight};
      border: 1px solid ${COLORS.warning};
      color: ${COLORS.textPrimary};
    `}

    ${variant === 'danger' && `
      background-color: ${COLORS.dangerLight};
      border: 1px solid ${COLORS.danger};
      color: ${COLORS.textPrimary};
    `}

    ${variant === 'outline' && `
      background-color: transparent;
      border: 1px solid ${COLORS.borderMedium};
    `}

    // Glassmorphism variant
    ${variant === 'glass' && `
      background: ${COLORS.glassBg};
      backdrop-filter: blur(12px);
      border: 1px solid ${COLORS.glassBorder};
      box-shadow: ${COLORS.glassShadow};
    `}

    // Neumorphism variant
    ${variant === 'neumorph' && `
      background: ${COLORS.neuBg};
      border: none;
      box-shadow: ${COLORS.neuShadowLight}, ${COLORS.neuShadowDark};
      &:hover {
        box-shadow: 8px 8px 16px rgba(163, 177, 198, 0.7),
                    -8px -8px 16px rgba(255, 255, 255, 0.9);
      }
    `}

    // Interactive card hover effect
    &:hover:not(.no-hover) {
      transform: translateY(-3px);
      box-shadow: 
        ${elevation === 'none' || elevation === 'low' ? 
          shadows.hover : 
          shadows.xl
        };
      z-index: ${visible ? 10 : 1};
    }

    // Active state for clickable cards
    &:active {
      transform: translateY(-1px);
      box-shadow: 
        ${elevation === 'none' || elevation === 'low' ? 
          shadows.md : 
          shadows.lg
        };
    }

    // Responsive adjustments
    @media (max-width: ${breakpoints.sm}) {
      padding: 
        ${padding === 'small' ? spacing[2] : padding === 'medium' ? spacing[3] : padding === 'large' ? spacing[4] : 0};
      border-radius: ${borderRadius.sm};
      
      // Mobile-specific animation
      ${animation && visible && `
        animation-duration: calc(${animationDuration} * 1.2);
      `}
    }
  `;

  return (
    <CardContainer ref={cardRef} {...props}>
      {children}
    </CardContainer>
  );
};

export default Card;