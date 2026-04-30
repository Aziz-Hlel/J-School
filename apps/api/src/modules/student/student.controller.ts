import { createStudentRequestSchema } from '@repo/contracts/schemas/student/createStudentRequest';
import { StudentService } from './student.service';
import { Request, Response } from 'express';
import getUrlParam from '@/utils/getUrlParam';
import { updateStudentRequestSchema } from '@repo/contracts/schemas/student/updateStudentRequest';
import { CreateStudentWithParentUseCase } from './use-case/createStudentWithParent';
import { createStudentWithParentSchema } from '@repo/contracts/schemas/student/withParent/createWithParent';

export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly createStudentWithParentUseCase: CreateStudentWithParentUseCase,
  ) {}

  create = async (req: Request, res: Response) => {
    const input = createStudentRequestSchema.parse(req.body);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const response = await this.studentService.create({ input, schoolId });
    res.status(201).json({
      message: 'Student created successfully',
      data: response,
    });
  };

  createWithParent = async (req: Request, res: Response) => {
    const input = createStudentWithParentSchema.parse(req.body);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const { student, isAccountExist } = await this.createStudentWithParentUseCase.execute({ input, schoolId });
    res.status(201).json({
      message: 'Student created successfully',
      isAccountExist,
    });
  };

  update = async (req: Request, res: Response) => {
    const input = updateStudentRequestSchema.parse(req.body);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const studentId = getUrlParam(req, 'studentId', { uuid: true });
    const response = await this.studentService.update({ input, schoolId, studentId });
    res.status(200).json({
      message: 'Student updated successfully',
      data: response,
    });
  };

  findById = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const studentId = getUrlParam(req, 'studentId', { uuid: true });
    const response = await this.studentService.findById({ schoolId, studentId });
    res.status(200).json({
      message: 'Student found successfully',
      data: response,
    });
  };
}
