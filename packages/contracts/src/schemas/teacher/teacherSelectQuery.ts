import { z } from 'zod';

export const teacherSelectQuerySchema = z.object({
  cursor: z.uuid().optional().catch(undefined),
  search: z.string().trim().optional().catch(undefined),
  limit: z.coerce.number().catch(10),
});

export type TeacherSelectQuery = z.infer<typeof teacherSelectQuerySchema>;
