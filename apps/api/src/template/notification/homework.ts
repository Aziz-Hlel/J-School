export const homeworkNotification = {
  title: () => {
    return {
      en: 'An homework has been set',
      ar: 'تم وضع واجب جديد',
      fr: 'Un devoir a été fixé',
    };
  },
  content: (params: { subjectNames?: { en: string; ar: string; fr: string } }) => {
    return {
      en: params.subjectNames?.en
        ? `A new homework has been set for the subject ${params.subjectNames.en}`
        : 'A new homework has been set',
      ar: params.subjectNames?.ar ? `تم وضع واجب جديد في مادة ${params.subjectNames.ar}` : 'تم وضع واجب جديد',
      fr: params.subjectNames?.fr
        ? `Un nouveau devoir a été fixé pour la matière ${params.subjectNames.fr}`
        : 'Un nouveau devoir a été fixé',
    };
  },
};
