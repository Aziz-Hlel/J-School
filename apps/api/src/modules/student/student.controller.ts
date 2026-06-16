import getUrlParam from '@/utils/getUrlParam';
import { feesQueryParams } from '@repo/contracts/schemas/Fees/findByStudentIdQueryParam';
import { createStudentRequestSchema } from '@repo/contracts/schemas/student/createStudentRequest';
import { studentAttendanceQueryParamSchema } from '@repo/contracts/schemas/student/getAttendances';
import { studentsQueryParams } from '@repo/contracts/schemas/student/getStudentsQueryParams';
import { studentWeeklyAttendanceQueryParamSchema } from '@repo/contracts/schemas/student/getWeeklyAttendances';
import { updateStudentRequestSchema } from '@repo/contracts/schemas/student/updateStudentRequest';
import { createStudentWithParentSchema } from '@repo/contracts/schemas/student/withParent/createWithParent';
import { teacherCommentsQueryParams } from '@repo/contracts/schemas/TeacherComments/queryParams';
import type { Request, Response } from 'express';
import { StudentService } from './student.service';
import { CreateStudentWithParentUseCase } from './use-case/createStudentWithParent';

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
    const { isAccountExist } = await this.createStudentWithParentUseCase.execute({ input, schoolId });
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

  getExtraCurricular = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const studentId = getUrlParam(req, 'studentId', { uuid: true });
    const response = await this.studentService.getExtraCurricular({ schoolId, studentId });
    res.status(200).json({
      message: 'Extra curricular found successfully',
      data: response,
    });
  };

  findAll = async (req: Request, res: Response) => {
    console.log('query : ', req.query);
    const query = studentsQueryParams.schema.parse(req.query);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const pageResponse = await this.studentService.findAll({ query, schoolId });
    res.status(200).json({
      message: 'Students found successfully',
      ...pageResponse,
    });
  };

  getAttendances = async (req: Request, res: Response) => {
    const query = studentAttendanceQueryParamSchema.parse(req.query);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const studentId = getUrlParam(req, 'studentId', { uuid: true });
    const response = await this.studentService.findAttendances({ query, schoolId, studentId });
    res.status(200).json({
      message: 'Student attendances found successfully',
      data: response,
    });
  };

  getWeeklyAttendances = async (req: Request, res: Response) => {
    const query = studentWeeklyAttendanceQueryParamSchema.parse(req.query);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const studentId = getUrlParam(req, 'studentId', { uuid: true });
    const response = await this.studentService.findWeeklyAttendances({ query, schoolId, studentId });
    res.status(200).json({
      message: 'Student weekly attendances found successfully',
      data: response,
    });
  };

  findFees = async (req: Request, res: Response) => {
    const query = feesQueryParams.schema.parse(req.query);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const studentId = getUrlParam(req, 'studentId', { uuid: true });
    const response = await this.studentService.findFees({ query, schoolId, studentId });
    res.status(200).json({
      message: 'Student fees found successfully',
      ...response,
    });
  };

  findTeacherComments = async (req: Request, res: Response) => {
    const query = teacherCommentsQueryParams.schema.parse(req.query);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const studentId = getUrlParam(req, 'studentId', { uuid: true });
    const response = await this.studentService.findAllComments({ query, schoolId, studentId });
    res.status(200).json({
      message: 'Student comments found successfully',
      ...response,
    });
  };
}
