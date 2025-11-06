import { useState } from 'react';

import { ActionIcon, Button, Group, Select, Stack, Table } from '@mantine/core';
import { type BaseRecord, useList, useNotification } from '@refinedev/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';

import { useManyToMany } from '../context/ManyToManyContext.js';

interface ManyToManyTableEditorProps {
  // Fields to display from the reference resource
  columns: {
    source: string; // Field name on reference resource
    label: string; // Column header
    render?: (value: unknown, record: BaseRecord) => React.ReactNode;
  }[];

  // Join table fields that can be edited (e.g., "role")
  editableJoinFields?: {
    source: string; // Field name on join table
    label: string;
    options: { value: string; label: string }[];
  }[];

  // Label for the "Add" button
  addLabel?: string;
}

export function ManyToManyTableEditor({
  columns,
  editableJoinFields = [],
  addLabel = 'Add',
}: ManyToManyTableEditorProps) {
  const { open } = useNotification();
  const {
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
  } = useManyToMany();

  const [isAdding, setIsAdding] = useState(false);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [newJoinFieldValues, setNewJoinFieldValues] = useState<Record<string, string>>(
    editableJoinFields.reduce(
      (acc, field) => {
        acc[field.source] = field.options[0]?.value || '';
        return acc;
      },
      {} as Record<string, string>,
    ),
  );

  // Fetch all possible target records for the "Add" dropdown
  const { result: allTargetsResult } = useList({
    resource: reference,
    pagination: {
      pageSize: 100,
    },
  });

  const allTargets = (allTargetsResult.data || []) as BaseRecord[];

  // Get IDs that are already in the join table
  const existingTargetIds = new Set(joinRecords.map((r) => String(r[targetFk])));

  // Filter out already-joined targets
  const availableTargets = allTargets.filter((t) => !existingTargetIds.has(String(t.id)));

  // Merge join records with reference records for display
  const displayRecords = joinRecords.map((joinRecord) => {
    const targetId = String(joinRecord[targetFk]);
    const referenceRecord = referenceRecords.find((r) => String(r.id) === targetId);
    return {
      ...joinRecord,
      _reference: referenceRecord || {},
    } as BaseRecord & { id: string; _reference: BaseRecord };
  });

  const handleAdd = async () => {
    if (!selectedTargetId) {
      open?.({
        type: 'error',
        message: 'Please select an item to add',
        description: 'No selection',
      });
      return;
    }

    try {
      await createJoin({
        [sourceFk]: sourceValue,
        [targetFk]: selectedTargetId,
        ...newJoinFieldValues,
      });

      open?.({
        type: 'success',
        message: 'Item has been added',
        description: 'Added successfully',
      });

      setSelectedTargetId(null);
      setIsAdding(false);
    } catch (error) {
      console.error(error);
      open?.({
        type: 'error',
        message: 'Failed to add item',
        description: 'Error adding',
      });
    }
  };

  const handleUpdateJoinField = async (joinId: string, fieldName: string, value: string) => {
    try {
      await updateJoin(joinId, { [fieldName]: value });
      open?.({
        type: 'success',
        message: 'Changes have been saved',
        description: 'Updated successfully',
      });
    } catch (error) {
      console.error(error);
      open?.({
        type: 'error',
        message: 'Failed to save changes',
        description: 'Error updating',
      });
    }
  };

  const handleRemove = async (joinId: string) => {
    try {
      await deleteJoin([joinId]);
      open?.({
        type: 'success',
        message: 'Item has been removed',
        description: 'Removed successfully',
      });
    } catch (error) {
      console.error(error);
      open?.({
        type: 'error',
        message: 'Failed to remove item',
        description: 'Error removing',
      });
    }
  };

  if (isLoadingJoin || isLoadingReference) {
    return <div>Loading...</div>;
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <div style={{ fontWeight: 500 }}>Items ({displayRecords.length})</div>
        {!isAdding && (
          <Button size="compact-sm" leftSection={<IconPlus size={14} />} onClick={() => setIsAdding(true)}>
            {addLabel}
          </Button>
        )}
      </Group>

      {isAdding && (
        <Group gap="xs">
          <Select
            placeholder="Select item"
            data={availableTargets.map((t) => ({
              value: String(t.id),
              // Use first column as label
              label: String((columns[0]?.source && t[columns[0].source]) || t.id),
            }))}
            value={selectedTargetId}
            onChange={setSelectedTargetId}
            searchable
            style={{ flex: 1 }}
          />
          {editableJoinFields.map((field) => (
            <Select
              key={field.source}
              placeholder={field.label}
              data={field.options}
              value={newJoinFieldValues[field.source]}
              onChange={(value) =>
                setNewJoinFieldValues((prev) => ({
                  ...prev,
                  [field.source]: value || field.options[0]?.value || '',
                }))
              }
              style={{ width: 120 }}
            />
          ))}
          <Button onClick={handleAdd}>Add</Button>
          <Button variant="subtle" onClick={() => setIsAdding(false)}>
            Cancel
          </Button>
        </Group>
      )}

      {displayRecords.length > 0 ? (
        <Table>
          <Table.Thead>
            <Table.Tr>
              {columns.map((col) => (
                <Table.Th key={col.source}>{col.label}</Table.Th>
              ))}
              {editableJoinFields.map((field) => (
                <Table.Th key={field.source}>{field.label}</Table.Th>
              ))}
              <Table.Th style={{ width: 50 }}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {displayRecords.map((record) => (
              <Table.Tr key={String(record.id)}>
                {columns.map((col) => {
                  const value = record._reference[col.source];
                  return <Table.Td key={col.source}>{col.render ? col.render(value, record) : String(value)}</Table.Td>;
                })}
                {editableJoinFields.map((field) => (
                  <Table.Td key={field.source}>
                    <Select
                      data={field.options}
                      value={String(record[field.source])}
                      onChange={(value) => value && handleUpdateJoinField(record.id, field.source, value)}
                      size="xs"
                      style={{ width: 120 }}
                    />
                  </Table.Td>
                ))}
                <Table.Td>
                  <ActionIcon color="red" variant="subtle" size="sm" onClick={() => handleRemove(record.id)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <div style={{ color: 'var(--mantine-color-dimmed)', fontSize: 'var(--mantine-font-size-sm)' }}>
          No items yet. Click &quot;{addLabel}&quot; to get started.
        </div>
      )}
    </Stack>
  );
}
