import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import './Notification.css';

/**
 * Simple Notification component with minimal styling
 * @param {Object} props - Notification properties
 * @param {Object} props.notification - Notification data
 * @param {string} props.notification.message - Notification message
 * @param {string} props.notification.type - Notification type (success, error, warning, info)
 * @param {number} props.notification.duration - Notification duration
 * @param {Function} props.onClose - Close notification handler
 */
const Notification = ({ notification, onClose }) => {
  const notificationRef = useRef(null);
  const { message, type } = notification;
  
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
  
  // Determine the variant class based on notification type
  const variantClass = `notification--${type}`;
  
  return (
    <div 
      ref={notificationRef}
      className={`notification ${variantClass}`}
    >
      <div className="notification__content">
        <div className="notification__icon"></div>
        <div className="notification__message">{message}</div>
        <button 
          className="notification__dismiss-button"
          onClick={onClose}
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Notification;