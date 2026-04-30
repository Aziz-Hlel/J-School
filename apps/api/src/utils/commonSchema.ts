import z from 'zod';

const zodName = (fieldName: string) =>
  z
    .string({ error: `${fieldName} is required` })
    .min(1)
    .max(100);
const zodEmail = () => z.email({ message: 'Invalid email address' });
const zodNumber = (fieldName: string) => z.number({ error: `${fieldName} must be a number` });

export { zodName, zodEmail, zodNumber };
