import getUrlParam from '@/utils/getUrlParam';
import { myCommentsQueryParams } from '@repo/contracts/schemas/teacher/commentsQueryParams';
import { createTeacherRequestSchema } from '@repo/contracts/schemas/teacher/createTeacherRequest';
import { getTeacherTimetableQuery } from '@repo/contracts/schemas/teacher/getTimetableQuery';
import { teacherHomeworkQueryParams } from '@repo/contracts/schemas/teacher/homeworQueryParams';
import { teacherQueryParams } from '@repo/contracts/schemas/teacher/teacherQueryParams';
import { updateTeacherRequestSchema } from '@repo/contracts/schemas/teacher/updateTeacherRequest';
import { Request, Response } from 'express';
import { TeacherService } from './teacher.service';
import { CreateTeacherUseCase } from './use-cases/createTeacher.use-case';

export class TeacherController {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly createTeacherUseCase: CreateTeacherUseCase,
  ) {}

  create = async (req: Request, res: Response) => {
    const input = createTeacherRequestSchema.parse(req.body);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const { teacher, isAccountExist } = await this.createTeacherUseCase.execute({ input, schoolId });
    res.status(201).json({
      message: 'Teacher created successfully',
      data: {
        id: teacher.id,
      },
      accountExists: isAccountExist,
    });
  };

  findById = async (req: Request, res: Response) => {
    const teacherId = getUrlParam(req, 'teacherId', { uuid: true });
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const teacher = await this.teacherService.getById(teacherId, schoolId);
    res.status(200).json({
      message: 'Teacher fetched successfully',
      data: teacher,
    });
  };

  update = async (req: Request, res: Response) => {
    const input = updateTeacherRequestSchema.parse(req.body);
    const teacherId = getUrlParam(req, 'teacherId', { uuid: true });
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const teacher = await this.teacherService.update({ input, teacherId, schoolId });
    res.status(200).json({
      message: 'Teacher updated successfully',
      data: teacher,
    });
  };

  findAll = async (req: Request, res: Response) => {
    const query = teacherQueryParams.schema.parse(req.query);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const response = await this.teacherService.findAll({ query, schoolId });
    res.status(200).json({
      message: 'Teachers fetched successfully',
      ...response,
    });
  };

  getTimetable = async (req: Request, res: Response) => {
    const teacherId = getUrlParam(req, 'teacherId', { uuid: true });
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const query = getTeacherTimetableQuery.parse(req.query);
    const timetable = await this.teacherService.getTimetable({ teacherId, schoolId, query });
    res.status(200).json({
      message: 'Teacher timetable fetched successfully',
      data: timetable,
    });
  };

  getFullTimeTable = async (req: Request, res: Response) => {
    const teacherId = getUrlParam(req, 'teacherId', { uuid: true });
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const timetable = await this.teacherService.getFullTimetable({ teacherId, schoolId });
    res.status(200).json({
      message: 'Teacher timetable fetched successfully',
      data: timetable,
    });
  };

  getExtraCurricularWithSession = async (req: Request, res: Response) => {
    const teacherId = getUrlParam(req, 'teacherId', { uuid: true });
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const query = getTeacherTimetableQuery.parse(req.query);
    const extracurriculars = await this.teacherService.getExtracurricular({ teacherId, schoolId, query });
    res.status(200).json({
      message: 'Teacher extra curricular fetched successfully',
      data: extracurriculars,
    });
  };

  getClassrooms = async (req: Request, res: Response) => {
    const teacherId = getUrlParam(req, 'teacherId', { uuid: true });
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const classrooms = await this.teacherService.getClassrooms({ teacherId, schoolId });
    res.status(200).json({
      message: 'Teacher classrooms fetched successfully',
      data: classrooms,
    });
  };

  getExamSchedule = async (req: Request, res: Response) => {
    const teacherId = getUrlParam(req, 'teacherId', { uuid: true });
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const examSchedules = await this.teacherService.getExamSchedule({ teacherId, schoolId });
    res.status(200).json({
      message: 'Teacher exam schedules fetched successfully',
      data: examSchedules,
    });
  };

  getHomeworks = async (req: Request, res: Response) => {
    const teacherId = getUrlParam(req, 'teacherId', { uuid: true });
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const query = teacherHomeworkQueryParams.schema.parse(req.query);
    const homeworks = await this.teacherService.getHomeworks({ teacherId, schoolId, query });
    res.status(200).json({
      message: 'Teacher homeworks fetched successfully',
      ...homeworks,
    });
  };

  getMyComments = async (req: Request, res: Response) => {
    const teacherId = getUrlParam(req, 'teacherId', { uuid: true });
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const query = myCommentsQueryParams.schema.parse(req.query);
    const comments = await this.teacherService.getComments({ teacherId, schoolId, query });
    res.status(200).json({
      message: 'Teacher comments fetched successfully',
      ...comments,
    });
  };
}
