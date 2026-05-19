import { z } from 'zod';

export const globalAftercareSchema = {
  date: z.iso.date(),
  supervisorId: z.uuid(),
  students: z.array(z.uuid()),
};
