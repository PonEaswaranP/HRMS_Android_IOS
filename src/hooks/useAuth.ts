import { useState, useEffect, useCallback } from 'react';
import { tokenStorage } from '../utils/tokenStorage';

// Define the shape of the authentication state
interface AuthState {
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * Custom hook to manage authentication state and listen for changes.
 * This hook is the single source of truth for the user's auth status.
 */
export const useAuth = (): AuthState => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateAuthState = useCallback(async () => {
    try {
      const token = await tokenStorage.getAccessToken();
      setAccessToken(token);
    } catch (e) {
      console.error('Failed to fetch auth token for state update', e);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial check when the hook mounts
    updateAuthState();

    // Subscribe to token changes
    const unsubscribe = tokenStorage.subscribe(updateAuthState);

    // Unsubscribe on cleanup
    return () => {
      unsubscribe();
    };
  }, [updateAuthState]);

  return {
    accessToken,
    isLoading,
    isAuthenticated: !!accessToken,
  };
};
