import React, { useRef, useEffect } from 'react';
import './Modal.css';
import Button from './Button.jsx';

// Modal component
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer, 
  maxWidth,
  fullHeight = false,
  variant = 'default',
  closeOnOverlayClick = true,
  className = ''
}) => {
  const modalRef = useRef(null);
  
  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === modalRef.current) {
      onClose();
    }
  };
  
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
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
  }, [isOpen, onClose]);
  
  // If not open, don't render
  if (!isOpen) {
    return null;
  }
  
  return (
    <div 
      ref={modalRef}
      className={`modal-overlay ${className}`}
      onClick={handleOverlayClick}
    >
      <div 
        className={`modal-container modal-${variant}`}
        style={{
          maxWidth: maxWidth || '500px',
          maxHeight: fullHeight ? '90vh' : '80vh'
        }}
      >
        {title && (
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button 
              className="modal-close-button" 
              onClick={onClose} 
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}
        
        <div className="modal-body">
          {children}
        </div>
        
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
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
        disabled={isConfirming}
      >
        {confirmText}
      </Button>
    </>
  );
  
  return (
    <Modal 
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      {...props}
    >
      {children}
    </Modal>
  );
};

// Export components
Modal.Default = DefaultModal;

export default Modal;