import { useState } from 'react';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';

export const useErrors = <T extends FieldValues>(form: UseFormReturn<T>, fieldName: Path<T>) => {
  const hasNativeErrors = form.formState.errors[fieldName] !== undefined;

  const [hasErrors, setHasErrors] = useState(hasNativeErrors);

  const setError = (message: string) => {
    form.setError(fieldName, { message });
    setHasErrors(true);
  };
  const clearErrors = () => {
    form.clearErrors(fieldName);
    setHasErrors(false);
  };

  return { hasErrors, setError, clearErrors };
};
