import { NumberInput } from '@mantine/core';
import { Controller, useFormContext } from 'react-hook-form';

export interface NumberFieldInputProps {
  source: string;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  precision?: number; // Number of decimal places
  placeholder?: string;
}

/**
 * NumberFieldInput - Input component for numeric values
 *
 * Usage:
 * ```tsx
 * <NumberFieldInput source="age" label="Age" min={0} max={120} />
 * <NumberFieldInput source="price" label="Price" min={0} step={0.01} precision={2} />
 * <NumberFieldInput source="quantity" label="Quantity" min={1} step={1} />
 * ```
 */
export function NumberFieldInput({
  source,
  label,
  description,
  required = false,
  disabled = false,
  min,
  max,
  step,
  precision,
  placeholder,
}: NumberFieldInputProps) {
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
        validate: (value) => {
          if (value === null || value === undefined || value === '') {
            return required ? 'This field is required' : true;
          }

          const numValue = typeof value === 'string' ? parseFloat(value) : value;

          if (Number.isNaN(numValue)) {
            return 'Must be a valid number';
          }

          if (min !== undefined && numValue < min) {
            return `Must be at least ${min}`;
          }

          if (max !== undefined && numValue > max) {
            return `Must be at most ${max}`;
          }

          return true;
        },
      }}
      render={({ field }) => (
        <NumberInput
          label={label || source}
          description={description}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          error={error}
          min={min}
          max={max}
          step={step}
          decimalScale={precision}
          hideControls={false}
          value={field.value ?? ''}
          onChange={(value) => {
            // Mantine NumberInput can return number or string or empty string
            field.onChange(value === '' ? null : value);
          }}
          onBlur={field.onBlur}
        />
      )}
    />
  );
}
