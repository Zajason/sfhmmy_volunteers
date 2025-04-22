import axios from 'axios';
import { toast } from 'react-toastify'; // Make sure this is imported at the top

const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://127.0.0.1:8000/api'  // Local development server
  : '/api';     // Production server

// Create an axios instance with consistent config
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    
  },
  withCredentials: true // Important: send cookies when making requests across origins
});

// Set up axios interceptor to add auth token to all requests
api.interceptors.request.use(
  config => {
    // First try to get token from localStorage (for verified users)
    let token = localStorage.getItem('authToken');
    
    // For verification-related endpoints, try to use the pendingAuthToken
    // Check if window is defined (client-side only) before accessing location
    const isVerificationRelatedEndpoint = config.url && 
      (config.url.includes('email/verification') || 
       config.url.includes('verification-notification'));
    
    const isVerificationPage = typeof window !== 'undefined' && 
      window.location && 
      window.location.pathname && 
      window.location.pathname.includes('emailVerification');
    
    if (!token && (isVerificationRelatedEndpoint || isVerificationPage)) {
      token = sessionStorage.getItem('pendingAuthToken');
    }
    
    if (token) {
      // Set the Authorization header with the token
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API response error:', error);
    
    const isCheckingVerification = error.config.url.includes('/email/verification-status');
    const isResendingVerification = error.config.url.includes('/email/verification-notification');
    const isLoginRequest = error.config.url.includes('/login');
    
    // Handle email verification required (403)
    if (error.response && 
        error.response.status === 403 && 
        error.response.data?.message?.toLowerCase().includes('not verified') &&
        !isCheckingVerification &&
        !isResendingVerification &&
        !isLoginRequest) { // Skip for login requests - we handle this separately
      
      console.log('Email verification required. Redirecting to verification page.');
      
      if (typeof window !== 'undefined' && 
          !window.location.pathname.includes('emailVerification') &&
          !window.location.pathname.includes('signIn')) {
        
        sessionStorage.setItem('redirectAfterVerification', window.location.pathname);
        
        
        window.location.href = '/emailVerification';
      }
      
      return Promise.reject({
        message: 'Email verification required.',
        originalError: error,
        isVerificationError: true
      });
    }
    
    // Rest of the interceptor remains the same
    if (error.response && error.response.status === 401) {
      console.log('Authentication error. Token may be invalid or expired.');
      
      if (typeof window !== 'undefined' && 
          !window.location.pathname.includes('signIn')) {
        
        localStorage.removeItem('authToken');
        
        if (typeof toast !== 'undefined') {
          toast.error('Your session has expired. Please sign in again.');
        }
        
        setTimeout(() => {
          window.location.href = '/signIn';
        }, 1500);
      }
    }
    
    if (error.message === 'Network Error') {
      console.error('Network error detected:', error);
    }
    
    return Promise.reject(error);
  }
);


// Functions to handle API requests

/**
 * Logs in a user by sending their login data to the server and retrieves an authentication token.
 *
 * @param {Object} loginData - The login data containing user credentials (e.g., username and password).
 * @returns {Promise<Object>} A promise that resolves to an object containing the authentication token.
 * @throws {Error} If the login fails or no token is received from the server.
 */

export const loginUser = async (loginData) => {
    try {
      const response = await api.post('/volunteer/login', loginData);
      console.log("response", response)
      console.log('Login successful:', response.data);
      
      // Extract token from response
      const token = response.data.token || response.data.access_token;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      // Instead of always storing in localStorage, return token and user info
      return { 
        token
      };
    } catch (error) {
      console.error('Error during login:', error.response ? error.response.data : error.message);
      throw error;
    }
  };


  
/**
 * @title Fetch Workshop Data
 * @description Fetches a list of workshops from the API endpoint.
 * @async
 * @function
 * @returns {Promise<Object>} A promise that resolves to the workshop data.
 * @throws {Error} Throws an error if the API request fails.
 */

  export const workshopFetch = async () => {
    try {
      const response = await api.get('/listworkshops');
      console.log('Workshop data fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching workshop data:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

  export const workshopCheckIn = async (workshop_id, user_id) => {
    try {
      const response = await api.post('/volunteer/checkin', { workshop_id, user_id });
      console.log('Check-in successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error during check-in:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

  export const userRegistration = async (user_id) => {
    try {
      const response = await api.post('/volunteer/register', { user_id });
      console.log('User registration successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error during user registration:', error.response ? error.response.data : error.message);
      throw error;
    }
  }