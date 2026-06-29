import { z } from 'zod';

export const assignStudentsToExtraCurricularReqSchema = z.object({
  studentIds: z.array(z.uuid()),
});

export type AssignStudentsToExtraCurricularReq = z.infer<typeof assignStudentsToExtraCurricularReqSchema>;
