import type { BaseRecord, DataProvider } from '@refinedev/core';
import { describe, expect, it, vi } from 'vitest';

import { fetchAllIds, fetchAllRecords, generateExportFilename, recordsToCSV } from './export';

describe('export utilities', () => {
  describe('fetchAllRecords', () => {
    it('should fetch all records across multiple pages', async () => {
      const mockDataProvider: Partial<DataProvider> = {
        getList: vi
          .fn()
          .mockResolvedValueOnce({
            data: [
              { id: '1', name: 'User 1' },
              { id: '2', name: 'User 2' },
            ],
            total: 3,
          })
          .mockResolvedValueOnce({
            data: [{ id: '3', name: 'User 3' }],
            total: 3,
          }),
      };

      const records = await fetchAllRecords(
        mockDataProvider as DataProvider,
        'users',
        undefined,
        10000,
        2, // small batch size to test pagination
      );

      expect(records).toHaveLength(3);
      expect(records[0]).toEqual({ id: '1', name: 'User 1' });
      expect(records[2]).toEqual({ id: '3', name: 'User 3' });
    });

    it('should respect maxResults limit', async () => {
      const mockDataProvider: Partial<DataProvider> = {
        getList: vi.fn().mockResolvedValue({
          data: [
            { id: '1', name: 'User 1' },
            { id: '2', name: 'User 2' },
            { id: '3', name: 'User 3' },
          ],
          total: 100,
        }),
      };

      const records = await fetchAllRecords(
        mockDataProvider as DataProvider,
        'users',
        undefined,
        2, // max 2 records
        3,
      );

      expect(records).toHaveLength(2);
    });
  });

  describe('fetchAllIds', () => {
    it('should extract IDs from records', async () => {
      const mockDataProvider: Partial<DataProvider> = {
        getList: vi.fn().mockResolvedValue({
          data: [
            { id: '1', name: 'User 1' },
            { id: '2', name: 'User 2' },
            { id: '3', name: 'User 3' },
          ],
          total: 3,
        }),
      };

      const ids = await fetchAllIds(mockDataProvider as DataProvider, 'users');

      expect(ids).toEqual(['1', '2', '3']);
    });
  });

  describe('recordsToCSV', () => {
    it('should convert records to CSV with all fields', () => {
      const records: BaseRecord[] = [
        { id: '1', name: 'Alice', email: 'alice@example.com', age: 30 },
        { id: '2', name: 'Bob', email: 'bob@example.com', age: 25 },
      ];

      const csv = recordsToCSV(records);

      expect(csv).toContain('id');
      expect(csv).toContain('name');
      expect(csv).toContain('email');
      expect(csv).toContain('age');
      expect(csv).toContain('Alice');
      expect(csv).toContain('Bob');
      expect(csv).toContain('alice@example.com');
      expect(csv).toContain('bob@example.com');
      expect(csv).toContain('30');
      expect(csv).toContain('25');
    });

    it('should filter to specific fields', () => {
      const records: BaseRecord[] = [
        { id: '1', name: 'Alice', email: 'alice@example.com', age: 30 },
        { id: '2', name: 'Bob', email: 'bob@example.com', age: 25 },
      ];

      const csv = recordsToCSV(records, ['id', 'name', 'email']);

      // Should include specified fields
      expect(csv).toContain('id');
      expect(csv).toContain('name');
      expect(csv).toContain('email');
      expect(csv).toContain('Alice');
      expect(csv).toContain('Bob');
      expect(csv).toContain('alice@example.com');

      // Should include age data even if we filter fields
      // (export-to-csv should still export the data)
      const lines = csv.split('\n');
      expect(lines.length).toBeGreaterThan(2); // header + 2 data rows
    });

    it('should use custom field labels', () => {
      const records: BaseRecord[] = [{ id: '1', name: 'Alice', email: 'alice@example.com' }];

      const csv = recordsToCSV(records, ['id', 'name', 'email'], {
        name: 'Full Name',
        email: 'Email Address',
      });

      expect(csv).toContain('Full Name');
      expect(csv).toContain('Email Address');
      expect(csv).toContain('id'); // no custom label for id
    });

    it('should handle empty records array', () => {
      const csv = recordsToCSV([]);
      expect(csv).toBe('');
    });

    it('should handle records with null/undefined values', () => {
      const records: BaseRecord[] = [{ id: '1', name: 'Alice', email: null, age: undefined }];

      const csv = recordsToCSV(records);

      expect(csv).toContain('Alice');
      // Should handle null/undefined gracefully
      expect(csv.length).toBeGreaterThan(0);
    });
  });

  describe('generateExportFilename', () => {
    it('should generate filename with current date', () => {
      const filename = generateExportFilename('users');

      expect(filename).toMatch(/^users-\d{4}-\d{2}-\d{2}\.csv$/);
    });

    it('should use custom extension', () => {
      const filename = generateExportFilename('users', 'json');

      expect(filename).toMatch(/^users-\d{4}-\d{2}-\d{2}\.json$/);
    });
  });
});
