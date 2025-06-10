import { useState, useEffect } from 'react';
import { AuthService } from '../services/authService';
import { LocalStorageService } from '../services/localStorageService';
import { User } from '../types';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize demo data on first load
    LocalStorageService.initializeDemoData();
    
    // Check for existing user in localStorage
    const checkAuthState = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const user = await AuthService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        setError('Failed to load user data');
        setCurrentUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const signInAsGuest = async (email: string, name: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await AuthService.signInAsGuest(email, name);
      setCurrentUser(user);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const signInAsTreasurer = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await AuthService.signInAsTreasurer(email, password);
      setCurrentUser(user);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await AuthService.signOutUser();
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAuthenticated,
    currentUser,
    isLoading,
    error,
    signInAsGuest,
    signInAsTreasurer,
    signOut
  };
}; 