import { jwtDecode } from 'jwt-decode';

const AUTH_TOKEN_KEY = 'jwt_token';

/**
 * Saves the authentication token to local storage.
 * @param {string} token - The JWT to save.
 */
export const saveAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
};

/**
 * Retrieves the authentication token from local storage.
 * @returns {string|null} The JWT, or null if it doesn't exist.
 */
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
  return null;
};

/**
 * Removes the authentication token from local storage.
 */
export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

/**
 * Decodes the JWT to get user information.
 * @returns {object|null} The decoded user payload, or null if no token exists.
 */
export const getUserFromToken = () => {
  const token = getAuthToken();
  if (!token) {
    return null;
  }
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error('Failed to decode token:', error);
    // Optionally, remove the invalid token
    removeAuthToken();
    return null;
  }
};