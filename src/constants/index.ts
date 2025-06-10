// App Configuration
export const APP_NAME = 'BetaMoney';
export const APP_VERSION = '1.0.0';

// Beta Theta Pi Branding
export const BETA_COLORS = {
  NAVY: '#003366',
  CRIMSON: '#B31B1B',
  LIGHT_GRAY: '#f8f9fa',
  WHITE: '#ffffff'
} as const;

// Beta Theta Pi Committees
export const BETA_COMMITTEES = [
  'Risk',
  'Social',
  'House',
  'Brotherhood',
  'Rush',
  'Technology',
  'Pledge Ed',
  'External Relations',
  'Finance',
  'Conventions',
  'Athletics',
  'President',
  'Historian',
  'Table',
  'Ritual',
  'Gym'
] as const;

// Authentication
export const TREASURER_CREDENTIALS = {
  EMAIL: 'treasurer@betathetapi.com',
  PASSWORD: 'BetaMoney2024!'
} as const;

// File Upload Limits
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 5,
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
} as const;

// Status Messages
export const MESSAGES = {
  LOADING: 'Loading...',
  NO_REQUESTS: 'No requests found',
  UPLOAD_SUCCESS: 'Request submitted successfully!',
  UPLOAD_ERROR: 'Failed to submit request',
  STATUS_UPDATE_SUCCESS: 'Status updated successfully!',
  STATUS_UPDATE_ERROR: 'Failed to update status'
} as const;

// Date Formats
export const DATE_FORMATS = {
  SHORT: { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' } as const,
  LONG: { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' } as const
} as const; 