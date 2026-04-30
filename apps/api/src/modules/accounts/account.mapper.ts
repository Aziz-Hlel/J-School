import { Account, UserRole } from '@repo/db/prisma/client';
import { AccountGetPayload } from '@repo/db/prisma/models';
import { globalMediaService } from '@/media/media.service';
import { AccountEntityRequest, accountInclude } from '@/types/includes/account';
import { AccountResponse } from '@repo/contracts/schemas/account/accountResponse';
import {
  AdministrationRole,
  administrationRolesSet,
  AdministrationWorkspace,
  AuthResponse,
  ParentWorkspace,
} from '@repo/contracts/schemas/auth/authResponse';
import { MediaResponse } from '@repo/contracts/schemas/media/MediaResponse';

export class AccountMapper {
  static toResponseWithAvatar(account: AccountGetPayload<{ include: { avatar: true } }>): AccountResponse {
    const avatar = globalMediaService.generateMediaResponse(account.avatar);
    return {
      id: account.id,
      authId: account.authId,
      email: account.email,
      avatar: avatar,
      role: account.role,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    };
  }

  static toAccountDetails({
    account,
    avatar,
  }: {
    account: AccountGetPayload<{ include: typeof accountInclude }>;
    avatar: MediaResponse | null;
  }): AccountResponse {
    return {
      id: account.id,
      authId: account.authId,
      email: account.email,
      avatar: avatar,
      role: account.role,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    };
  }

  static toNewAccountResponse({ account }: { account: Account }): AuthResponse {
    return {
      account: {
        id: account.id,
        authId: account.authId,
        email: account.email,
        avatar: null,
        role: account.role,
        createdAt: account.createdAt.toISOString(),
        updatedAt: account.updatedAt.toISOString(),
      },
      administration: [],
      teacher: [],
      parent: [],
    };
  }

  static toAdministrationWorkspace({
    user,
    role,
  }: {
    user: AccountEntityRequest['users'][0];
    role: AdministrationRole;
  }): AdministrationWorkspace {
    return {
      id: user.id,
      userId: user.id as any, // ! just add it to bypass compilation eror look into it afterwards
      firstName: user.firstName,
      lastName: user.lastName,
      school: {
        id: user.school.id,
        slug: user.school.slug,
        names: {
          en: user.school.nameEn,
          fr: user.school.nameFr,
          ar: user.school.nameAr,
        },
        role: role,
      },
    };
  }

  static toParentWorkspace({
    user,
    student,
  }: {
    user: AccountEntityRequest['users'][0];
    student: ParentWorkspace['student'];
  }): ParentWorkspace {
    return {
      id: user.parent?.id as any, // ! just add it to bypass compilation eror look into it afterwards
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      student,
    };
  }

  static toAuthResponse({
    account,
    avatar,
  }: {
    account: AccountEntityRequest;
    avatar: MediaResponse | null;
  }): AuthResponse {
    const administrationWorkspaces: AuthResponse['administration'] = [];
    const teacherWorkspaces: AuthResponse['teacher'] = [];
    const parentWorkspaces: AuthResponse['parent'] = [];

    if (account.owner) {
      administrationWorkspaces.push({
        id: account.owner.id,
        firstName: account.owner.firstName,
        lastName: account.owner.lastName,
        school: account.owner.school
          ? {
              id: account.owner.school.id,
              slug: account.owner.school.slug,
              names: {
                en: account.owner.school.nameEn,
                fr: account.owner.school.nameFr,
                ar: account.owner.school.nameAr,
              },
              role: 'OWNER',
            }
          : null,
      });
    }
    account.users.forEach((user) => {
      user.roles.forEach((role) => {
        switch (role.role) {
          case UserRole.DIRECTOR:
          case UserRole.MANAGER:
          case UserRole.NURSE:
          case UserRole.DRIVER:
            administrationWorkspaces.push(
              this.toAdministrationWorkspace({
                user,
                role: role.role as AdministrationRole,
              }),
            );
            break;
          case UserRole.TEACHER:
            teacherWorkspaces.push({
              id: user.teacher?.id as any, // ! just add it to bypass compilation eror look into it afterwards
              userId: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              school: {
                id: user.school.id,
                slug: user.school.slug,
                names: {
                  en: user.school.nameEn,
                  fr: user.school.nameFr,
                  ar: user.school.nameAr,
                },
              },
            });
            break;
          case UserRole.PARENT:
            user.parent?.students.forEach((student) => {
              parentWorkspaces.push(
                this.toParentWorkspace({
                  user,
                  student: {
                    id: student.id,
                    firstName: student.student.firstName_en as any, // ! just add it to bypass compilation eror look into it afterwards
                    lastName: student.student.lastName_en as any, // ! just add it to bypass compilation eror look into it afterwards
                  },
                }),
              );
            });
            break;
        }

        if (administrationRolesSet.has(role.role as AdministrationRole)) {
          administrationWorkspaces.push({
            id: user.id,
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            school: {
              id: user.school.id,
              slug: user.school.slug,
              names: {
                en: user.school.nameEn,
                fr: user.school.nameFr,
                ar: user.school.nameAr,
              },
              role: role.role as AdministrationRole,
            },
          });
        }
      });
    });

    const accountResponse = this.toAccountDetails({ account, avatar });
    return {
      account: accountResponse,
      administration: administrationWorkspaces,
      teacher: teacherWorkspaces,
      parent: parentWorkspaces,
    };
  }
}
