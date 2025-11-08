import type { DataProvider, GetListParams } from '@refinedev/core';

export interface MockRecord {
  id: string;
  name: string;
  email?: string;
  is_active?: boolean;
  created_at?: string;
}

/**
 * Helper to create mock records for Storybook stories
 */
export const createMockRecords = (length: number): MockRecord[] =>
  Array.from({ length }, (_, i) => ({
    id: `${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    is_active: i % 3 !== 0, // Make some inactive
    created_at: new Date(2024, 0, i + 1).toISOString(),
  }));

/**
 * Create a mock data provider for Storybook stories
 *
 * @param totalRecords - Total number of records to mock (default: 100)
 * @returns Mock DataProvider compatible with Refine
 */
export const createMockDataProvider = (totalRecords: number = 100): DataProvider => {
  const allData = createMockRecords(totalRecords);

  return {
    getList: async ({ pagination }: GetListParams) => {
      const { currentPage = 1, pageSize = 10 } = pagination || {};
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;

      return {
        data: allData.slice(start, end),
        total: allData.length,
      };
    },
    getOne: async () => ({ data: {} }),
    create: async () => ({ data: {} }),
    update: async () => ({ data: {} }),
    deleteOne: async () => ({ data: {} }),
    getApiUrl: () => 'https://api.example.com',
  } as unknown as DataProvider;
};
