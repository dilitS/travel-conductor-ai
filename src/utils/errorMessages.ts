/**
 * Error message mapping utility
 * Maps Firebase/API error codes to user-friendly Polish messages
 */

export interface ErrorMessage {
  title: string;
  message: string;
}

/**
 * Firebase Auth error codes
 */
const AUTH_ERRORS: Record<string, ErrorMessage> = {
  'auth/user-not-found': {
    title: 'Nie znaleziono użytkownika',
    message: 'Nie znaleziono konta z tym adresem e-mail.',
  },
  'auth/wrong-password': {
    title: 'Nieprawidłowe hasło',
    message: 'Podane hasło jest nieprawidłowe.',
  },
  'auth/email-already-in-use': {
    title: 'E-mail już używany',
    message: 'Konto z tym adresem e-mail już istnieje.',
  },
  'auth/weak-password': {
    title: 'Słabe hasło',
    message: 'Hasło musi mieć co najmniej 6 znaków.',
  },
  'auth/invalid-email': {
    title: 'Nieprawidłowy e-mail',
    message: 'Podany adres e-mail jest nieprawidłowy.',
  },
  'auth/operation-not-allowed': {
    title: 'Operacja niedozwolona',
    message: 'Ta metoda logowania jest wyłączona.',
  },
  'auth/account-exists-with-different-credential': {
    title: 'Konto już istnieje',
    message: 'Konto z tym e-mailem już istnieje z inną metodą logowania.',
  },
  'auth/network-request-failed': {
    title: 'Błąd sieci',
    message: 'Sprawdź połączenie z internetem i spróbuj ponownie.',
  },
  'auth/too-many-requests': {
    title: 'Zbyt wiele prób',
    message: 'Zbyt wiele nieudanych prób logowania. Spróbuj ponownie później.',
  },
  'auth/user-disabled': {
    title: 'Konto zablokowane',
    message: 'To konto zostało zablokowane. Skontaktuj się z pomocą techniczną.',
  },
  'auth/requires-recent-login': {
    title: 'Wymagane ponowne logowanie',
    message: 'Ta operacja wymaga ponownego zalogowania się.',
  },
  'auth/popup-closed-by-user': {
    title: 'Anulowano logowanie',
    message: 'Okno logowania zostało zamknięte przed zakończeniem.',
  },
  'auth/cancelled-popup-request': {
    title: 'Anulowano logowanie',
    message: 'Anulowano żądanie logowania.',
  },
};

/**
 * Cloud Functions error codes
 */
const FUNCTIONS_ERRORS: Record<string, ErrorMessage> = {
  'unauthenticated': {
    title: 'Brak autoryzacji',
    message: 'Musisz być zalogowany, aby wykonać tę operację.',
  },
  'permission-denied': {
    title: 'Brak uprawnień',
    message: 'Nie masz uprawnień do wykonania tej operacji.',
  },
  'not-found': {
    title: 'Nie znaleziono',
    message: 'Żądany zasób nie został znaleziony.',
  },
  'already-exists': {
    title: 'Już istnieje',
    message: 'Zasób o tej nazwie już istnieje.',
  },
  'resource-exhausted': {
    title: 'Limit wyczerpany',
    message: 'Osiągnięto limit zapytań. Spróbuj ponownie później.',
  },
  'failed-precondition': {
    title: 'Nieprawidłowy stan',
    message: 'Operacja nie może być wykonana w obecnym stanie.',
  },
  'aborted': {
    title: 'Przerwano',
    message: 'Operacja została przerwana. Spróbuj ponownie.',
  },
  'out-of-range': {
    title: 'Poza zakresem',
    message: 'Wartość jest poza dozwolonym zakresem.',
  },
  'unimplemented': {
    title: 'Niezaimplementowane',
    message: 'Ta funkcja nie jest jeszcze dostępna.',
  },
  'internal': {
    title: 'Błąd serwera',
    message: 'Wystąpił wewnętrzny błąd serwera. Spróbuj ponownie później.',
  },
  'unavailable': {
    title: 'Usługa niedostępna',
    message: 'Usługa jest tymczasowo niedostępna. Spróbuj ponownie później.',
  },
  'data-loss': {
    title: 'Utrata danych',
    message: 'Wykryto utratę lub uszkodzenie danych.',
  },
  'invalid-argument': {
    title: 'Nieprawidłowe dane',
    message: 'Podane dane są nieprawidłowe.',
  },
  'deadline-exceeded': {
    title: 'Przekroczono limit czasu',
    message: 'Operacja trwała zbyt długo. Spróbuj ponownie.',
  },
  'cancelled': {
    title: 'Anulowano',
    message: 'Operacja została anulowana.',
  },
};

/**
 * Network error codes
 */
const NETWORK_ERRORS: Record<string, ErrorMessage> = {
  'network-error': {
    title: 'Błąd sieci',
    message: 'Sprawdź połączenie z internetem i spróbuj ponownie.',
  },
  'timeout': {
    title: 'Przekroczono limit czasu',
    message: 'Żądanie trwało zbyt długo. Spróbuj ponownie.',
  },
  'server-error': {
    title: 'Błąd serwera',
    message: 'Serwer napotkał problem. Spróbuj ponownie później.',
  },
};

/**
 * Default error message
 */
const DEFAULT_ERROR: ErrorMessage = {
  title: 'Wystąpił błąd',
  message: 'Coś poszło nie tak. Spróbuj ponownie.',
};

/**
 * Get user-friendly error message from error code
 * @param error - Error object or error code string
 * @returns ErrorMessage with title and message
 */
export function getErrorMessage(error: unknown): ErrorMessage {
  if (!error) {
    return DEFAULT_ERROR;
  }

  // Handle Error objects
  if (error instanceof Error) {
    const errorCode = (error as { code?: string }).code;
    
    if (errorCode) {
      // Try to find in auth errors
      if (errorCode.startsWith('auth/')) {
        return AUTH_ERRORS[errorCode] || DEFAULT_ERROR;
      }
      
      // Try to find in functions errors
      if (FUNCTIONS_ERRORS[errorCode]) {
        return FUNCTIONS_ERRORS[errorCode];
      }
      
      // Try to find in network errors
      if (NETWORK_ERRORS[errorCode]) {
        return NETWORK_ERRORS[errorCode];
      }
    }
    
    // Check for specific error messages
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('internet')) {
      return NETWORK_ERRORS['network-error'];
    }
    
    if (message.includes('timeout') || message.includes('timed out')) {
      return NETWORK_ERRORS['timeout'];
    }
    
    if (message.includes('premium') || message.includes('subscription')) {
      return {
        title: 'Wymagane Premium',
        message: error.message,
      };
    }
    
    // Return error message as is if it's in Polish (contains Polish characters)
    if (/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(error.message)) {
      return {
        title: 'Błąd',
        message: error.message,
      };
    }
  }

  // Handle string error codes
  if (typeof error === 'string') {
    if (AUTH_ERRORS[error]) {
      return AUTH_ERRORS[error];
    }
    if (FUNCTIONS_ERRORS[error]) {
      return FUNCTIONS_ERRORS[error];
    }
    if (NETWORK_ERRORS[error]) {
      return NETWORK_ERRORS[error];
    }
  }

  return DEFAULT_ERROR;
}

/**
 * Format error for display in UI
 * @param error - Error object or error code string
 * @returns Formatted error string
 */
export function formatError(error: unknown): string {
  const { title, message } = getErrorMessage(error);
  return `${title}: ${message}`;
}

/**
 * Check if error is a network error
 * @param error - Error object
 * @returns true if network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    const errorCode = (error as { code?: string }).code;
    const message = error.message.toLowerCase();
    
    return (
      errorCode === 'auth/network-request-failed' ||
      errorCode === 'network-error' ||
      message.includes('network') ||
      message.includes('internet') ||
      message.includes('connection')
    );
  }
  return false;
}

/**
 * Check if error is an authentication error
 * @param error - Error object
 * @returns true if auth error
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof Error) {
    const errorCode = (error as { code?: string }).code;
    return errorCode?.startsWith('auth/') || errorCode === 'unauthenticated';
  }
  return false;
}

/**
 * Check if error is a permission error
 * @param error - Error object
 * @returns true if permission error
 */
export function isPermissionError(error: unknown): boolean {
  if (error instanceof Error) {
    const errorCode = (error as { code?: string }).code;
    const message = error.message.toLowerCase();
    
    return (
      errorCode === 'permission-denied' ||
      message.includes('permission') ||
      message.includes('unauthorized') ||
      message.includes('premium')
    );
  }
  return false;
}

