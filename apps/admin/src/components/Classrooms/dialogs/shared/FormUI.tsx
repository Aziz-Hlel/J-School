import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
// import ImageUpload2 from '@/components/ui2/ImageUpload/comp/ImageUpload2';
import SelectForm from '@/components/custom/SelectForm/SelectForm';
import { Input } from '@/components/ui/input';
import { ClassGrade } from '@repo/contracts/types/enums/enums';
import { Controller, type UseFormReturn } from 'react-hook-form';
import type { schemasType } from '../../core/services';

const FormUI = ({ form }: { form: UseFormReturn<schemasType['create']> }) => {
  return (
    <>
      <Controller
        name='name'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={`name-input`}>Name</FieldLabel>
            <Input {...field} id={`name-input`} aria-invalid={fieldState.invalid} placeholder='Name' />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name='grade'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className='flex'>
            <FieldLabel htmlFor={`status-input`}>Status</FieldLabel>
            <SelectForm field={field} options={ClassGrade} placeholder='Select status' label='Status' />
          </Field>
        )}
      />

      <Controller
        name='description'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={`description-input`}>Description</FieldLabel>
            <Textarea {...field} id={`description-input`} aria-invalid={fieldState.invalid} placeholder='Description' />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </>
  );
};

export default FormUI;
