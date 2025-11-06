import { useState } from 'react';

import { Box, CloseButton, FileInput, Group, Image, Stack, Text } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { Controller, useFormContext } from 'react-hook-form';

export interface ImageFieldInputProps {
  source: string;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
  width?: number;
  height?: number;
}

/**
 * ImageFieldInput - File input specifically for images with preview
 *
 * Usage:
 * ```tsx
 * <ImageFieldInput
 *   source="avatar_url"
 *   label="Avatar"
 *   accept="image/png,image/jpeg,image/gif,image/webp"
 *   maxSize={5 * 1024 * 1024} // 5MB
 *   width={200}
 *   height={200}
 * />
 * ```
 *
 * The component handles both File objects (for new uploads) and string URLs (for existing images).
 * When a file is selected, it creates a preview using URL.createObjectURL.
 * The form value will be the File object, which should be uploaded via the API.
 */
export function ImageFieldInput({
  source,
  label,
  description,
  required = false,
  disabled = false,
  accept = 'image/png,image/jpeg,image/gif,image/webp',
  maxSize = 5 * 1024 * 1024, // 5MB default
  width = 200,
  height = 200,
}: ImageFieldInputProps) {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  const error = errors[source]?.message as string | undefined;
  const currentValue = watch(source);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Get the image URL to display
  const getImageUrl = () => {
    // If there's a preview URL (from newly selected file), use that
    if (previewUrl) {
      return previewUrl;
    }

    // If the current value is a File object, create a preview
    if (currentValue instanceof File) {
      const url = URL.createObjectURL(currentValue);
      setPreviewUrl(url);
      return url;
    }

    // If the current value is a string URL, use it
    if (typeof currentValue === 'string' && currentValue) {
      return currentValue;
    }

    return null;
  };

  const imageUrl = getImageUrl();

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

            // Validate file type
            const acceptedTypes = accept.split(',').map((t) => t.trim());
            if (!acceptedTypes.includes(value.type)) {
              return `File type must be one of: ${acceptedTypes.join(', ')}`;
            }
          }

          return true;
        },
      }}
      render={({ field }) => (
        <Stack gap="sm">
          {imageUrl && (
            <Box pos="relative" w={width} h={height}>
              <Image src={imageUrl} alt={label || source} fit="cover" radius="md" w={width} h={height} />
              {!disabled && (
                <CloseButton
                  pos="absolute"
                  top={5}
                  right={5}
                  size="sm"
                  radius="xl"
                  variant="filled"
                  onClick={() => {
                    field.onChange(null);
                    if (previewUrl) {
                      URL.revokeObjectURL(previewUrl);
                      setPreviewUrl(null);
                    }
                  }}
                />
              )}
            </Box>
          )}

          <FileInput
            label={label || source}
            description={
              description ||
              `Accepted formats: ${accept.split(',').join(', ')}. Max size: ${(maxSize / (1024 * 1024)).toFixed(1)}MB`
            }
            placeholder={imageUrl ? 'Choose a different image' : 'Choose an image'}
            accept={accept}
            required={required}
            disabled={disabled}
            error={error}
            leftSection={<IconUpload size={16} />}
            onChange={(file) => {
              // Clean up old preview URL
              if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
              }

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
