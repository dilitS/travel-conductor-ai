/**
 * Unit tests for errorMessages.ts
 * Tests error code mapping to user-friendly Polish messages
 */

import {
  getErrorMessage,
  formatError,
  isNetworkError,
  isAuthError,
  isPermissionError,
  ErrorMessage,
} from './errorMessages';

describe('getErrorMessage', () => {
  describe('with null/undefined errors', () => {
    it('should return default error for null', () => {
      const result = getErrorMessage(null);
      expect(result.title).toBe('Wystąpił błąd');
      expect(result.message).toBe('Coś poszło nie tak. Spróbuj ponownie.');
    });

    it('should return default error for undefined', () => {
      const result = getErrorMessage(undefined);
      expect(result.title).toBe('Wystąpił błąd');
    });
  });

  describe('with Firebase Auth errors', () => {
    it('should handle auth/user-not-found', () => {
      const error = { code: 'auth/user-not-found', message: 'User not found' };
      Object.setPrototypeOf(error, Error.prototype);
      
      const result = getErrorMessage(error);
      expect(result.title).toBe('Nie znaleziono użytkownika');
      expect(result.message).toContain('e-mail');
    });

    it('should handle auth/wrong-password', () => {
      const error = { code: 'auth/wrong-password', message: 'Wrong password' };
      Object.setPrototypeOf(error, Error.prototype);
      
      const result = getErrorMessage(error);
      expect(result.title).toBe('Nieprawidłowe hasło');
    });

    it('should handle auth/email-already-in-use', () => {
      const error = { code: 'auth/email-already-in-use', message: 'Email in use' };
      Object.setPrototypeOf(error, Error.prototype);
      
      const result = getErrorMessage(error);
      expect(result.title).toBe('E-mail już używany');
    });

    it('should handle auth/network-request-failed', () => {
      const error = { code: 'auth/network-request-failed', message: 'Network error' };
      Object.setPrototypeOf(error, Error.prototype);
      
      const result = getErrorMessage(error);
      expect(result.title).toBe('Błąd sieci');
    });

    it('should handle auth/too-many-requests', () => {
      const error = { code: 'auth/too-many-requests', message: 'Too many requests' };
      Object.setPrototypeOf(error, Error.prototype);
      
      const result = getErrorMessage(error);
      expect(result.title).toBe('Zbyt wiele prób');
    });
  });

  describe('with Cloud Functions errors', () => {
    it('should handle unauthenticated', () => {
      const error = { code: 'unauthenticated', message: 'Unauthenticated' };
      Object.setPrototypeOf(error, Error.prototype);
      
      const result = getErrorMessage(error);
      expect(result.title).toBe('Brak autoryzacji');
    });

    it('should handle permission-denied', () => {
      const error = { code: 'permission-denied', message: 'Permission denied' };
      Object.setPrototypeOf(error, Error.prototype);
      
      const result = getErrorMessage(error);
      expect(result.title).toBe('Brak uprawnień');
    });

    it('should handle not-found', () => {
      const error = { code: 'not-found', message: 'Not found' };
      Object.setPrototypeOf(error, Error.prototype);
      
      const result = getErrorMessage(error);
      expect(result.title).toBe('Nie znaleziono');
    });

    it('should handle internal', () => {
      const error = { code: 'internal', message: 'Internal error' };
      Object.setPrototypeOf(error, Error.prototype);
      
      const result = getErrorMessage(error);
      expect(result.title).toBe('Błąd serwera');
    });

    it('should handle resource-exhausted', () => {
      const error = { code: 'resource-exhausted', message: 'Resource exhausted' };
      Object.setPrototypeOf(error, Error.prototype);
      
      const result = getErrorMessage(error);
      expect(result.title).toBe('Limit wyczerpany');
    });
  });

  describe('with network errors', () => {
    it('should detect network error from message', () => {
      const error = new Error('Network request failed');
      
      const result = getErrorMessage(error);
      expect(result.title).toBe('Błąd sieci');
    });

    it('should detect timeout error from message', () => {
      const error = new Error('Request timed out');
      
      const result = getErrorMessage(error);
      expect(result.title).toBe('Przekroczono limit czasu');
    });

    it('should detect internet connection error', () => {
      const error = new Error('No internet connection');
      
      const result = getErrorMessage(error);
      expect(result.title).toBe('Błąd sieci');
    });
  });

  describe('with premium errors', () => {
    it('should handle premium subscription errors', () => {
      const error = new Error('This feature requires premium subscription');
      
      const result = getErrorMessage(error);
      expect(result.title).toBe('Wymagane Premium');
      expect(result.message).toContain('premium');
    });

    it('should handle subscription errors', () => {
      const error = new Error('Your subscription has expired');
      
      const result = getErrorMessage(error);
      expect(result.title).toBe('Wymagane Premium');
    });
  });

  describe('with Polish error messages', () => {
    it('should preserve Polish error messages (non-premium)', () => {
      const error = new Error('Nie można połączyć się z serwerem.');
      
      const result = getErrorMessage(error);
      expect(result.title).toBe('Błąd');
      expect(result.message).toContain('połączyć');
    });

    it('should detect Polish characters in message', () => {
      const error = new Error('Operacja zakończona niepowodzeniem.');
      
      const result = getErrorMessage(error);
      expect(result.title).toBe('Błąd');
      expect(result.message).toContain('niepowodzeniem');
    });
  });

  describe('with string error codes', () => {
    it('should handle auth error code string', () => {
      const result = getErrorMessage('auth/user-not-found');
      expect(result.title).toBe('Nie znaleziono użytkownika');
    });

    it('should handle functions error code string', () => {
      const result = getErrorMessage('permission-denied');
      expect(result.title).toBe('Brak uprawnień');
    });

    it('should handle network error code string', () => {
      const result = getErrorMessage('network-error');
      expect(result.title).toBe('Błąd sieci');
    });

    it('should return default for unknown string', () => {
      const result = getErrorMessage('unknown-error-code');
      expect(result.title).toBe('Wystąpił błąd');
    });
  });

  describe('with unknown errors', () => {
    it('should return default error for unknown Error object', () => {
      const error = new Error('Some unknown error');
      
      const result = getErrorMessage(error);
      expect(result.title).toBe('Wystąpił błąd');
    });

    it('should return default error for number', () => {
      const result = getErrorMessage(404);
      expect(result.title).toBe('Wystąpił błąd');
    });

    it('should return default error for object without code', () => {
      const error = { foo: 'bar' };
      
      const result = getErrorMessage(error);
      expect(result.title).toBe('Wystąpił błąd');
    });
  });
});

describe('formatError', () => {
  it('should format error as "title: message"', () => {
    const error = { code: 'auth/user-not-found', message: 'User not found' };
    Object.setPrototypeOf(error, Error.prototype);
    
    const result = formatError(error);
    expect(result).toContain('Nie znaleziono użytkownika');
    expect(result).toContain(':');
  });

  it('should format default error', () => {
    const result = formatError(null);
    expect(result).toBe('Wystąpił błąd: Coś poszło nie tak. Spróbuj ponownie.');
  });
});

describe('isNetworkError', () => {
  it('should return true for auth/network-request-failed', () => {
    const error = { code: 'auth/network-request-failed', message: 'Network error' };
    Object.setPrototypeOf(error, Error.prototype);
    
    expect(isNetworkError(error)).toBe(true);
  });

  it('should return true for network-error code', () => {
    const error = { code: 'network-error', message: 'Network error' };
    Object.setPrototypeOf(error, Error.prototype);
    
    expect(isNetworkError(error)).toBe(true);
  });

  it('should return true for error message containing "network"', () => {
    const error = new Error('Network request failed');
    
    expect(isNetworkError(error)).toBe(true);
  });

  it('should return true for error message containing "connection"', () => {
    const error = new Error('No connection available');
    
    expect(isNetworkError(error)).toBe(true);
  });

  it('should return false for non-network error', () => {
    const error = new Error('Some other error');
    
    expect(isNetworkError(error)).toBe(false);
  });

  it('should return false for non-Error objects', () => {
    expect(isNetworkError('network')).toBe(false);
    expect(isNetworkError(null)).toBe(false);
  });
});

describe('isAuthError', () => {
  it('should return true for auth/ prefixed errors', () => {
    const error = { code: 'auth/user-not-found', message: 'User not found' };
    Object.setPrototypeOf(error, Error.prototype);
    
    expect(isAuthError(error)).toBe(true);
  });

  it('should return true for unauthenticated error', () => {
    const error = { code: 'unauthenticated', message: 'Unauthenticated' };
    Object.setPrototypeOf(error, Error.prototype);
    
    expect(isAuthError(error)).toBe(true);
  });

  it('should return false for non-auth error', () => {
    const error = { code: 'permission-denied', message: 'Permission denied' };
    Object.setPrototypeOf(error, Error.prototype);
    
    expect(isAuthError(error)).toBe(false);
  });

  it('should return false for non-Error objects', () => {
    expect(isAuthError('auth/user-not-found')).toBe(false);
    expect(isAuthError(null)).toBe(false);
  });
});

describe('isPermissionError', () => {
  it('should return true for permission-denied code', () => {
    const error = { code: 'permission-denied', message: 'Permission denied' };
    Object.setPrototypeOf(error, Error.prototype);
    
    expect(isPermissionError(error)).toBe(true);
  });

  it('should return true for error message containing "permission"', () => {
    const error = new Error('You do not have permission');
    
    expect(isPermissionError(error)).toBe(true);
  });

  it('should return true for error message containing "premium"', () => {
    const error = new Error('This requires premium subscription');
    
    expect(isPermissionError(error)).toBe(true);
  });

  it('should return true for error message containing "unauthorized"', () => {
    const error = new Error('Unauthorized access');
    
    expect(isPermissionError(error)).toBe(true);
  });

  it('should return false for non-permission error', () => {
    const error = new Error('Some other error');
    
    expect(isPermissionError(error)).toBe(false);
  });

  it('should return false for non-Error objects', () => {
    expect(isPermissionError('permission-denied')).toBe(false);
    expect(isPermissionError(null)).toBe(false);
  });
});

