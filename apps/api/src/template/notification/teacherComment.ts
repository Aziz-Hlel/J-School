export const teacherCommentNotification = {
  title: () => {
    return {
      en: 'Teacher Comment',
      ar: 'تعليق من المعلم',
      fr: "Commentaire de l'enseignant",
    };
  },
  content: (params: { teacherFullName?: string }) => {
    return {
      en: params?.teacherFullName ? `${params.teacherFullName} sent you a comment` : 'A teacher sent you a comment',
      ar: params?.teacherFullName ? `${params.teacherFullName} أرسل لك تعليقًا` : 'أرسل لك معلم تعليقًا',
      fr: params?.teacherFullName
        ? `${params.teacherFullName} vous a envoyé un commentaire`
        : 'Un enseignant vous a envoyé un commentaire',
    };
  },
};
