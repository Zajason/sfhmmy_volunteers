import { workshopCheckIn } from '../api/AuthApi'; // Adjust the path as needed

/**
 * Handles the workshop check-in process for a user.
 *
 * @param {string} workshop_id - The ID of the workshop.
 * @param {string} user_id - The ID of the user.
 * @returns {Promise<Object>} A promise that resolves to the check-in response.
 * @throws {Error} If the check-in fails.
 */
const workshopCheck = async (workshop_id: string, user_id: string) => {
  try {
    const response = await workshopCheckIn(workshop_id, user_id);
    console.log('Check-in successful:', response);
    return response;
  } catch (error) {
    console.error('Error during workshop check-in:', error);
    throw error;
  }
};

export default workshopCheck;