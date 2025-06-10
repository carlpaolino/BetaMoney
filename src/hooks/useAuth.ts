import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { AuthService } from '../services/authService';
import { User } from '../types';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      setError(null);

      if (firebaseUser) {
        try {
          const user = await AuthService.getCurrentUser(firebaseUser);
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
        }
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
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