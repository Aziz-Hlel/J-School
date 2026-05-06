import type { ClassroomManagementService } from './ClassroomManagement.service';
import getUrlParam from '@/utils/getUrlParam';
import { assignTeacherRequestSchema } from '@repo/contracts/schemas/assignment/assignTeacherRequest';
import { AssignStudentRequestSchema } from '@repo/contracts/schemas/classroom/management/assignStudentRequest';
import { getClassroomAttendancesQuerySchema } from '@repo/contracts/schemas/classroom/management/getClassroomAttendancesQuery';
import { Request, Response } from 'express';

export class ClassroomManagementController {
  constructor(private readonly classroomManagementService: ClassroomManagementService) {}

  getSubjectsWithTeachers = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const classroomId = getUrlParam(req, 'classroomId');
    const subjects = await this.classroomManagementService.getSubjectsWithTeachers({ schoolId, classroomId });
    res.status(200).json({
      message: 'Subjects with teachers fetched successfully',
      data: subjects,
    });
  };

  getExams = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const classroomId = getUrlParam(req, 'classroomId');
    const exams = await this.classroomManagementService.getExams({ schoolId, classroomId });
    res.status(200).json({
      message: 'Exams fetched successfully',
      data: exams,
    });
  };

  assignTeacher = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const classroomId = getUrlParam(req, 'classroomId');
    const input = assignTeacherRequestSchema.parse(req.body);
    const data = await this.classroomManagementService.assignTeacher({ schoolId, classroomId, input });
    res.status(200).json({
      message: 'Teacher assigned successfully',
      data,
    });
  };

  assignStudent = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const classroomId = getUrlParam(req, 'classroomId');
    const input = AssignStudentRequestSchema.parse(req.body);
    const data = await this.classroomManagementService.assignStudent({ schoolId, classroomId, input });
    res.status(200).json({
      message: 'Student assigned successfully',
      data,
    });
  };

  getAttendances = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const classroomId = getUrlParam(req, 'classroomId');
    const query = getClassroomAttendancesQuerySchema.parse(req.query);
    const attendances = await this.classroomManagementService.getAttendances({ schoolId, classroomId, query });
    res.status(200).json({
      message: 'Attendances fetched successfully',
      data: attendances,
    });
  };
}
