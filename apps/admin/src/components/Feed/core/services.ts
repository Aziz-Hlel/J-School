import { studentService } from '@/api/service/studentService';
import { updateStaffRequestSchema } from '@repo/contracts/schemas/staff/updateStaffRequest';
import { createStudentRequestSchema } from '@repo/contracts/schemas/student/createStudentRequest';
import type { updateStudentRequestSchema } from '@repo/contracts/schemas/student/updateStudentRequest';
import type { z } from 'zod';
import { TableData } from './core';
import { defaultQuery, queryParamsSchema, type TableRowType } from './types';

export type schemasType = {
  create: z.infer<typeof createStudentRequestSchema>;
  update: z.infer<typeof updateStudentRequestSchema>;
  delete: typeof studentService.delete;
  getPage: typeof studentService.getPage;
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
  fn: studentService.create,
  schema: createStudentRequestSchema,
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
      role: 'MANAGER' as const,
      address: '',
      password: '',
      cin: '',
    };
  },
});

const update = defineOperation({
  fn: studentService.update,
  schema: updateStaffRequestSchema,
  mutationKey: () => [TableData.MODULE_NAME, 'update'],
  defaultValues: (moduleInstance: TableRowType) => ({
    firstName: moduleInstance.firstName,
    lastName: moduleInstance.lastName,
    gender: moduleInstance.gender,
    dateOfBirth: moduleInstance.dateOfBirth,
    role: moduleInstance.roles,
    address: moduleInstance.address,
    cin: moduleInstance.cin,
    phone: moduleInstance.phone,
  }),
});

const deleteOperation = {
  fn: studentService.delete,
  mutationKey: () => [TableData.MODULE_NAME, 'delete'],
};

const getPage = defineOperation({
  fn: studentService.getPage,
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
