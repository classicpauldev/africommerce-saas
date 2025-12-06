/**
 * Unit tests for best sellers API adapter
 * Tests API endpoint calls and error handling
 */

import { bestSellersApi, BEST_SELLERS_ENDPOINT } from '../bestSellersApi';

// Mock fetch globally
global.fetch = jest.fn();

describe('bestSellersApi', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('should fetch best sellers successfully', async () => {
    const mockData = { data: [{ id: 1, name: 'Product 1' }] };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await bestSellersApi.getBestSellers();
    expect(fetch).toHaveBeenCalledWith(
      BEST_SELLERS_ENDPOINT,
      expect.objectContaining({
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
    );
    expect(result).toEqual(mockData);
  });

  test('should handle API errors', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
      json: async () => ({ message: 'Products not found' }),
    });

    await expect(bestSellersApi.getBestSellers()).rejects.toThrow('Products not found');
  });

  test('should handle network errors', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(bestSellersApi.getBestSellers()).rejects.toThrow();
  });
});

