const studentFullDetailsInclude = {
  profile: true,
  avatar: true,
  classroom: {
    select: {
      id: true,
      name: true,
      description: true,
      grade: true,
      createdAt: true,
      updatedAt: true,
      schoolId: true,
      assignments: {
        select: {
          id: true,
          subject: {
            select: {
              id: true,
              name_ar: true,
              name_en: true,
              name_fr: true,
              domain: true,
            },
          },
          teacher: {
            select: {
              id: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  gender: true,
                  account: {
                    select: { avatar: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  parents: {
    select: {
      parent: {
        include: {
          user: {
            include: {
              account: {
                select: { avatar: true },
              },
            },
          },
        },
      },
    },
  },
};
export default studentFullDetailsInclude;
