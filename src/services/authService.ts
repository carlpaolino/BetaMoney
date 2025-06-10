import { 
  signInWithEmailAndPassword, 
  signInAnonymously, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User, UserRole } from '../types';
import { TREASURER_CREDENTIALS } from '../constants';

export class AuthService {
  // Guest sign-in (simplified - in production would use email link)
  static async signInAsGuest(email: string, name: string): Promise<User> {
    try {
      // Create anonymous user for demo purposes
      const result = await signInAnonymously(auth);
      const firebaseUser = result.user;
      
      // Create guest user profile
      const user: User = {
        id: firebaseUser.uid,
        email,
        name,
        role: UserRole.GUEST,
        createdAt: new Date()
      };
      
      // Save to Firestore
      await this.saveUser(user);
      
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
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;
      
      // Create or get treasurer user profile
      const user: User = {
        id: firebaseUser.uid,
        email,
        name: 'Treasurer',
        role: UserRole.OWNER,
        createdAt: new Date()
      };
      
      // Save to Firestore
      await this.saveUser(user);
      
      return user;
    } catch (error) {
      throw new Error(`Failed to sign in as treasurer: ${error}`);
    }
  }
  
  // Sign out
  static async signOutUser(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(`Failed to sign out: ${error}`);
    }
  }
  
  // Get current user from Firestore
  static async getCurrentUser(firebaseUser: FirebaseUser): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          id: firebaseUser.uid,
          email: data.email,
          name: data.name,
          role: data.role,
          createdAt: data.createdAt.toDate()
        };
      }
      
      return null;
    } catch (error) {
      throw new Error(`Failed to get current user: ${error}`);
    }
  }
  
  // Save user to Firestore
  private static async saveUser(user: User): Promise<void> {
    try {
      await setDoc(doc(db, 'users', user.id), {
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      });
    } catch (error) {
      throw new Error(`Failed to save user: ${error}`);
    }
  }
} 