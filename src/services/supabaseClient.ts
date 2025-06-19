import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://arhlwpycxbogsbzpceat.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyaGx3cHljeGJvZ3NienBjZWF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMDU0MTgsImV4cCI6MjA2NTg4MTQxOH0.wTBvlNXq_KL9avkbNmjDrhIJqdB5tWN2FUFmIWrX6vU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);