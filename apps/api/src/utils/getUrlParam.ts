import { BadRequestError } from '@/err/service/customErrors';
import { Request } from 'express';
import capitalize from './capitalize';
import z from 'zod';

const isUUID = (value: string) => {
  return z.uuid().safeParse(value).success;
};

const getUrlParam = (req: Request, param: string, { uuid }: { uuid?: boolean } = { uuid: false }): string => {
  const paramValue = req.params[param];
  if (paramValue === undefined) throw new BadRequestError(`${capitalize(param)} is required in params`);
  if (typeof paramValue !== 'string') throw new BadRequestError(`${capitalize(param)} must be a string`);
  if (uuid && !isUUID(paramValue)) throw new BadRequestError(`Invalid Url Parameter`);

  return paramValue;
};

export default getUrlParam;
