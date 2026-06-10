import { classroomsService } from '@/api/service/classroomsService';
import { createClassroomReqSchema } from '@repo/contracts/schemas/classroom/createClassRequest';
import { updateClassroomReqSchema } from '@repo/contracts/schemas/classroom/updateClassRequest';
import { ClassGrade } from '@repo/contracts/types/enums/enums';
import { type z } from 'zod';
import { TableData } from './core';
import { defaultQuery, queryParamsSchema, type TableRowType } from './types';

export type schemasType = {
  create: z.infer<typeof createClassroomReqSchema>;
  update: z.infer<typeof updateClassroomReqSchema>;
  delete: typeof classroomsService.delete;
  getPage: typeof classroomsService.getPage;
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
  fn: classroomsService.create,
  schema: createClassroomReqSchema,
  mutationKey: () => [TableData.MODULE_NAME, 'create'],
  defaultValues: () => {
    return {
      name: '',
      description: null,
      grade: ClassGrade.KG,
    };
  },
});

const update = defineOperation({
  fn: classroomsService.update,
  schema: updateClassroomReqSchema,
  mutationKey: () => [TableData.MODULE_NAME, 'update'],
  defaultValues: (moduleInstance: TableRowType) => ({
    name: moduleInstance.name,
    description: moduleInstance.description,
  }),
});

const deleteOperation = {
  fn: classroomsService.delete,
  mutationKey: () => [TableData.MODULE_NAME, 'delete'],
};

const getPage = defineOperation({
  fn: classroomsService.getPage,
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
