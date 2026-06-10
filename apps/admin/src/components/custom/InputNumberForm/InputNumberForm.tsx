import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { type ControllerRenderProps } from 'react-hook-form';

interface InputNumberFormProps<T extends Object> {
  field: ControllerRenderProps<T>;
  placeholder?: string;
  emptyInitially?: boolean;
}

const InputNumberForm = <T extends Object>({ field, placeholder, emptyInitially = false }: InputNumberFormProps<T>) => {
  const [value, setValue] = useState<string>(emptyInitially ? '' : (field.value as string));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setValue('');
      field.onChange(undefined);
      return;
    }
    if (/^\d+(\.\d{0,2})?$/.test(value)) {
      setValue(value);
      field.onChange(Number(value));
    }
  };

  return (
    <>
      <Input
        placeholder={placeholder}
        type='text'
        pattern='^\d+(\.\d{0,2})?$'
        inputMode='decimal'
        value={value}
        onChange={handleChange}
      />
    </>
  );
};

export default InputNumberForm;
