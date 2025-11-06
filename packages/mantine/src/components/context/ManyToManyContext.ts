import { createContext, useContext } from 'react';

export interface ManyToManyResult {
  // Join table data
  joinRecords: Record<string, unknown>[];
  isLoadingJoin: boolean;

  // Reference resource data
  referenceRecords: Record<string, unknown>[];
  isLoadingReference: boolean;

  // Mutations
  createJoin: (data: Record<string, unknown>) => Promise<void>;
  updateJoin: (id: string, data: Record<string, unknown>) => Promise<void>;
  deleteJoin: (ids: string[]) => Promise<void>;

  // Field names and values
  sourceFk: string;
  targetFk: string;
  sourceValue: string;
  reference: string;
  through: string;
}

export const ManyToManyContext = createContext<ManyToManyResult | null>(null);

/**
 * Access many-to-many relationship data from context.
 *
 * Must be used within a ReferenceManyToManyProvider component.
 */
export function useManyToMany(): ManyToManyResult {
  const context = useContext(ManyToManyContext);
  if (!context) {
    throw new Error('useManyToMany must be used within ReferenceManyToManyProvider');
  }
  return context;
}
