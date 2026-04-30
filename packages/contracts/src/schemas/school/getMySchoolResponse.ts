import type { SchoolStatus } from '../../types/enums/enums';
import type { MediaResponse } from '../media/MediaResponse';

export type GetMySchoolResponse = {
  id: string;
  nameEn: string;
  nameAr: string;
  nameFr: string;
  slug: string;
  logo: MediaResponse | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  description: string | null;
  status: SchoolStatus;
  createdAt: string;
  updatedAt: string;
};
