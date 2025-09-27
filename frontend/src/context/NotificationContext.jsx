import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Notification from '../components/Notification.jsx';

// Create the notification context
export const NotificationContext = createContext();

// Custom hook to use NotificationContext easily
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Notification provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  
  // Add a new notification
  const addNotification = useCallback(({
    message,
    type = 'info',
    duration = 5000,
    id = Math.random().toString(36).substring(2, 15)
  }) => {
    // Create a notification object
    const notification = {
      id,
      message,
      type,
      duration,
      createdAt: Date.now()
    };
    
    // Add the notification to the state
    setNotifications(prevNotifications => [...prevNotifications, notification]);
    
    // Return the ID so it can be dismissed programmatically if needed
    return id;
  }, []);
  
  // Remove a notification by ID
  const removeNotification = useCallback((id) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== id)
    );
  }, []);
  
  // Automatically remove notifications after their duration
  useEffect(() => {
    if (notifications.length === 0) return;
    
    // Set up timers for each notification
    const timers = notifications.map(notification => {
      // Calculate how much time has already passed since the notification was created
      const elapsed = Date.now() - notification.createdAt;
      // If the notification has already been displayed for longer than its duration, remove it immediately
      if (elapsed >= notification.duration) {
        removeNotification(notification.id);
        return null;
      }
      // Otherwise, set a timer to remove it after the remaining duration
      return setTimeout(() => {
        removeNotification(notification.id);
      }, notification.duration - elapsed);
    });
    
    // Clean up timers on unmount or when notifications change
    return () => {
      timers.forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [notifications, removeNotification]);
  
  // Dismiss all notifications
  const dismissAll = useCallback(() => {
    setNotifications([]);
  }, []);
  
  // Helper methods for common notification types
  const showSuccess = useCallback((message, duration = 3000) => {
    return addNotification({ message, type: 'success', duration });
  }, [addNotification]);
  
  const showError = useCallback((message, duration = 5000) => {
    return addNotification({ message, type: 'error', duration });
  }, [addNotification]);
  
  const showInfo = useCallback((message, duration = 4000) => {
    return addNotification({ message, type: 'info', duration });
  }, [addNotification]);
  
  const showWarning = useCallback((message, duration = 4000) => {
    return addNotification({ message, type: 'warning', duration });
  }, [addNotification]);
  
  // Context value
  const value = {
    notifications,
    addNotification,
    removeNotification,
    dismissAll,
    showSuccess,
    showError,
    showInfo,
    showWarning
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Render all notifications */}
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  );
};