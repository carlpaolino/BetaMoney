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

  console.log('useAuth: Hook created/recreated');

  console.log('useAuth: Current state:', state);

  // Track state changes
  useEffect(() => {
    console.log('useAuth: State changed:', state);
  }, [state]);

  useEffect(() => {
    console.log('useAuth: useEffect triggered');
    
    // Check for existing user in localStorage
    const checkAuthState = async () => {
      console.log('useAuth: checkAuthState started');
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        // Initialize demo data on first load
        LocalStorageService.initializeDemoData();
        
        const user = await AuthService.getCurrentUser();
        console.log('useAuth: getCurrentUser returned:', user);
        if (user) {
          dispatch({ type: 'SET_USER', payload: user });
          dispatch({ type: 'SET_AUTHENTICATED', payload: true });
          console.log('useAuth: User authenticated');
        } else {
          dispatch({ type: 'CLEAR_USER' });
          dispatch({ type: 'SET_AUTHENTICATED', payload: false });
          console.log('useAuth: No user found');
        }
      } catch (err) {
        console.error('useAuth: Error in checkAuthState:', err);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load user data' });
        dispatch({ type: 'CLEAR_USER' });
        dispatch({ type: 'SET_AUTHENTICATED', payload: false });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
        console.log('useAuth: checkAuthState completed, isLoading set to false');
      }
    };

    // Add a timeout to ensure isLoading gets set to false
    const timeoutId = setTimeout(() => {
      console.log('useAuth: Timeout reached, forcing isLoading to false');
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 3000); // 3 second timeout

    checkAuthState().finally(() => {
      clearTimeout(timeoutId);
    });
  }, []);

  const signInAsGuest = useCallback(async (email: string, name: string) => {
    console.log('useAuth: signInAsGuest called with:', { email, name });
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      console.log('useAuth: calling AuthService.signInAsGuest...');
      const user = await AuthService.signInAsGuest(email, name);
      console.log('useAuth: AuthService.signInAsGuest returned:', user);
      
      // Use state update functions to ensure changes are detected
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      console.log('useAuth: Authentication state updated - isAuthenticated set to true');
    } catch (err) {
      console.error('useAuth: Error in signInAsGuest:', err);
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Failed to sign in' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      console.log('useAuth: signInAsGuest completed, isLoading set to false');
    }
  }, []);

  const signInAsTreasurer = useCallback(async (email: string, password: string) => {
    console.log('useAuth: signInAsTreasurer called with:', { email, password });
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      console.log('useAuth: calling AuthService.signInAsTreasurer...');
      const user = await AuthService.signInAsTreasurer(email, password);
      console.log('useAuth: AuthService.signInAsTreasurer returned:', user);
      
      // Use state update functions to ensure changes are detected
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      console.log('useAuth: Authentication state updated - isAuthenticated set to true');
    } catch (err) {
      console.error('useAuth: Error in signInAsTreasurer:', err);
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Failed to sign in' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      console.log('useAuth: signInAsTreasurer completed, isLoading set to false');
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