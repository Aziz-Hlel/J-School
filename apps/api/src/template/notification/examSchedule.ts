export const examScheduleNotification = {
  title: () => {
    return {
      en: 'An exam has been set',
      ar: 'تم وضع امتحان جديد',
      fr: 'Un examen a été fixé',
    };
  },
  content: (params: { examNames?: { en: string; ar: string; fr: string } }) => {
    return {
      en: params.examNames?.en ? `${params.examNames.en} has been set` : 'An exam has been set',
      ar: params.examNames?.ar ? `${params.examNames.ar} تم وضع` : 'تم وضع امتحان جديد',
      fr: params.examNames?.fr ? `L'examen ${params.examNames.fr} a été fixé` : 'Un examen a été fixé',
    };
  },
};
