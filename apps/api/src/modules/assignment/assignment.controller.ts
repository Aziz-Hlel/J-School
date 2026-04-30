import { Request, Response } from 'express';
import { AssignmentService } from './assignment.service';
import getUrlParam from '@/utils/getUrlParam';
import { SyncAssignmentRequestSchema } from '@repo/contracts/schemas/assignment/syncAssignmentRequest';
import { assignTeacherRequestSchema } from '@repo/contracts/schemas/assignment/assignTeacherRequest';

export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  syncMany = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const classroomId = getUrlParam(req, 'classroomId', { uuid: true });
    const input = SyncAssignmentRequestSchema.parse(req.body);

    const result = await this.assignmentService.syncMany({
      schoolId,
      classroomId,
      input,
    });
    let statusCode: number;
    let message: string;
    if (result.successCount === 0) {
      statusCode = 400;
      message = 'Failed to sync assignments';
    } else if (result.successCount === input.length) {
      statusCode = 201;
      message = 'Assignments synced successfully';
    } else {
      statusCode = 207;
      message = 'Partial success: some assignments were synced';
    }
    res.status(statusCode).json({
      message,
      data: {
        successCount: result.successCount,
        failed: result.failedAssignments,
      },
    });
  };

  assignTeacher = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const assignmentId = getUrlParam(req, 'assignmentId', { uuid: true });
    const input = assignTeacherRequestSchema.parse(req.body);
    const result = await this.assignmentService.assignTeacher({ schoolId, assignmentId, input });
    res.status(200).json({
      message: 'Teacher assigned successfully',
      data: result,
    });
  };

  getClassroomTimeTable = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const classroomId = getUrlParam(req, 'classroomId', { uuid: true });
    const result = await this.assignmentService.getClassroomTimeTable({ schoolId, classroomId });
    res.status(200).json({
      message: 'Classroom timetable fetched successfully',
      data: result,
    });
  };
}
