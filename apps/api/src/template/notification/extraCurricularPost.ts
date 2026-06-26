export const extraCurricularPostNotification = {
  title: () => {
    return {
      en: 'A new post has been added',
      ar: 'تم إضافة منشور جديد',
      fr: 'Un nouveau post a été ajouté',
    };
  },
  content: (params: { activityName?: { en: string; ar: string; fr: string } }) => {
    return {
      en: params.activityName?.en
        ? `A new post has been added to the activity ${params.activityName.en}`
        : 'A new post has been added',
      ar: params.activityName?.ar ? `تم إضافة منشور جديد في نشاط ${params.activityName.ar}` : undefined,
      fr: params.activityName?.fr ? `Un nouveau post a été ajouté à l'activité ${params.activityName.fr}` : undefined,
    };
  },
};
