import { supabase } from './supabaseClient';
import { ReimbursementRequest, RequestStatus } from '../types';

export class SupabaseService {
  static async getAllRequests(): Promise<ReimbursementRequest[]> {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  static async getRequestsForUser(userId: string): Promise<ReimbursementRequest[]> {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  static async saveRequest(request: ReimbursementRequest): Promise<void> {
    const { error } = await supabase.from('requests').insert([request]);
    if (error) throw error;
  }

  static async updateRequestStatus(requestId: string, status: RequestStatus): Promise<void> {
    const { error } = await supabase
      .from('requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', requestId);
    if (error) throw error;
  }
} 