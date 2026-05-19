import dayjs from 'dayjs';
import { globalAftercareSchema } from '../shared/aftercare.schema';
import z from 'zod';

export const syncAftercareReqSchema = z
  .object({
    date: globalAftercareSchema.date,
    supervisorId: globalAftercareSchema.supervisorId,
    students: globalAftercareSchema.students,
  })
  .refine((data) => dayjs(data.date).isAfter(dayjs()), {
    message: 'Date must be in the future',
  });

export type SyncAftercareReq = z.infer<typeof syncAftercareReqSchema>;
