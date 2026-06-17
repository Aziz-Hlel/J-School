import prisma from '@repo/db';

export class PostSeed {
  constructor() {}

  run = async (params: {
    schoolId: string;
    content: string;
    mediaIds: string[];
    extraCurricularId: string;
    id: string;
  }) => {
    const { schoolId, content, mediaIds, extraCurricularId, id } = params;

    await prisma.post.upsert({
      where: {
        id,
      },
      update: {
        content,
        media: {
          set: mediaIds.map((id) => ({ id })),
        },
      },
      create: {
        id,
        schoolId,
        content,
        media: {
          connect: mediaIds.map((id) => ({ id })),
        },
        extraCurricularId,
      },
    });

    // const
  };
}
