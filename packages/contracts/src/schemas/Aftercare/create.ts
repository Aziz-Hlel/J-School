import z from 'zod';
import { globalAftercareSchema } from '../shared/aftercare.schema';
export const createAftercareReqSchema = z.object({
  date: globalAftercareSchema.date,
  supervisorId: globalAftercareSchema.supervisorId,
  students: globalAftercareSchema.students,
});

export type CreateAftercareReq = z.infer<typeof createAftercareReqSchema>;
