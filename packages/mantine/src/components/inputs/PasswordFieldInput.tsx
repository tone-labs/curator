import { PasswordInput } from '@mantine/core';
import { Controller, useFormContext } from 'react-hook-form';

export interface PasswordFieldInputProps {
  source: string;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
}

/**
 * PasswordFieldInput - Input component for password fields
 *
 * Usage:
 * ```tsx
 * <PasswordFieldInput source="password" label="Password" required minLength={8} />
 * <PasswordFieldInput source="current_password" label="Current Password" />
 * ```
 */
export function PasswordFieldInput({
  source,
  label,
  description,
  required = false,
  disabled = false,
  placeholder,
  minLength,
  maxLength,
}: PasswordFieldInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[source]?.message as string | undefined;

  return (
    <Controller
      name={source}
      control={control}
      rules={{
        required: required ? 'This field is required' : false,
        minLength: minLength
          ? {
              value: minLength,
              message: `Password must be at least ${minLength} characters`,
            }
          : undefined,
        maxLength: maxLength
          ? {
              value: maxLength,
              message: `Password must be at most ${maxLength} characters`,
            }
          : undefined,
      }}
      render={({ field }) => (
        <PasswordInput
          label={label || source}
          description={description}
          placeholder={placeholder || 'Enter password'}
          required={required}
          disabled={disabled}
          error={error}
          value={field.value || ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
        />
      )}
    />
  );
}
