import z from 'zod';

const removeSpecialCharacters = (value: string) => value.replace(/[^a-zA-Z0-9 ]/g, '');

type CommonStringSchemaProps = {
  min?: number;
  max?: number;
  fieldName: string;
  allowSpecialCharacters?: boolean;
};
/** string cannot be empty
 *  min default is 3 and max default is 255
 *  allowSpecialCharacters default is false
 */
export const commonStringSchema = ({
  min = 3,
  max = 255,
  fieldName,
  allowSpecialCharacters = false,
}: CommonStringSchemaProps) =>
  z
    .string()
    .trim()
    .refine(
      (value) => allowSpecialCharacters || removeSpecialCharacters(value).length === value.length,
      `${fieldName} cannot contain special characters`,
    )
    .min(1, `${fieldName} cannot be empty`)
    .refine((value) => value.length >= min, `${fieldName} must be at least ${min} characters long`)
    .max(max, `${fieldName} cannot be longer than ${max} characters`);
