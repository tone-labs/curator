import { TextInput as MantineTextInput } from '@mantine/core';
import { Controller, useFormContext } from 'react-hook-form';

export interface TextFieldInputProps {
  source: string;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  type?: 'text' | 'email' | 'password' | 'url' | 'tel';
  maxLength?: number;
}

export function TextFieldInput({
  source,
  label,
  placeholder,
  description,
  required = false,
  disabled = false,
  type = 'text',
  maxLength,
}: TextFieldInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[source]?.message as string | undefined;

  return (
    <Controller
      name={source}
      control={control}
      render={({ field }) => (
        <MantineTextInput
          {...field}
          label={label || source}
          placeholder={placeholder}
          description={description}
          type={type}
          required={required}
          disabled={disabled}
          error={error}
          maxLength={maxLength}
          value={(field.value as string | undefined) || ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
        />
      )}
    />
  );
}
