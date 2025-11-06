import type { ReactNode } from 'react';
import { useMemo } from 'react';

import { useCreate, useDeleteMany, useInvalidate, useList, useUpdate } from '@refinedev/core';

import type { ManyToManyResult } from './ManyToManyContext.js';
import { ManyToManyContext } from './ManyToManyContext.js';

interface ReferenceManyToManyProviderProps {
  source: string; // Field name on current record (usually "id")
  sourceValue: string; // Actual value of the source field (the ID)
  reference: string; // Target resource
  through: string; // Join table resource
  using: string; // Comma-separated FK fields: "source_fk,target_fk"
  children: ReactNode;
}

/**
 * Private hook that fetches and manages many-to-many relationship data.
 * This hook is used internally by ReferenceManyToManyProvider.
 */
function useManyToManyRelation({
  sourceValue,
  reference,
  through,
  sourceFk,
  targetFk,
}: {
  sourceValue: string;
  reference: string;
  through: string;
  sourceFk: string;
  targetFk: string;
}): ManyToManyResult {
  const invalidate = useInvalidate();

  // Fetch join table records
  const { result: joinResult, query: joinQuery } = useList({
    resource: through,
    filters: [
      {
        field: sourceFk,
        operator: 'eq',
        value: sourceValue,
      },
    ],
    pagination: {
      pageSize: 100,
    },
  });

  const isLoadingJoin = joinQuery.isLoading;
  const joinRecords = useMemo(() => {
    return (joinResult.data || []) as Record<string, unknown>[];
  }, [joinResult.data]);

  // Extract target IDs from join records
  const targetIds = useMemo(() => {
    return joinRecords.map((record) => String(record[targetFk])).filter(Boolean);
  }, [joinRecords, targetFk]);

  // Fetch reference records (only if we have target IDs)
  const { result: referenceResult, query: referenceQuery } = useList({
    resource: reference,
    pagination: {
      pageSize: 100,
    },
    queryOptions: {
      enabled: targetIds.length > 0,
    },
  });

  const isLoadingReference = referenceQuery.isLoading;

  // Extract reference records and filter to only those in our join table
  const referenceRecords = useMemo(() => {
    const allRecords = referenceResult.data || [];
    const targetIdSet = new Set(targetIds);
    return allRecords.filter((record) => targetIdSet.has(String(record.id)));
  }, [referenceResult.data, targetIds]);

  // Create mutation
  const { mutateAsync: createMutation } = useCreate();

  const createJoin = async (data: Record<string, unknown>) => {
    await createMutation({
      resource: through,
      values: data,
    });
    invalidate({
      resource: through,
      invalidates: ['list'],
    });
    invalidate({
      resource: reference,
      invalidates: ['list'],
    });
  };

  // Update mutation
  const { mutateAsync: updateMutation } = useUpdate();

  const updateJoin = async (id: string, data: Record<string, unknown>) => {
    await updateMutation({
      resource: through,
      id,
      values: data,
    });
    invalidate({
      resource: through,
      invalidates: ['list'],
    });
    invalidate({
      resource: reference,
      invalidates: ['list'],
    });
  };

  // Delete mutation
  const { mutateAsync: deleteMutation } = useDeleteMany();

  const deleteJoin = async (ids: string[]) => {
    await deleteMutation({
      resource: through,
      ids,
    });
    invalidate({
      resource: through,
      invalidates: ['list'],
    });
    invalidate({
      resource: reference,
      invalidates: ['list'],
    });
  };

  return {
    joinRecords,
    isLoadingJoin,
    referenceRecords,
    isLoadingReference,
    createJoin,
    updateJoin,
    deleteJoin,
    sourceFk,
    targetFk,
    sourceValue,
    reference,
    through,
  };
}

/**
 * Provides many-to-many relationship data to children via context.
 *
 * Children can access the data using the useManyToMany() hook.
 *
 * @example
 * ```tsx
 * <ManyToManyProvider
 *   sourceValue={orgId}
 *   reference="users"
 *   through="organization-memberships"
 *   using="organization_id,user_id"
 * >
 *   <ManyToManyTableEditor columns={[...]} />
 * </ManyToManyProvider>
 * ```
 */
export function ManyToManyProvider({
  sourceValue,
  reference,
  through,
  using,
  children,
}: ReferenceManyToManyProviderProps) {
  const [sourceFk, targetFk] = using.split(',').map((s) => s.trim()) as [string, string];

  const contextValue = useManyToManyRelation({
    sourceValue,
    reference,
    through,
    sourceFk,
    targetFk,
  });

  return <ManyToManyContext.Provider value={contextValue}>{children}</ManyToManyContext.Provider>;
}
