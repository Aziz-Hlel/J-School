import { UserRole } from '@repo/db/prisma/enums';
import { CreateSimpleUserRequest } from '@repo/contracts/schemas/user/createSimpleUserRequest';

export type CreateUserInput = Omit<CreateSimpleUserRequest, 'role'> & { role: UserRole };
