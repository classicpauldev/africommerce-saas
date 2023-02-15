import { baseUrl } from './api';

const USERS_ENDPOINT = `${baseUrl}api/v1/users`;

export const userApi = {
  // Get all users (for sellers dashboard)
  getAllUsers: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(USERS_ENDPOINT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    return await response.json();
  },

  // Get a specific user by ID
  getUserById: async (userId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${USERS_ENDPOINT}/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    return await response.json();
  },
};

