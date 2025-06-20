import { ReimbursementRequest, RequestStatus, User } from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'betamoney_current_user',
  REQUESTS: 'betamoney_requests',
  USERS: 'betamoney_users'
} as const;

export class LocalStorageService {
  // User Management
  static saveCurrentUser(user: User): void {
    console.log('LocalStorageService: saveCurrentUser called with:', user);
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      console.log('LocalStorageService: User saved successfully');
    } catch (error) {
      console.error('LocalStorageService: Error saving user:', error);
      throw error;
    }
  }

  static getCurrentUser(): User | null {
    console.log('LocalStorageService: getCurrentUser called');
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      console.log('LocalStorageService: Raw user data from localStorage:', userData);
      if (!userData) {
        console.log('LocalStorageService: No user data found');
        return null;
      }
      
      const user = JSON.parse(userData);
      // Convert date strings back to Date objects
      user.createdAt = new Date(user.createdAt);
      console.log('LocalStorageService: Parsed user object:', user);
      return user;
    } catch (error) {
      console.error('LocalStorageService: Error getting user:', error);
      return null;
    }
  }

  static clearCurrentUser(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  // Request Management
  static saveRequest(request: ReimbursementRequest): void {
    const requests = this.getAllRequests();
    const existingIndex = requests.findIndex(r => r.id === request.id);
    
    if (existingIndex >= 0) {
      requests[existingIndex] = request;
    } else {
      requests.push(request);
    }
    
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  }

  static getAllRequests(): ReimbursementRequest[] {
    console.log('LocalStorageService: getAllRequests called');
    try {
      const requestsData = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      console.log('LocalStorageService: Raw requests data from localStorage:', requestsData);
      if (!requestsData) {
        console.log('LocalStorageService: No requests data found, returning empty array');
        return [];
      }
      
      const requests = JSON.parse(requestsData);
      console.log('LocalStorageService: Parsed requests:', requests);
      // Convert date strings back to Date objects
      const requestsWithDates = requests.map((req: any) => ({
        ...req,
        createdAt: new Date(req.createdAt),
        updatedAt: new Date(req.updatedAt)
      }));
      console.log('LocalStorageService: Requests with dates:', requestsWithDates);
      return requestsWithDates;
    } catch (error) {
      console.error('LocalStorageService: Error in getAllRequests:', error);
      return [];
    }
  }

  static getRequestsForUser(userId: string): ReimbursementRequest[] {
    return this.getAllRequests().filter(req => req.userId === userId);
  }

  static updateRequestStatus(requestId: string, status: RequestStatus): void {
    const requests = this.getAllRequests();
    const requestIndex = requests.findIndex(r => r.id === requestId);
    
    if (requestIndex >= 0) {
      requests[requestIndex].status = status;
      requests[requestIndex].updatedAt = new Date();
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    }
  }

  // Generate unique ID
  static generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  // Image handling (convert to base64 for storage)
  static async saveImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  // Demo data initialization
  static initializeDemoData(): void {
    console.log('LocalStorageService: initializeDemoData called');
    // Only initialize if no data exists
    if (this.getAllRequests().length === 0) {
      console.log('LocalStorageService: No requests found, initializing demo data');
      const demoRequests: ReimbursementRequest[] = [
        {
          id: 'demo1',
          userId: 'demo-user-1',
          amount: 25.50,
          description: 'Chapter meeting refreshments',
          category: 'Food',
          status: RequestStatus.PENDING,
          createdAt: new Date(Date.now() - 86400000), // 1 day ago
          updatedAt: new Date(Date.now() - 86400000)
        },
        {
          id: 'demo2',
          userId: 'demo-user-2',
          amount: 150.00,
          description: 'Brotherhood event supplies',
          category: 'Supplies',
          status: RequestStatus.APPROVED,
          createdAt: new Date(Date.now() - 172800000), // 2 days ago
          updatedAt: new Date(Date.now() - 86400000)
        }
      ];

      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(demoRequests));
      console.log('LocalStorageService: Demo data initialized');
    } else {
      console.log('LocalStorageService: Requests already exist, skipping demo data initialization');
    }
  }

  // Clear all data (for testing)
  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
} 