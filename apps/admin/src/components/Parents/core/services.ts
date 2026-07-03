import { parentService } from '@/api/service/parentService';
import { createParentRequestSchema } from '@repo/contracts/schemas/parent/createParentRequest';
import { updateParentReqSchema } from '@repo/contracts/schemas/parent/updateParentRequest';
import { Gender } from '@repo/contracts/types/enums/enums';
import type { z } from 'zod';
import { TableData } from './core';
import { defaultQuery, queryParamsSchema, type TableRowType } from './types';

export type schemasType = {
  create: z.infer<typeof createParentRequestSchema>;
  update: z.infer<typeof updateParentReqSchema>;
  delete: typeof parentService.delete;
  getPage: typeof parentService.getPage;
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
  fn: parentService.create,
  schema: createParentRequestSchema,
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
      avatarId: null,
    };
  },
});

const update = defineOperation({
  fn: parentService.update,
  schema: updateParentReqSchema,
  mutationKey: () => [TableData.MODULE_NAME, 'update'],
  defaultValues: (moduleInstance: TableRowType) => ({
    firstName: moduleInstance.firstName,
    lastName: moduleInstance.lastName,
    gender: moduleInstance.gender,
    dateOfBirth: moduleInstance.dateOfBirth,
    address: moduleInstance.address,
    cin: moduleInstance.cin,
    phone: moduleInstance.phone,
    avatarId: moduleInstance.avatar?.id ?? null,
  }),
});

const deleteOperation = {
  fn: parentService.delete,
  mutationKey: () => [TableData.MODULE_NAME, 'delete'],
};

const getPage = defineOperation({
  fn: parentService.getPage,
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
