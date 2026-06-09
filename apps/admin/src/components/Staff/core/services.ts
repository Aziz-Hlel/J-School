import { staffService } from '@/api/service/staffService';
import { createStaffRequestSchema } from '@repo/contracts/schemas/staff/createStaffRequest';
import { updateStaffRequestSchema } from '@repo/contracts/schemas/staff/updateStaffRequest';
import type { z } from 'zod';
import { TableData } from './core';
import { defaultQuery, queryParamsSchema, type TableRowType } from './types';

export type schemasType = {
  create: z.infer<typeof createStaffRequestSchema>;
  update: z.infer<typeof updateStaffRequestSchema>;
  delete: typeof staffService.delete;
  getPage: typeof staffService.getPage;
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
  }),
});

const deleteOperation = {
  fn: staffService.delete,
  mutationKey: () => [TableData.MODULE_NAME, 'delete'],
};

const getPage = defineOperation({
  fn: staffService.getPage,
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
