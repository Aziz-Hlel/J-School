import z from 'zod';

export const dateStringSchema = (message?: string) =>
  z.string().refine((dateString) => !isNaN(new Date(dateString).getTime()), {
    message: message || 'Invalid date string',
  });

export const emailSchema = z.email();

export const uuidSchema = z.uuid();
