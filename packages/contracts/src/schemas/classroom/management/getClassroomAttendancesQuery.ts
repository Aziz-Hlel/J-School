import { z } from 'zod';
import { toWeekNbr } from '../../utils/getWeekNbr';

export const getClassroomAttendancesQuerySchema = z.object({
  week: z.coerce.number().int().positive().max(52).catch(toWeekNbr()),
  timetableId: z.uuid().optional(),
});

export type GetClassroomAttendancesQuery = z.infer<typeof getClassroomAttendancesQuerySchema>;
