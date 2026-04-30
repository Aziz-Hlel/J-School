import { UpdateSimpleUserRequest } from '@repo/contracts/schemas/user/updateSimpleUserRequest';
import { UserService } from '../User/user.service';
import { StaffMapper } from './staff.mapper';
import { NotFoundError } from '@/err/service/customErrors';
import { StaffHelper } from './staff.helper';
import { StaffQueryParamsTypes } from '@repo/contracts/schemas/staff/staffQueryParams';
import { Prisma } from '@repo/db/prisma/client';
import { PageMapper } from '@/helper/page.mapper';

export class StaffService {
  constructor(
    private readonly userService: UserService,
    private readonly staffHelper: StaffHelper,
  ) {}

  updateSimpleStaff = async (params: { input: UpdateSimpleUserRequest; staffId: string; schoolId: string }) => {
    const { input, staffId, schoolId } = params;
    const updatedUser = await this.userService.updateSimpleUser({ input, userId: staffId, schoolId });
    return updatedUser;
  };

  findById = async (params: { staffId: string; schoolId: string }) => {
    const { staffId, schoolId } = params;
    const staff = await this.userService.findById(staffId, {
      include: { roles: true, account: true },
    });
    if (!staff) {
      throw new NotFoundError('Staff not found');
    }
    if (staff.schoolId !== schoolId) {
      throw new NotFoundError({
        message: 'Staff not found',
        internalLog: `Staff exists but not in school ${schoolId}`,
      });
    }
    if (!this.staffHelper.isStaff(staff.roles)) {
      throw new NotFoundError({
        message: 'Staff not found',
        internalLog: `Staff exists but not a staff`,
      });
    }

    const staffResponse = StaffMapper.toResponse(staff);
    return staffResponse;
  };

  findAll = async (params: { query: StaffQueryParamsTypes['Query']; schoolId: string }) => {
    const { query, schoolId } = params;

    const skip = (query.page - 1) * query.size;
    const take = query.size;

    const where: Prisma.UserWhereInput = {};

    if (query.search && query.search.trim().length > 0) {
      const searchValue = query.search.trim().toLowerCase();
      where.OR = [
        { firstName: { contains: searchValue, mode: 'insensitive' } },
        { lastName: { contains: searchValue, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.UserOrderByWithRelationInput = {};

    if (query.sortBy) {
      orderBy[query.sortBy] = query.order;
    }

    const staffs = await this.userService.findAllStaff(
      {
        schoolId,
        skip,
        take,
        where,
        orderBy,
      },
      { account: { include: { avatar: true } }, roles: true },
    );

    const data = staffs.content.map(StaffMapper.toResponse);

    const response = PageMapper.toPage({ data, totalElements: staffs.totalElements, pagination: query });

    return response;
  };
}
