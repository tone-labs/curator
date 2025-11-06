import { Switch } from '@mantine/core';
import { Controller, useFormContext } from 'react-hook-form';

export interface BooleanFieldInputProps {
  source: string;
  label: string;
  description?: string;
}

export function BooleanFieldInput({ source, label, description }: BooleanFieldInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={source}
      control={control}
      render={({ field }) => (
        <Switch
          {...field}
          label={label}
          description={description}
          checked={field.value || false}
          onChange={(event) => field.onChange(event.currentTarget.checked)}
        />
      )}
    />
  );
}
