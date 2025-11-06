import type { ReactNode } from 'react';

import { useCreate, useRefineContext } from '@refinedev/core';
import { FormProvider, useForm } from 'react-hook-form';

interface CreateContextData {
  resource: string;
  isSubmitting: boolean;
  submit: () => void;
  reset: () => void;
}

interface CreateProps<TData> {
  resource: string;
  children: (context: CreateContextData) => ReactNode;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
}

/**
 * Create - Create form component using Refine's useCreate hook
 *
 * This component provides form state management and data mutation for creating resources.
 * Uses a render prop pattern to pass form context and actions to children.
 * Can be used standalone or wrapped in a modal/page layout.
 *
 * Usage:
 * ```tsx
 * <Create
 *   resource="users"
 *   onSuccess={() => console.log('Created!')}
 * >
 *   {({ resource, isSubmitting, submit }) => (
 *     <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
 *       <TextInput source="email" />
 *       <Button type="submit" loading={isSubmitting}>Create</Button>
 *     </form>
 *   )}
 * </Create>
 * ```
 */
export function Create<TData extends { id?: string | number }>({
  resource,
  children,
  onSuccess,
  onError,
}: CreateProps<TData>) {
  const methods = useForm();
  const { mutate, mutation } = useCreate();
  const {
    options: { textTransformers },
  } = useRefineContext();
  const resourceSingular = textTransformers.singular(resource);

  const handleSubmit = methods.handleSubmit((values) => {
    mutate(
      {
        resource,
        values,
        successNotification: (data) => {
          const record = data?.data as TData;
          const recordId = record?.id;

          return {
            message: `Successfully created ${resourceSingular}`,
            description: 'Success',
            type: 'success',
            ...(recordId && {
              key: `create-${resource}-${recordId}`,
              // Store the resource and id for the notification provider to create a link
              meta: { resource, id: recordId, action: 'show' },
            }),
          };
        },
      },
      {
        onSuccess: (data) => {
          methods.reset();
          onSuccess?.(data.data as TData);
        },
        onError: (error) => {
          onError?.(error as unknown as Error);
        },
      },
    );
  });

  return (
    <FormProvider {...methods}>
      {children({
        resource,
        isSubmitting: mutation.isPending,
        submit: handleSubmit,
        reset: methods.reset,
      })}
    </FormProvider>
  );
}
