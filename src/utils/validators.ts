import { FILE_UPLOAD } from '../constants';

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate amount (positive number)
 */
export const isValidAmount = (amount: string | number): boolean => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(numAmount) && numAmount > 0;
};

/**
 * Validate file upload
 */
export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file size
  if (file.size > FILE_UPLOAD.MAX_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File size must be less than ${FILE_UPLOAD.MAX_SIZE_MB}MB`
    };
  }

  // Check file type
  if (!FILE_UPLOAD.ALLOWED_TYPES.includes(file.type as any)) {
    return {
      isValid: false,
      error: 'Please select a valid image file (JPEG, PNG, WebP)'
    };
  }

  return { isValid: true };
};

/**
 * Validate required string field
 */
export const isValidRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validate form data for new request
 */
export const validateNewRequest = (data: {
  amount: string;
  description: string;
  category: string;
  file: File | null;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!isValidRequired(data.description)) {
    errors.push('Description is required');
  }

  if (!isValidAmount(data.amount)) {
    errors.push('Please enter a valid amount');
  }

  if (!isValidRequired(data.category)) {
    errors.push('Committee is required');
  }

  if (!data.file) {
    errors.push('Please upload a receipt image');
  } else {
    const fileValidation = validateFile(data.file);
    if (!fileValidation.isValid && fileValidation.error) {
      errors.push(fileValidation.error);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}; 