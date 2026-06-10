import z from 'zod';

export const optionalUrl = (props: { url: { message: string; max: number; min?: number } }) => {
  return z
    .union([
      z
        .string()
        .url(props.url.message || 'Please enter a valid URL or leave empty')
        .min(props.url.min || 0, `URL must be at least ${props.url.min} characters`)
        .max(props.url.max, `URL must be at most ${props.url.max} characters`)
        .trim(),
      z.literal(''),
      z.null(),
    ])
    .transform((val) => (val?.trim() === '' ? undefined : val));
};

export const optionalString = (props: { string: { message: string; max: number; min?: number } }) => {
  return z
    .union([
      z
        .string()
        .min(props.string.min || 0, `Must be at least ${props.string.min} characters or leave empty`)
        .max(props.string.max, `Must be at most ${props.string.max} characters`)
        .trim(),
      z.literal(''),
      z.null(),
    ])
    .transform((val) => (val?.trim() === '' ? undefined : val));
};
