import React, { useState, useEffect } from 'react';
import './Toast.css';

// Toast component
export const Toast = ({ 
  message, 
  type = 'info', 
  title, 
  autoClose = 5000, 
  onClose, 
  showCloseButton = true,
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
  
  // Handle close
  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 100); // Small delay to ensure component unmounts properly
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
    <div className={`toast toast-${type} ${className}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-content">
        {title && <h3 className="toast-title">{title}</h3>}
        <p className="toast-message">{message}</p>
      </div>
      {showCloseButton && (
        <button 
          className="toast-close-button" 
          onClick={handleClose} 
          aria-label="Close notification"
        >
          ✕
        </button>
      )}
    </div>
  );
};

// Toast container provider component
export const ToastProvider = ({ 
  children, 
  position = 'top-right',
  maxToasts = 5
}) => {
  const [toasts, setToasts] = useState([]);
  
  // Add a new toast
  const addToast = ({ 
    message, 
    type = 'info', 
    title, 
    autoClose = 5000,
    showCloseButton = true
  }) => {
    const id = Date.now() + Math.random();
    
    // Create new toast
    const newToast = {
      id,
      message,
      type,
      title,
      autoClose,
      showCloseButton
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
      <div className={`toast-container toast-position-${position}`}>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
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
Toast.Provider = ToastProvider;
Toast.toast = toast;

export default Toast;