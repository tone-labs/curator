import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';

export interface DateFieldInputProps {
  source: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  description?: string;
  minDate?: string | Date | null;
  maxDate?: string | Date | null;
  clearable?: boolean;
}

/**
 * DateFieldInput - Date picker input for date fields
 *
 * Works with date strings for both input and output.
 * Internally converts to/from Date objects for the Mantine DateInput component.
 *
 * **Input**: RFC 3339 date-time string (e.g., "2024-01-15T00:00:00Z") or any date-parseable string
 * **Output**: RFC 3339 date-time string at midnight UTC or null
 *
 * Example:
 * ```tsx
 * <DateFieldInput
 *   source="birth_date"
 *   label="Date of Birth"
 *   maxDate="2024-12-31T00:00:00Z"  // Can use string or Date
 *   clearable
 * />
 * ```
 */
export function DateFieldInput({
  source,
  label,
  placeholder,
  disabled,
  required,
  description,
  minDate,
  maxDate,
  clearable = true,
}: DateFieldInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[source]?.message as string | undefined;

  // Helper to convert string/Date to Date object
  const toDate = (value: string | Date | null | undefined): Date | undefined => {
    if (!value) return undefined;
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.toDate() : undefined;
  };

  return (
    <Controller
      name={source}
      control={control}
      render={({ field }) => (
        <DateInput
          value={toDate(field.value)}
          onChange={(date) => {
            // Convert Date to RFC 3339 format (ISO 8601 with timezone) at midnight UTC
            if (date) {
              const parsed = dayjs(date).startOf('day');
              field.onChange(parsed.isValid() ? parsed.toISOString() : null);
            } else {
              field.onChange(null);
            }
          }}
          onBlur={field.onBlur}
          name={field.name}
          ref={field.ref}
          label={label || source}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          description={description}
          error={error}
          minDate={toDate(minDate)}
          maxDate={toDate(maxDate)}
          clearable={clearable}
        />
      )}
    />
  );
}
