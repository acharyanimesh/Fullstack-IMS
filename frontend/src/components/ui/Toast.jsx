import React, { useState, useEffect, createContext, useContext } from 'react';
import { Alert } from './index';

// Toast Context
const ToastContext = createContext();

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: 'info',
      autoDismiss: true,
      dismissAfter: 5000,
      ...toast
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove toast
    if (newToast.autoDismiss) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.dismissAfter);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  // Convenience methods
  const showSuccess = (message, options = {}) => {
    return addToast({ type: 'success', message, ...options });
  };

  const showError = (message, options = {}) => {
    return addToast({ type: 'error', message, autoDismiss: false, ...options });
  };

  const showWarning = (message, options = {}) => {
    return addToast({ type: 'warning', message, ...options });
  };

  const showInfo = (message, options = {}) => {
    return addToast({ type: 'info', message, ...options });
  };

  const value = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Toast Container Component
const ToastContainer = () => {
  const { toasts, removeToast } = useContext(ToastContext);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="transform transition-all duration-300 ease-in-out"
        >
          <Alert
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
            className="shadow-lg"
          />
        </div>
      ))}
    </div>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Individual Toast Component (for manual use)
const Toast = ({ 
  id,
  type = 'info',
  title,
  message,
  onClose,
  autoDismiss = true,
  dismissAfter = 5000,
  className = ''
}) => {
  useEffect(() => {
    if (autoDismiss && onClose) {
      const timer = setTimeout(() => {
        onClose(id);
      }, dismissAfter);

      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissAfter, onClose, id]);

  return (
    <div className={`transform transition-all duration-300 ease-in-out ${className}`}>
      <Alert
        type={type}
        title={title}
        message={message}
        onClose={() => onClose && onClose(id)}
        className="shadow-lg"
      />
    </div>
  );
};

export default Toast;
