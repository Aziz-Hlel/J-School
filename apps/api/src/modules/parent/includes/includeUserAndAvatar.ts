const includeUserAndAvatar = {
  user: {
    include: {
      account: {
        include: {
          avatar: true,
        },
      },
    },
  },
};

export default includeUserAndAvatar;
