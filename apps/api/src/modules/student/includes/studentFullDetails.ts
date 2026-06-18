const studentFullDetailsInclude = {
  profile: true,
  classroom: true,
  avatar: true,
  parents: {
    include: {
      parent: {
        include: {
          user: {
            include: {
              account: {
                include: { avatar: true },
              },
            },
          },
        },
      },
    },
  },
};
export default studentFullDetailsInclude;
