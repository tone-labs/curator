import { FileInput, Group, Stack, Text } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { Controller, useFormContext } from 'react-hook-form';

export interface FileFieldInputProps {
  source: string;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
}

/**
 * FileFieldInput - Generic file input for any file type
 *
 * Usage:
 * ```tsx
 * <FileFieldInput
 *   source="resume_url"
 *   label="Resume"
 *   accept=".pdf,.doc,.docx"
 *   maxSize={10 * 1024 * 1024} // 10MB
 * />
 * ```
 *
 * The component handles both File objects (for new uploads) and string URLs (for existing files).
 * The form value will be the File object, which should be uploaded via the API.
 */
export function FileFieldInput({
  source,
  label,
  description,
  required = false,
  disabled = false,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
}: FileFieldInputProps) {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  const error = errors[source]?.message as string | undefined;
  const currentValue = watch(source);

  // Get the current filename to display
  const getCurrentFileName = () => {
    if (currentValue instanceof File) {
      return currentValue.name;
    }
    if (typeof currentValue === 'string' && currentValue) {
      return currentValue.split('/').pop() || 'Current file';
    }
    return null;
  };

  const currentFileName = getCurrentFileName();

  return (
    <Controller
      name={source}
      control={control}
      rules={{
        validate: (value) => {
          if (required && !value) {
            return 'This field is required';
          }

          // Validate file size if it's a File object
          if (value instanceof File) {
            if (value.size > maxSize) {
              const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
              return `File size must be less than ${maxSizeMB}MB`;
            }

            // Validate file type if accept is specified
            if (accept) {
              const acceptedTypes = accept.split(',').map((t) => t.trim());
              const fileExtension = `.${value.name.split('.').pop()?.toLowerCase()}`;
              const mimeTypeMatches = acceptedTypes.some((type) => {
                if (type.includes('*')) {
                  // Handle wildcard MIME types like "image/*"
                  const baseType = type.split('/')[0];
                  return value.type.startsWith(baseType + '/');
                }
                return type === value.type;
              });
              const extensionMatches = acceptedTypes.includes(fileExtension);

              if (!mimeTypeMatches && !extensionMatches) {
                return `File type must be one of: ${acceptedTypes.join(', ')}`;
              }
            }
          }

          return true;
        },
      }}
      render={({ field }) => (
        <Stack gap="sm">
          {currentFileName && typeof currentValue === 'string' && (
            <Text size="sm" c="dimmed">
              Current file: {currentFileName}
            </Text>
          )}

          <FileInput
            label={label || source}
            description={
              description ||
              (accept
                ? `Accepted formats: ${accept}. Max size: ${(maxSize / (1024 * 1024)).toFixed(1)}MB`
                : `Max size: ${(maxSize / (1024 * 1024)).toFixed(1)}MB`)
            }
            placeholder={currentFileName ? 'Choose a different file' : 'Choose a file'}
            accept={accept}
            required={required}
            disabled={disabled}
            error={error}
            leftSection={<IconUpload size={16} />}
            onChange={(file) => {
              field.onChange(file);
            }}
            // Show current filename if it's a File
            value={field.value instanceof File ? field.value : null}
          />

          {field.value instanceof File && (
            <Group gap="xs">
              <Text size="xs" c="dimmed">
                Selected: {field.value.name}
              </Text>
              <Text size="xs" c="dimmed">
                ({(field.value.size / 1024).toFixed(1)} KB)
              </Text>
            </Group>
          )}
        </Stack>
      )}
    />
  );
}
