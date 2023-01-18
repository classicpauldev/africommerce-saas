import { baseUrl } from './api';

const BEST_SELLERS_ENDPOINT = `${baseUrl}api/v1/products/best-sellers`;

export const bestSellersApi = {
  // Get best selling products
  getBestSellers: async () => {
    const response = await fetch(BEST_SELLERS_ENDPOINT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch best sellers: ${response.statusText}`);
    }

    return await response.json();
  },
};

