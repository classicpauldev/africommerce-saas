import { baseUrl } from './api';

/**
 * Best Sellers API Adapter
 * Handles API calls for best selling products
 * Endpoint: /api/v1/products/best-sellers
 */
const BEST_SELLERS_ENDPOINT = `${baseUrl}api/v1/products/best-sellers`;

export const bestSellersApi = {
  /**
   * Get best selling products
   * @returns {Promise<Array>} Array of best selling products
   * @throws {Error} If the API request fails
   */
  getBestSellers: async () => {
    try {
      const response = await fetch(BEST_SELLERS_ENDPOINT, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          `Failed to fetch best sellers: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Re-throw with more context if it's not already an Error
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Network error: ${error.message || 'Unknown error'}`);
    }
  },
};

