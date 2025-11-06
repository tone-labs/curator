import type { ReactNode } from 'react';

import { Button, Group, Stack } from '@mantine/core';
import { useUpdate } from '@refinedev/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import type { FieldValues } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

export interface EditFormProps<TData extends FieldValues = FieldValues> {
  data: TData;
  resource: string;
  id: string;
  children: ReactNode;
  onSuccess?: () => void;
}

/**
 * EditForm - Form component for editing resources with Refine
 *
 * This component provides:
 * - Form state management via react-hook-form
 * - Data mutation via Refine's useUpdate hook
 * - Dirty state tracking (Save button disabled when no changes)
 * - Reset button to revert changes
 * - Success/error notifications
 *
 * @example
 * ```tsx
 * <Edit<User> resource="users" id={id}>
 *   {(user, { resource, id }) => (
 *     <EditForm data={user} resource={resource} id={id}>
 *       <TextInput source="email" label="Email" />
 *       <TextInput source="first_name" label="First Name" />
 *     </EditForm>
 *   )}
 * </Edit>
 * ```
 */
export function EditForm<TData extends FieldValues = FieldValues>({
  data,
  resource,
  id,
  children,
  onSuccess,
}: EditFormProps<TData>) {
  const { mutate, mutation } = useUpdate();

  const methods = useForm({
    values: data, // RHF will sync with this data
  });

  const handleSubmit = methods.handleSubmit((values) => {
    // Only send fields that were actually changed
    const dirtyFields = methods.formState.dirtyFields;
    const changedValues = Object.keys(dirtyFields).reduce(
      (acc, key) => {
        acc[key] = values[key];
        return acc;
      },
      {} as Record<string, unknown>,
    );

    mutate(
      {
        resource,
        id,
        values: changedValues,
      },
      {
        onSuccess: () => {
          methods.reset(methods.getValues());
          onSuccess?.();
        },
        onError: (error) => {
          console.error(error);
        },
      },
    );
  });

  const { isDirty } = methods.formState;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          {children}

          <Group justify="flex-end" gap="sm">
            {isDirty && (
              <Button variant="default" leftSection={<IconX size={16} />} onClick={() => methods.reset()}>
                Reset
              </Button>
            )}
            <Button
              type="submit"
              leftSection={<IconCheck size={16} />}
              disabled={!isDirty}
              loading={mutation.isPending}
            >
              Save
            </Button>
          </Group>
        </Stack>
      </form>
    </FormProvider>
  );
}
