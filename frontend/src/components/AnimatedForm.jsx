import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { COLORS, typography, spacing, borderRadius, transitions } from '../services/theme';

// Animation for form submission
const submitAnimation = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(0.98); }
`;

// Base form component
const Form = styled.form`
  width: 100%;
  max-width: ${({ maxWidth }) => maxWidth || '600px'};
  padding: ${spacing[6]};
  border-radius: ${borderRadius.lg};
  background-color: ${({ variant }) => 
    variant === 'glass' ? COLORS.glassBg : 
    variant === 'neumorph' ? COLORS.neuBg : COLORS.bgPrimary};
  
  // Glassmorphism effect
  ${({ variant }) => variant === 'glass' && `
    backdrop-filter: blur(12px);
    border: 1px solid ${COLORS.glassBorder};
    box-shadow: ${COLORS.glassShadow};
  `}
  
  // Neumorphism effect
  ${({ variant }) => variant === 'neumorph' && `
    border: none;
    box-shadow: ${COLORS.neuShadowLight}, ${COLORS.neuShadowDark};
  `}
  
  // Default form styling
  ${({ variant }) => variant === 'default' && `
    border: 1px solid ${COLORS.borderLight};
    box-shadow: ${COLORS.shadows.md};
  `}
  
  transition: all ${transitions.normal};
  
  // Submission animation
  &.submitting {
    animation: ${submitAnimation} 0.5s ease-in-out;
  }
  
  @media (max-width: 640px) {
    padding: ${spacing[4]};
  }
`;

// Form group to wrap label and input
const FormGroup = styled.div`
  position: relative;
  margin-bottom: ${spacing[5]};
  
  &:last-of-type {
    margin-bottom: ${spacing[6]};
  }
`;

// Floating label style
const Label = styled.label`
  position: absolute;
  top: 50%;
  left: ${spacing[3]};
  transform: translateY(-50%);
  font-size: ${typography.fontSizes.sm};
  font-weight: ${typography.fontWeights.medium};
  color: ${({ error, focus }) => 
    error ? colors.danger : 
    focus ? colors.primary : colors.textTertiary};
  pointer-events: none;
  transition: all ${transitions.normal};
  background-color: ${({ variant }) => 
    variant === 'glass' || variant === 'neumorph' ? 'transparent' : colors.bgPrimary};
  padding: 0 ${spacing[1]};
  z-index: 1;
  
  // Floating effect when focused or has value
  ${({ hasValue, focus }) => (hasValue || focus) && `
    top: 0;
    transform: translateY(-50%);
    font-size: ${typography.fontSizes.xs};
    color: ${colors.primary};
  `};
`;

// Base input style
const Input = styled.input`
  width: 100%;
  padding: ${spacing[3]} ${spacing[4]};
  border: 2px solid ${({ error, focus }) => 
    error ? colors.danger : 
    focus ? colors.primary : colors.borderMedium};
  border-radius: ${borderRadius.md};
  font-size: ${typography.fontSizes.base};
  font-family: ${typography.fontFamily};
  color: ${colors.textPrimary};
  background-color: ${({ variant }) => 
    variant === 'glass' ? 'rgba(255, 255, 255, 0.1)' : 
    variant === 'neumorph' ? colors.neuBg : colors.bgPrimary};
  transition: all ${transitions.normal};
  
  // Glassmorphism specific
  ${({ variant }) => variant === 'glass' && `
    backdrop-filter: blur(4px);
  `}
  
  // Neumorphism specific
  ${({ variant }) => variant === 'neumorph' && `
    box-shadow: inset 2px 2px 5px rgba(163, 177, 198, 0.4),
                inset -2px -2px 5px rgba(255, 255, 255, 0.6);
    border: none;
  `}
  
  // Focus state
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }
  
  // Error state
  ${({ error }) => error && `
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  `}
  
  // Disabled state
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${colors.bgTertiary};
  }
  
  // Placeholder color
  &::placeholder {
    color: ${colors.textLight};
    opacity: 0;
    transition: opacity ${transitions.normal};
  }
  
  // Show placeholder when input is not focused and has no value
  &:not(:focus)::placeholder {
    opacity: 1;
  }
  
  @media (max-width: 640px) {
    padding: ${spacing[2]} ${spacing[3]};
  }
`;

// Textarea style
const Textarea = styled.textarea`
  width: 100%;
  padding: ${spacing[3]} ${spacing[4]};
  border: 2px solid ${({ error, focus }) => 
    error ? colors.danger : 
    focus ? colors.primary : colors.borderMedium};
  border-radius: ${borderRadius.md};
  font-size: ${typography.fontSizes.base};
  font-family: ${typography.fontFamily};
  color: ${colors.textPrimary};
  background-color: ${({ variant }) => 
    variant === 'glass' ? 'rgba(255, 255, 255, 0.1)' : 
    variant === 'neumorph' ? colors.neuBg : colors.bgPrimary};
  transition: all ${transitions.normal};
  resize: vertical;
  min-height: 120px;
  
  // Glassmorphism specific
  ${({ variant }) => variant === 'glass' && `
    backdrop-filter: blur(4px);
  `}
  
  // Neumorphism specific
  ${({ variant }) => variant === 'neumorph' && `
    box-shadow: inset 2px 2px 5px rgba(163, 177, 198, 0.4),
                inset -2px -2px 5px rgba(255, 255, 255, 0.6);
    border: none;
  `}
  
  // Focus state
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }
  
  // Error state
  ${({ error }) => error && `
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  `}
  
  // Placeholder color
  &::placeholder {
    color: ${colors.textLight};
    opacity: 0;
  }
  
  // Show placeholder when textarea is not focused and has no value
  &:not(:focus)::placeholder {
    opacity: 1;
  }
`;

// Select style
const Select = styled.select`
  width: 100%;
  padding: ${spacing[3]} ${spacing[4]};
  border: 2px solid ${({ error, focus }) => 
    error ? colors.danger : 
    focus ? colors.primary : colors.borderMedium};
  border-radius: ${borderRadius.md};
  font-size: ${typography.fontSizes.base};
  font-family: ${typography.fontFamily};
  color: ${colors.textPrimary};
  background-color: ${({ variant }) => 
    variant === 'glass' ? 'rgba(255, 255, 255, 0.1)' : 
    variant === 'neumorph' ? colors.neuBg : colors.bgPrimary};
  transition: all ${transitions.normal};
  cursor: pointer;
  
  // Glassmorphism specific
  ${({ variant }) => variant === 'glass' && `
    backdrop-filter: blur(4px);
  `}
  
  // Neumorphism specific
  ${({ variant }) => variant === 'neumorph' && `
    box-shadow: inset 2px 2px 5px rgba(163, 177, 198, 0.4),
                inset -2px -2px 5px rgba(255, 255, 255, 0.6);
    border: none;
  `}
  
  // Focus state
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  // Error state
  ${({ error }) => error && `
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  `}
`;

// Error message style
const ErrorMessage = styled.div`
  color: ${colors.danger};
  font-size: ${typography.fontSizes.xs};
  margin-top: ${spacing[1]};
  padding-left: ${spacing[3]};
  display: flex;
  align-items: center;
  gap: ${spacing[1]};
  
  animation: fadeIn 0.2s ease-in-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Form field component
const FormField = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  variant = 'default',
  className = '',
  ...props 
}) => {
  const [focus, setFocus] = useState(false);
  const hasValue = value !== undefined && value !== null && value !== '';
  
  // Handle focus events
  const handleFocus = () => setFocus(true);
  const handleBlur = () => setFocus(false);
  
  // Render appropriate input type
  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <Textarea
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          error={error}
          focus={focus}
          variant={variant}
          placeholder={label}
          {...props}
        />
      );
    } else if (type === 'select') {
      return (
        <Select
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          error={error}
          focus={focus}
          variant={variant}
          {...props}
        />
      );
    }
    
    return (
      <Input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        error={error}
        focus={focus}
        variant={variant}
        placeholder={label}
        {...props}
      />
    );
  };
  
  return (
    <FormGroup className={className}>
      <Label 
        htmlFor={props.id || props.name}
        hasValue={hasValue}
        focus={focus}
        error={error}
        variant={variant}
      >
        {label}
      </Label>
      {renderInput()}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FormGroup>
  );
};

// AnimatedForm component
export const AnimatedForm = ({ 
  onSubmit, 
  children, 
  className = '',
  variant = 'default',
  maxWidth,
  isSubmitting = false,
  ...props 
}) => {
  return (
    <Form
      onSubmit={onSubmit}
      className={`${className} ${isSubmitting ? 'submitting' : ''}`}
      variant={variant}
      maxWidth={maxWidth}
      {...props}
    >
      {children}
    </Form>
  );
};

// Export individual components
AnimatedForm.Field = FormField;
AnimatedForm.Input = Input;
AnimatedForm.Textarea = Textarea;
AnimatedForm.Select = Select;
AnimatedForm.Label = Label;
AnimatedForm.ErrorMessage = ErrorMessage;

// Default export
export default AnimatedForm;