import z from 'zod';
import { updateSimpleUserRequestSchema } from '../user/updateSimpleUserRequest';

export const updateParentReqSchema = updateSimpleUserRequestSchema;

export type UpdateParentRequest = z.infer<typeof updateParentReqSchema>;
