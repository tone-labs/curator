import { useState } from 'react';

import { Button, type ButtonProps } from '@mantine/core';
import type { BaseRecord, CrudFilters } from '@refinedev/core';
import { useDataProvider } from '@refinedev/core';
import { IconDownload } from '@tabler/icons-react';

import { downloadFile, fetchAllRecords, generateExportFilename, recordsToCSV } from '../../utils/export.js';

export interface ExportButtonProps {
  /** Resource to export */
  resource: string;

  /** Current filters to apply when fetching records */
  filters?: CrudFilters;

  /** Fields to include in export (default: all fields from first record) */
  fields?: string[];

  /** Custom field labels for CSV headers (e.g., { first_name: 'First Name' }) */
  fieldLabels?: Record<string, string>;

  /** Custom exporter function (default: CSV export) */
  exporter?: (records: BaseRecord[], fields?: string[]) => string | Blob;

  /** File name (default: {resource}-{date}.csv) */
  fileName?: string;

  /** Maximum records to export (default: 10000) */
  maxResults?: number;

  /** Callback before export starts - return false to cancel */
  onBeforeExport?: () => boolean | Promise<boolean>;

  /** Callback after export completes */
  onExportComplete?: (recordCount: number) => void;

  /** Callback on error */
  onError?: (error: Error) => void;

  /** Hide button text (icon only) */
  hideText?: boolean;

  // Mantine Button props
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  color?: ButtonProps['color'];
  disabled?: boolean;
}

/**
 * ExportButton - Export all filtered records to a file
 *
 * Fetches all records matching current filters and downloads as CSV (or custom format).
 * Respects filters, but ignores pagination.
 *
 * @example
 * Basic usage - exports all fields as CSV
 * ```tsx
 * <ExportButton resource="users" filters={filters} />
 * ```
 *
 * @example
 * Custom fields and labels
 * ```tsx
 * <ExportButton
 *   resource="users"
 *   fields={['id', 'email', 'first_name', 'last_name', 'is_active']}
 *   fieldLabels={{
 *     first_name: 'First Name',
 *     last_name: 'Last Name',
 *     is_active: 'Active'
 *   }}
 * />
 * ```
 *
 * @example
 * Custom exporter (JSON)
 * ```tsx
 * <ExportButton
 *   resource="users"
 *   exporter={(records) => JSON.stringify(records, null, 2)}
 *   fileName="users.json"
 * />
 * ```
 *
 * @example
 * With confirmation dialog
 * ```tsx
 * <ExportButton
 *   resource="users"
 *   onBeforeExport={() => window.confirm('Export all records?')}
 * />
 * ```
 */
export function ExportButton({
  resource,
  filters,
  fields,
  fieldLabels,
  exporter,
  fileName,
  maxResults = 10000,
  onBeforeExport,
  onExportComplete,
  onError,
  hideText = false,
  variant = 'default',
  size = 'sm',
  color,
  disabled = false,
}: ExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const dataProvider = useDataProvider();

  const handleExport = async () => {
    try {
      setLoading(true);

      // Check if export should proceed
      if (onBeforeExport) {
        const shouldProceed = await onBeforeExport();
        if (shouldProceed === false) {
          setLoading(false);
          return;
        }
      }

      // Fetch all records
      const records = await fetchAllRecords(dataProvider(), resource, filters, maxResults);

      if (records.length === 0) {
        setLoading(false);
        return;
      }

      // Generate export content
      let content: string | Blob;
      if (exporter) {
        content = exporter(records, fields);
      } else {
        // Default CSV export
        content = recordsToCSV(records, fields, fieldLabels);
      }

      // Determine filename
      const downloadFileName = fileName || generateExportFilename(resource);

      // Trigger download
      downloadFile(content, downloadFileName);

      // Call completion callback
      if (onExportComplete) {
        onExportComplete(records.length);
      }
    } catch (error) {
      console.error('Export error:', error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      color={color}
      disabled={disabled || loading}
      loading={loading}
      onClick={handleExport}
      leftSection={<IconDownload size={16} />}
    >
      {!hideText && 'Export'}
    </Button>
  );
}
