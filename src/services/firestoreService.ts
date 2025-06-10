import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { ReimbursementRequest, RequestStatus } from '../types';

export class FirestoreService {
  // Save request to Firestore
  static async saveRequest(request: ReimbursementRequest): Promise<void> {
    try {
      await setDoc(doc(db, 'requests', request.id), {
        userId: request.userId,
        amount: request.amount,
        description: request.description,
        category: request.category || '',
        status: request.status,
        imageURL: request.imageURL || '',
        createdAt: request.createdAt,
        updatedAt: request.updatedAt
      });
    } catch (error) {
      throw new Error(`Failed to save request: ${error}`);
    }
  }
  
  // Update request status
  static async updateRequestStatus(requestId: string, status: RequestStatus): Promise<void> {
    try {
      await updateDoc(doc(db, 'requests', requestId), {
        status,
        updatedAt: new Date()
      });
    } catch (error) {
      throw new Error(`Failed to update request status: ${error}`);
    }
  }
  
  // Get requests for a specific user
  static async getRequestsForUser(userId: string): Promise<ReimbursementRequest[]> {
    try {
      const q = query(
        collection(db, 'requests'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => this.parseRequest(doc.id, doc.data()));
    } catch (error) {
      throw new Error(`Failed to get user requests: ${error}`);
    }
  }
  
  // Get all requests (for treasurers)
  static async getAllRequests(): Promise<ReimbursementRequest[]> {
    try {
      const q = query(
        collection(db, 'requests'),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => this.parseRequest(doc.id, doc.data()));
    } catch (error) {
      throw new Error(`Failed to get all requests: ${error}`);
    }
  }
  
  // Real-time listener for requests
  static subscribeToRequests(
    callback: (requests: ReimbursementRequest[]) => void,
    userId?: string
  ): () => void {
    const q = userId 
      ? query(
          collection(db, 'requests'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        )
      : query(
          collection(db, 'requests'),
          orderBy('createdAt', 'desc')
        );
    
    return onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => this.parseRequest(doc.id, doc.data()));
      callback(requests);
    });
  }
  
  // Upload image to Firebase Storage
  static async uploadImage(file: File, requestId: string): Promise<string> {
    try {
      const storageRef = ref(storage, `receipts/${requestId}.jpg`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      throw new Error(`Failed to upload image: ${error}`);
    }
  }
  
  // Parse Firestore document to ReimbursementRequest
  private static parseRequest(id: string, data: any): ReimbursementRequest {
    return {
      id,
      userId: data.userId,
      amount: data.amount,
      description: data.description,
      category: data.category || undefined,
      status: data.status,
      imageURL: data.imageURL || undefined,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt
    };
  }
  
  // Generate unique request ID
  static generateRequestId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
} 