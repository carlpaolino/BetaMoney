export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

export enum UserRole {
  GUEST = 'guest',
  OWNER = 'owner'
}

export interface ReimbursementRequest {
  id: string;
  userId: string;
  amount: number;
  description: string;
  category?: string;
  status: RequestStatus;
  imageURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved'
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
} 