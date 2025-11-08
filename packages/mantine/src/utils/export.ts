import type { BaseKey, BaseRecord, CrudFilters, DataProvider } from '@refinedev/core';
import { asString, generateCsv, mkConfig } from 'export-to-csv';

/**
 * Fetch all records across all pages using Refine's data provider
 * Respects current filters to only fetch records matching the filtered view
 *
 * @param dataProvider - Refine data provider instance
 * @param resource - Resource name to fetch
 * @param filters - Optional filters to apply
 * @param maxResults - Maximum number of records to fetch (default: 10000)
 * @param batchSize - Number of records to fetch per request (default: 100)
 * @returns Promise resolving to array of records
 *
 * @example
 * ```tsx
 * const users = await fetchAllRecords(dataProvider(), 'users', filters);
 * ```
 */
export async function fetchAllRecords(
  dataProvider: DataProvider,
  resource: string,
  filters?: CrudFilters,
  maxResults: number = 10000,
  batchSize: number = 100,
): Promise<BaseRecord[]> {
  const allRecords: BaseRecord[] = [];
  let currentPage = 1;
  let hasMore = true;

  while (hasMore && allRecords.length < maxResults) {
    const response = await dataProvider.getList({
      resource,
      pagination: { currentPage, pageSize: batchSize, mode: 'server' },
      filters: filters || [],
    });

    allRecords.push(...response.data);
    hasMore = response.data.length === batchSize;
    currentPage++;
  }

  return allRecords.slice(0, maxResults);
}

/**
 * Fetch all record IDs across all pages using Refine's data provider
 * Thin wrapper around fetchAllRecords that extracts just the IDs
 *
 * @param dataProvider - Refine data provider instance
 * @param resource - Resource name to fetch
 * @param filters - Optional filters to apply
 * @returns Promise resolving to array of record IDs
 *
 * @example
 * ```tsx
 * const userIds = await fetchAllIds(dataProvider(), 'users', filters);
 * ```
 */
export async function fetchAllIds(
  dataProvider: DataProvider,
  resource: string,
  filters?: CrudFilters,
): Promise<BaseKey[]> {
  const records = await fetchAllRecords(dataProvider, resource, filters);
  return records.map((item) => item.id).filter((id): id is BaseKey => id !== undefined);
}

/**
 * Convert records to CSV format
 *
 * Uses export-to-csv for RFC 4180 compliant CSV generation with proper
 * handling of quotes, commas, newlines, dates, and numbers.
 *
 * @param records - Array of records to convert
 * @param fields - Optional array of field names to include (default: all fields)
 * @param fieldLabels - Optional mapping of field names to custom labels for CSV headers
 * @returns CSV string
 *
 * @example
 * ```tsx
 * const csv = recordsToCSV(users, ['id', 'email', 'name'], {
 *   name: 'Full Name'
 * });
 * ```
 */
export function recordsToCSV(records: BaseRecord[], fields?: string[], fieldLabels?: Record<string, string>): string {
  if (records.length === 0) return '';

  // If fields are specified, filter records to only include those fields
  const recordsToExport = fields
    ? records.map((record) => {
        const filtered: BaseRecord = {};
        fields.forEach((field) => {
          filtered[field] = record[field];
        });
        return filtered;
      })
    : records;

  // Configure CSV export
  const csvConfig = mkConfig({
    fieldSeparator: ',',
    quoteStrings: true,
    decimalSeparator: '.',
    showColumnHeaders: true,
    useKeysAsHeaders: !fields,
    columnHeaders: fields?.map((field) => fieldLabels?.[field] || field),
  });

  // Generate and return CSV
  const csv = generateCsv(csvConfig)(recordsToExport);
  return asString(csv);
}

/**
 * Trigger browser download of a file
 *
 * @param content - File content (string or Blob)
 * @param fileName - Name for the downloaded file
 * @param mimeType - MIME type for the file (default: text/csv)
 *
 * @example
 * ```tsx
 * downloadFile(csvContent, 'users-2024-01-15.csv');
 * ```
 */
export function downloadFile(
  content: string | Blob,
  fileName: string,
  mimeType: string = 'text/csv;charset=utf-8;',
): void {
  const blob = typeof content === 'string' ? new Blob([content], { type: mimeType }) : content;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate filename with timestamp for exports
 *
 * @param resource - Resource name
 * @param extension - File extension (default: csv)
 * @returns Filename in format: {resource}-{YYYY-MM-DD}.{extension}
 *
 * @example
 * ```tsx
 * generateExportFilename('users') // "users-2024-01-15.csv"
 * generateExportFilename('users', 'json') // "users-2024-01-15.json"
 * ```
 */
export function generateExportFilename(resource: string, extension: string = 'csv'): string {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `${resource}-${date}.${extension}`;
}
