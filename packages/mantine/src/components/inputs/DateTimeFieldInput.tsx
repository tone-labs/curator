import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';

export interface DateTimeFieldInputProps {
  source: string;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  minDate?: string;
  maxDate?: string;
  placeholder?: string;
}

/**
 * DateTimeFieldInput - Input component for date and time values
 *
 * Usage:
 * ```tsx
 * <DateTimeFieldInput source="scheduled_at" label="Schedule For" />
 * <DateTimeFieldInput source="event_time" label="Event Time" required />
 * <DateTimeFieldInput
 *   source="appointment"
 *   label="Appointment"
 *   minDate={new Date().toISOString()}
 *   clearable
 * />
 * ```
 */
export function DateTimeFieldInput({
  source,
  label,
  description,
  required = false,
  disabled = false,
  clearable = false,
  minDate,
  maxDate,
  placeholder,
}: DateTimeFieldInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[source]?.message as string | undefined;

  // Helper to convert string/Date to Date object with dayjs validation
  const toDate = (value: string | Date | null | undefined): Date | undefined => {
    if (!value) return undefined;
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.toDate() : undefined;
  };

  return (
    <Controller
      name={source}
      control={control}
      rules={{
        required: required ? 'This field is required' : false,
      }}
      render={({ field }) => {
        const dateValue = toDate(field.value);

        return (
          <DateTimePicker
            label={label || source}
            description={description}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            clearable={clearable}
            error={error}
            minDate={toDate(minDate)}
            maxDate={toDate(maxDate)}
            value={dateValue ?? null}
            onChange={(newDate) => {
              if (newDate) {
                const parsed = dayjs(newDate);
                field.onChange(parsed.isValid() ? parsed.toISOString() : null);
              } else {
                field.onChange(null);
              }
            }}
            valueFormat="MMM D, YYYY h:mm A"
          />
        );
      }}
    />
  );
}
