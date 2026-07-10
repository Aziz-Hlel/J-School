import { homeworkService } from '@/api/service/homeworkService';
import { createHomeworkReqSchema } from '@repo/contracts/schemas/Homework/create';
import { updateHomeworkReqSchema } from '@repo/contracts/schemas/Homework/update';
import { updateStaffRequestSchema } from '@repo/contracts/schemas/staff/updateStaffRequest';
import { Gender, UserRole } from '@repo/contracts/types/enums/enums';
import type { z } from 'zod';
import { TableData } from './core';
import { defaultQuery, queryParamsSchema, type TableRowType } from './types';
import { staffService } from '@/api/service/staffService';

export type schemasType = {
  create: z.infer<typeof createHomeworkReqSchema>;
  update: z.infer<typeof updateHomeworkReqSchema>;
  delete: typeof homeworkService.delete;
  getPage: typeof homeworkService.getPage;
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
  fn: staffService.create,
  schema: createHomeworkReqSchema,
  mutationKey: () => [TableData.MODULE_NAME, 'create'],
  defaultValues: () => {
    return {
      firstName: '',
      lastName: '',
      gender: Gender.MALE,
      dateOfBirth: null,
      phone: null,
      cin: null,
      address: null,
      email: '',
      password: '',
      role: UserRole.MANAGER,
      avatarId: null,
    };
  },
});

const update = defineOperation({
  fn: staffService.update,
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
    avatarId: moduleInstance.avatar?.id ?? null,
  }),
});

const deleteOperation = {
  fn: homeworkService.delete,
  mutationKey: () => [TableData.MODULE_NAME, 'delete'],
};

const getPage = defineOperation({
  fn: homeworkService.getPage,
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
