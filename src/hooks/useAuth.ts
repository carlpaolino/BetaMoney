import { useReducer, useEffect, useCallback } from 'react';
import { AuthService } from '../services/authService';
import { LocalStorageService } from '../services/localStorageService';
import { User } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

type AuthAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_AUTHENTICATED'; payload: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_USER':
      return { ...state, currentUser: action.payload, isAuthenticated: true };
    case 'CLEAR_USER':
      return { ...state, currentUser: null, isAuthenticated: false };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    default:
      return state;
  }
};

const initialState: AuthState = {
  isAuthenticated: false,
  currentUser: null,
  isLoading: true,
  error: null
};

export const useAuth = () => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Track state changes
  useEffect(() => {
  }, [state]);

  useEffect(() => {
    // Check for existing user in localStorage
    const checkAuthState = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        // Initialize demo data on first load
        LocalStorageService.initializeDemoData();
        
        const user = await AuthService.getCurrentUser();
        if (user) {
          dispatch({ type: 'SET_USER', payload: user });
          dispatch({ type: 'SET_AUTHENTICATED', payload: true });
        } else {
          dispatch({ type: 'CLEAR_USER' });
          dispatch({ type: 'SET_AUTHENTICATED', payload: false });
        }
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load user data' });
        dispatch({ type: 'CLEAR_USER' });
        dispatch({ type: 'SET_AUTHENTICATED', payload: false });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    // Add a timeout to ensure isLoading gets set to false
    const timeoutId = setTimeout(() => {
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 3000); // 3 second timeout

    checkAuthState().finally(() => {
      clearTimeout(timeoutId);
    });
  }, []);

  const signInAsGuest = useCallback(async (email: string, name: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const user = await AuthService.signInAsGuest(email, name);
      
      // Use state update functions to ensure changes are detected
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Failed to sign in' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const signInAsTreasurer = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const user = await AuthService.signInAsTreasurer(email, password);
      
      // Use state update functions to ensure changes are detected
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Failed to sign in' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const signOut = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      await AuthService.signOutUser();
      dispatch({ type: 'CLEAR_USER' });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Failed to sign out' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return {
    isAuthenticated: state.isAuthenticated,
    currentUser: state.currentUser,
    isLoading: state.isLoading,
    error: state.error,
    signInAsGuest,
    signInAsTreasurer,
    signOut
  };
}; 