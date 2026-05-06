import { z } from 'zod';
import { getWeekNbr } from '../../utils/getWeekNbr';

export const getClassroomAttendancesQuerySchema = z.object({
  week: z.coerce.number().int().positive().max(52).catch(getWeekNbr()),
  timetableId: z.uuid().optional(),
});

export type GetClassroomAttendancesQuery = z.infer<typeof getClassroomAttendancesQuerySchema>;
