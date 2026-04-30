import { MediaDelegate } from '@repo/db/prisma/models';
import { DefaultArgs } from '@prisma/client/runtime/client';

export type MediaTransaction = MediaDelegate<DefaultArgs, { omit: undefined }>;
