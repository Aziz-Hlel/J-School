import { extraCurricularService } from '@/api/service/extracurricularsService';
import { createExtraCurricularRequestSchema } from '@repo/contracts/schemas/extraCurricular/createExtraCurricularRequest';
import { updateExtraCurricularReqSchema } from '@repo/contracts/schemas/extraCurricular/updateExtraCurricularReq';
import { SessionType } from '@repo/contracts/types/enums/enums';
import type { z } from 'zod';
import { TableData } from './core';
import { defaultQuery, queryParamsSchema, type TableRowType } from './types';

export type schemasType = {
  create: z.infer<typeof createExtraCurricularRequestSchema>;
  update: z.infer<typeof updateExtraCurricularReqSchema>;
  delete: typeof extraCurricularService.delete;
  getPage: typeof extraCurricularService.getPage;
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
  fn: extraCurricularService.create,
  schema: createExtraCurricularRequestSchema,
  mutationKey: () => [TableData.MODULE_NAME, 'create'],
  defaultValues: undefined,
});

const update = defineOperation({
  fn: extraCurricularService.update,
  schema: updateExtraCurricularReqSchema,
  mutationKey: () => [TableData.MODULE_NAME, 'update'],
  defaultValues: (moduleInstance: TableRowType) => ({
    title: {
      en: moduleInstance.title.en,
      fr: moduleInstance.title.fr,
      ar: moduleInstance.title.ar,
    },
    teacherId: moduleInstance.teacher?.id ?? null,
    type: moduleInstance.session.type,
    ...(moduleInstance.session.type === SessionType.WEEKLY
      ? {
          dayOfWeek: moduleInstance.session.day,
          startTime: moduleInstance.session.startTime,
          endTime: moduleInstance.session.endTime,
        }
      : {
          date: moduleInstance.session.date,
        }),
  }),
});

const deleteOperation = {
  fn: extraCurricularService.delete,
  mutationKey: () => [TableData.MODULE_NAME, 'delete'],
};

const getPage = defineOperation({
  fn: extraCurricularService.getPage,
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
