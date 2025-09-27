import React, { useState } from 'react';
import './Form.css';

// Form component
export const Form = ({ 
  onSubmit, 
  children, 
  className = '',
  variant = 'default',
  maxWidth,
  isSubmitting = false,
  ...props 
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className={`form ${className} form-${variant}`}
      style={{ maxWidth: maxWidth || '600px' }}
      {...props}
    >
      {children}
    </form>
  );
};

// FormField component
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
  // Render appropriate input type
  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          className={`form-input form-textarea ${error ? 'form-input-error' : ''} ${className}`}
          value={value}
          onChange={onChange}
          placeholder={label}
          {...props}
        />
      );
    } else if (type === 'select') {
      return (
        <select
          className={`form-input form-select ${error ? 'form-input-error' : ''} ${className}`}
          value={value}
          onChange={onChange}
          {...props}
        >
          {props.children}
        </select>
      );
    }
    
    return (
      <input
        type={type}
        className={`form-input ${error ? 'form-input-error' : ''} ${className}`}
        value={value}
        onChange={onChange}
        placeholder={label}
        {...props}
      />
    );
  };
  
  return (
    <div className="form-group">
      {label && !props.placeholder && (
        <label className="form-label" htmlFor={props.id || props.name}>
          {label}
        </label>
      )}
      {renderInput()}
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

// Export individual components
Form.Field = FormField;
Form.Input = ({ className, error, ...props }) => (
  <input 
    className={`form-input ${error ? 'form-input-error' : ''} ${className}`}
    {...props}
  />
);

Form.Textarea = ({ className, error, ...props }) => (
  <textarea 
    className={`form-input form-textarea ${error ? 'form-input-error' : ''} ${className}`}
    {...props}
  />
);

Form.Select = ({ className, error, ...props }) => (
  <select 
    className={`form-input form-select ${error ? 'form-input-error' : ''} ${className}`}
    {...props}
  >
    {props.children}
  </select>
);

Form.Label = ({ className, ...props }) => (
  <label className={`form-label ${className}`} {...props} />
);

Form.ErrorMessage = ({ className, ...props }) => (
  <div className={`form-error ${className}`} {...props} />
);

// Default export
export default Form;