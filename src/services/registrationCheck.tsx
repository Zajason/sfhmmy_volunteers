import React from 'react'
import { userRegistration } from '../api/AuthApi'; // Adjust the path as needed

/**
 * Checks and registers a user based on their UUID.
 *
 * @param {string} uuid - The UUID acquired from a QR code.
 * @returns {Promise<Object>} A promise that resolves to the registration response.
 * @throws {Error} If the registration fails.
 */
const registrationCheck = async (uuid: string) => {
  try {
    const response = await userRegistration(uuid);
    console.log('Registration successful:', response);
    return response;
  } catch (error) {
    console.error('Error during registration check:', error);
    throw error;
  }
};

export default registrationCheck;