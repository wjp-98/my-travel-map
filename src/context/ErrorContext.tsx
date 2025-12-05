import React, { createContext, useContext, useState, useCallback } from 'react';
import ErrorMessage from '@/components/ErrorMessage';

interface ErrorContextType {
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showSuccess: (message: string) => void;
}

const ErrorContext = createContext<ErrorContextType | null>(null);

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<{
    message: string;
    type: 'error' | 'warning' | 'success';
  } | null>(null);

  const showError = useCallback((message: string) => {
    setError({ message, type: 'error' });
  }, []);

  const showWarning = useCallback((message: string) => {
    setError({ message, type: 'warning' });
  }, []);

  const showSuccess = useCallback((message: string) => {
    setError({ message, type: 'success' });
  }, []);

  const handleClose = useCallback(() => {
    setError(null);
  }, []);

  return (
    <ErrorContext.Provider value={{ showError, showWarning, showSuccess }}>
      {children}
      {error && (
        <ErrorMessage
          message={error.message}
          type={error.type}
          onClose={handleClose}
        />
      )}
    </ErrorContext.Provider>
  );
}; 