import { baseUrl } from './api';

/**
 * Best Sellers API Adapter
 * Handles API calls for best selling products
 * Endpoint: /api/v1/products/best-sellers
 */

// API endpoint constant for best sellers
export const BEST_SELLERS_ENDPOINT = `${baseUrl}api/v1/products/best-sellers`;

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 10000;

export const bestSellersApi = {
  /**
   * Get best selling products
   * @returns {Promise<Array>} Array of best selling products
   * @throws {Error} If the API request fails
   */
  getBestSellers: async (retries = 2) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
      
      const response = await fetch(BEST_SELLERS_ENDPOINT, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          `Failed to fetch best sellers: ${response.statusText}`
        );
      }

      const data = await response.json();
      
      // Validate response structure
      if (!data || (typeof data !== 'object')) {
        throw new Error('Invalid response format from best sellers API');
      }
      
      return data;
    } catch (error) {
      // Retry logic for network errors
      if (retries > 0 && (error.name === 'AbortError' || error.message.includes('Network'))) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return bestSellersApi.getBestSellers(retries - 1);
      }
      
      // Re-throw with more context if it's not already an Error
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Network error: ${error.message || 'Unknown error'}`);
    }
  },
};

