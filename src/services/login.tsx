import React from 'react'
import { loginUser } from '../api/AuthApi'; // Adjust the path as needed

import LoginResponse  from '../types/login'; // Adjust the path as needed

/**
 * Handles the login process by calling the Auth API.
 *
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<{ token: string }>} A promise that resolves to the login token.
    const { token } = await loginUser(loginData) as LoginResponse;
 */
const login = async (email: string, password: string) => {
  try {
    const loginData = { email, password };
    const { token } = await loginUser(loginData) as LoginResponse;

    // Store the token in localStorage
    localStorage.setItem('authToken', token);

    return { token };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export default login;