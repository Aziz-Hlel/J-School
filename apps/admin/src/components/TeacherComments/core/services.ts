import { staffService } from '@/api/service/staffService';
import { teacherCommentsService } from '@/api/service/teacherCommentsService';
import { createStaffRequestSchema } from '@repo/contracts/schemas/staff/createStaffRequest';
import { updateStaffRequestSchema } from '@repo/contracts/schemas/staff/updateStaffRequest';
import { Gender, UserRole } from '@repo/contracts/types/enums/enums';
import type { z } from 'zod';
import { TableData } from './core';
import { defaultQuery, queryParamsSchema, type TableRowType } from './types';

export type schemasType = {
  create: z.infer<typeof createStaffRequestSchema>;
  update: z.infer<typeof updateStaffRequestSchema>;
  delete: typeof teacherCommentsService.delete;
  getPage: typeof teacherCommentsService.getPage;
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
  schema: createStaffRequestSchema,
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
  defaultValues: (moduleInstance: TableRowType) => ({}),
});

const deleteOperation = {
  fn: teacherCommentsService.delete,
  mutationKey: () => [TableData.MODULE_NAME, 'delete'],
};

const getPage = defineOperation({
  fn: teacherCommentsService.getPage,
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
