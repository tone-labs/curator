import { Box, Image, Stack, Text } from '@mantine/core';

export interface ImageFieldProps {
  label?: string;
  value?: string | null;
  width?: number;
  height?: number;
  alt?: string;
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * ImageField - Displays an image with an optional label
 *
 * Usage:
 * ```tsx
 * // With label
 * <ImageField label="Avatar" value={user.avatar_url} width={100} height={100} />
 * <ImageField label="Cover Photo" value={post.cover_url} width={300} height={200} fit="cover" />
 *
 * // Without label
 * <ImageField value={user.avatar_url} width={100} height={100} />
 * ```
 */
export function ImageField({
  label,
  value,
  width = 100,
  height = 100,
  alt,
  fit = 'cover',
  radius = 'md',
}: ImageFieldProps) {
  const imageContent = value ? (
    <Box w={width} h={height}>
      <Image src={value} alt={alt || label || 'Image'} fit={fit} radius={radius} w={width} h={height} />
    </Box>
  ) : (
    <Text c="dimmed" size="sm">
      No image
    </Text>
  );

  if (label) {
    return (
      <Stack gap={4}>
        <Text size="sm" fw={500}>
          {label}
        </Text>
        {imageContent}
      </Stack>
    );
  }

  return imageContent;
}
