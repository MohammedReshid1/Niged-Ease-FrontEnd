/**
 * Utility functions for handling API errors
 */

/**
 * Extract an error message from an API error response
 * @param error The error object from API response
 * @returns A user-friendly error message
 */
export function extractErrorMessage(error: any): string {
  // Check for axios error response format
  if (error?.response?.data) {
    const responseData = error.response.data;
    
    // Check common error message formats
    if (typeof responseData === 'string') {
      return responseData;
    }
    
    if (responseData.message) {
      return responseData.message;
    }
    
    if (responseData.error) {
      return typeof responseData.error === 'string' 
        ? responseData.error 
        : JSON.stringify(responseData.error);
    }
    
    if (responseData.detail) {
      return responseData.detail;
    }
    
    // Handle validation errors (array of errors)
    if (Array.isArray(responseData.errors)) {
      return responseData.errors.map((err: any) => err.message || String(err)).join(', ');
    }
    
    // If there's a nested errors object with field names
    if (responseData.errors && typeof responseData.errors === 'object') {
      return Object.entries(responseData.errors)
        .map(([field, message]) => `${field}: ${message}`)
        .join(', ');
    }
    
    // Return stringified data if all else fails
    if (typeof responseData === 'object') {
      return JSON.stringify(responseData);
    }
  }
  
  // Handle network errors
  if (error?.message) {
    if (error.message === 'Network Error') {
      return 'Unable to connect to server. Please check your internet connection.';
    }
    return error.message;
  }
  
  // Default error message
  return 'An unexpected error occurred. Please try again later.';
}

/**
 * Format API errors for display
 * @param error The error object from API response
 * @returns An object with error message and details
 */
export function formatAPIError(error: any) {
  const message = extractErrorMessage(error);
  const statusCode = error?.response?.status;
  const errorCode = error?.code;
  
  return {
    message,
    statusCode,
    errorCode,
    isNetworkError: error?.message === 'Network Error',
    isServerError: statusCode ? statusCode >= 500 : false,
    isClientError: statusCode ? statusCode >= 400 && statusCode < 500 : false,
    isAuthError: statusCode === 401 || statusCode === 403,
  };
} 