import { User, UserRole } from '../types';
import { TREASURER_CREDENTIALS } from '../constants';
import { LocalStorageService } from './localStorageService';

export class AuthService {
  // Guest sign-in (simplified - just creates a local user)
  static async signInAsGuest(email: string, name: string): Promise<User> {
    try {
      // Create guest user profile
      const user: User = {
        id: LocalStorageService.generateId(),
        email,
        name,
        role: UserRole.GUEST,
        createdAt: new Date()
      };
      
      // Save to localStorage
      LocalStorageService.saveCurrentUser(user);
      
      return user;
    } catch (error) {
      throw new Error(`Failed to sign in as guest: ${error}`);
    }
  }
  
  // Owner/Treasurer sign-in
  static async signInAsTreasurer(email: string, password: string): Promise<User> {
    try {
      // Check hard-coded credentials
      if (email !== TREASURER_CREDENTIALS.EMAIL || password !== TREASURER_CREDENTIALS.PASSWORD) {
        throw new Error('Invalid treasurer credentials');
      }
      
      // Create treasurer user profile
      const user: User = {
        id: 'treasurer-001', // Fixed ID for treasurer
        email,
        name: 'Treasurer',
        role: UserRole.OWNER,
        createdAt: new Date()
      };
      
      // Save to localStorage
      LocalStorageService.saveCurrentUser(user);
      
      return user;
    } catch (error) {
      throw new Error(`Failed to sign in as treasurer: ${error}`);
    }
  }
  
  // Sign out
  static async signOutUser(): Promise<void> {
    try {
      LocalStorageService.clearCurrentUser();
    } catch (error) {
      throw new Error(`Failed to sign out: ${error}`);
    }
  }
  
  // Get current user from localStorage
  static async getCurrentUser(): Promise<User | null> {
    try {
      return LocalStorageService.getCurrentUser();
    } catch (error) {
      throw new Error(`Failed to get current user: ${error}`);
    }
  }
  
  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return LocalStorageService.getCurrentUser() !== null;
  }
} 