import { updateTimetableRequest } from '@repo/contracts/schemas/timeTable/updateTimetableRequest';
import { TimetableRepo } from './timetable.repo';
import { CreateTimetableRequest } from '@repo/contracts/schemas/timeTable/createTimetableRequest';
import { TimetableMapper } from './timetable.mapper';

export class TimetableService {
  constructor(private readonly repo: TimetableRepo) {}

  create = async (params: { input: CreateTimetableRequest; assignmentId: string; schoolId: string }) => {
    const { input, schoolId, assignmentId } = params;
    const createdtimetable = await this.repo.create({ input, schoolId, assignmentId });
    const timetableResponse = TimetableMapper.toResponse(createdtimetable);
    return timetableResponse;
  };

  update = async (params: { input: updateTimetableRequest; timetableId: string; schoolId: string }) => {
    const { input, schoolId, timetableId } = params;
    const updatedtimetable = await this.repo.update({ input, schoolId, timetableId });
    const timetableResponse = TimetableMapper.toResponse(updatedtimetable);
    return timetableResponse;
  };

  delete = async (params: { timetableId: string; schoolId: string }) => {
    const { timetableId, schoolId } = params;
    return await this.repo.deleteMany({ timetableId, schoolId });
  };
}
