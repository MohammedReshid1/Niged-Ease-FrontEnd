/**
 * Utility functions for working with JWT tokens
 */

/**
 * Parse a JWT token and extract a specific claim value
 * 
 * @param token The JWT token string
 * @param claimName The name of the claim to extract
 * @returns The claim value or null if not found
 */
export function getClaimValue(token: string | null, claimName: string): any {
  if (!token) {
    return null;
  }
  
  try {
    // JWT tokens are in format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    // Decode the payload (middle part)
    const payload = JSON.parse(atob(parts[1]));
    return payload[claimName] || null;
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return null;
  }
}

/**
 * Check if a JWT token is expired
 * 
 * @param token The JWT token string
 * @returns True if the token is expired, false otherwise
 */
export function isTokenExpired(token: string | null): boolean {
  if (!token) {
    return true;
  }
  
  try {
    const exp = getClaimValue(token, 'exp');
    if (!exp) {
      return true;
    }
    
    // exp is in seconds, Date.now() is in milliseconds
    return Date.now() >= exp * 1000;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
} 