import z from 'zod';
import { commonStringSchema } from '../utils/commonStringSchema';

export const CreateSchoolRequestSchema = z.object({
  nameEn: commonStringSchema({ fieldName: 'nameEn' }),
  nameFr: z.string().trim().min(3).max(255),
  nameAr: z.string().trim().min(3).max(255),
  email: z.email(),
  address: z.string().trim().min(3).max(255).nullable(),
  phone: z.string().trim().min(7).max(20),
  logoId: z.uuid().nullable(),
  website: z.url().nullable(),
  description: z.string().trim().max(255).nullable(),
});

export type CreateSchoolRequest = z.infer<typeof CreateSchoolRequestSchema>;
