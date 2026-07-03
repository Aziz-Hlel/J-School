import { teacherService } from '@/api/service/teachersService';
import { updateStaffRequestSchema } from '@repo/contracts/schemas/staff/updateStaffRequest';
import { createTeacherRequestSchema } from '@repo/contracts/schemas/teacher/createTeacherRequest';
import { updateTeacherRequestSchema } from '@repo/contracts/schemas/teacher/updateTeacherRequest';
import type { z } from 'zod';
import { TableData } from './core';
import { defaultQuery, queryParamsSchema, type TableRowType } from './types';

export type schemasType = {
  create: z.infer<typeof createTeacherRequestSchema>;
  update: z.infer<typeof updateTeacherRequestSchema>;
  delete: typeof teacherService.delete;
  getPage: typeof teacherService.getPage;
};

function defineOperation<TSchema extends z.ZodType, TFn, T, K>(config: {
  fn: TFn;
  schema: TSchema;
  mutationKey: (arg: K) => string[];
  defaultValues: (params: T) => z.infer<TSchema>;
}) {
  return config;
}

const create = defineOperation({
  fn: teacherService.create,
  schema: createTeacherRequestSchema,
  mutationKey: () => [TableData.MODULE_NAME, 'create'],
  defaultValues: () => {
    return {
      email: '',
      name: '',
      phone: '',
      firstName: '',
      lastName: '',
      gender: 'MALE' as const,
      dateOfBirth: null,
      address: '',
      password: '',
      cin: '',
    };
  },
});

const update = defineOperation({
  fn: teacherService.update,
  schema: updateStaffRequestSchema,
  mutationKey: () => [TableData.MODULE_NAME, 'update'],
  defaultValues: (moduleInstance: TableRowType) => ({
    firstName: moduleInstance.firstName,
    lastName: moduleInstance.lastName,
    gender: moduleInstance.gender,
    dateOfBirth: moduleInstance.dateOfBirth,
    address: moduleInstance.address,
    avatarId: moduleInstance.avatar?.id || null,
    cin: moduleInstance.cin,
    phone: moduleInstance.phone,
  }),
});

const deleteOperation = {
  fn: teacherService.delete,
  mutationKey: () => [TableData.MODULE_NAME, 'delete'],
};

const getPage = defineOperation({
  fn: teacherService.getPage,
  mutationKey: () => [TableData.MODULE_NAME, 'getPage'],
  schema: queryParamsSchema,
  defaultValues: () => defaultQuery,
});

type OperationsReqFields = {
  [x: string]: {
    mutationKey: (...args: unknown[]) => string[];
  };
};

export const operations = {
  create: create,
  update: update,
  delete: deleteOperation,
  getPage: getPage,
} as const satisfies OperationsReqFields;
