import React, { useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { X } from 'lucide-react';

const Notification = ({ notification, onClose }) => {
  const notificationRef = useRef(null);
  const { message, type, duration } = notification;
  
  // Handle click outside to close
  const handleClickOutside = (event) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      onClose();
    }
  };
  
  // Add event listener for click outside
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Determine the icon and color based on notification type
  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return { color: '#10b981', background: '#d1fae5' };
      case 'error':
        return { color: '#ef4444', background: '#fee2e2' };
      case 'warning':
        return { color: '#f59e0b', background: '#fef3c7' };
      case 'info':
      default:
        return { color: '#3b82f6', background: '#dbeafe' };
    }
  };
  
  const { color, background } = getIconAndColor();
  
  return (
    <NotificationContainer 
      ref={notificationRef}
      type={type}
      background={background}
      color={color}
    >
      <NotificationContent>
        <NotificationIcon color={color} type={type} />
        <NotificationMessage>{message}</NotificationMessage>
        <DismissButton onClick={onClose}>
          <X size={16} color={color} />
        </DismissButton>
      </NotificationContent>
    </NotificationContainer>
  );
};

// Animation for notification entrance
const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

// Animation for notification exit
const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

// Container for the notification
const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  background-color: ${props => props.background};
  color: ${props => props.color};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: ${slideIn} 0.3s ease-out forwards;
  min-width: 300px;
  max-width: 400px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  // Different types have slight visual variations
  ${props => props.type === 'success' && `
    border-left: 4px solid #10b981;
  `}
  
  ${props => props.type === 'error' && `
    border-left: 4px solid #ef4444;
  `}
  
  ${props => props.type === 'warning' && `
    border-left: 4px solid #f59e0b;
  `}
  
  ${props => props.type === 'info' && `
    border-left: 4px solid #3b82f6;
  `}
  
  // Responsive adjustments
  @media (max-width: 768px) {
    left: 20px;
    right: 20px;
    min-width: auto;
  }
`;

// Content wrapper for the notification
const NotificationContent = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 12px;
  width: 100%;
`;

// Notification icon
const NotificationIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: ${props => props.color}10;
  border-radius: 50%;
  flex-shrink: 0;
  
  // Icons are represented with emoji for simplicity
  ${props => props.type === 'success' && `
    &::before {
      content: '✓';
      font-size: 16px;
      font-weight: bold;
      color: ${props.color};
    }
  `}
  
  ${props => props.type === 'error' && `
    &::before {
      content: '✗';
      font-size: 16px;
      font-weight: bold;
      color: ${props.color};
    }
  `}
  
  ${props => props.type === 'warning' && `
    &::before {
      content: '!';
      font-size: 16px;
      font-weight: bold;
      color: ${props.color};
    }
  `}
  
  ${props => props.type === 'info' && `
    &::before {
      content: 'i';
      font-size: 16px;
      font-weight: bold;
      color: ${props.color};
    }
  `}
`;

// Notification message
const NotificationMessage = styled.div`
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
  color: inherit;
  word-wrap: break-word;
`;

// Dismiss button
const DismissButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  flex-shrink: 0;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export default Notification;