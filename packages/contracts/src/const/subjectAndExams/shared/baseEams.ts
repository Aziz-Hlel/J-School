import type { BaseSubjectsKeys, InitExamsPerSubjectType } from '../type';

export const baseExams = {
  arabic: [
    {
      name: {
        en: 'Communication et Mémorisation',
        fr: 'Communication et Mémorisation',
        ar: 'التواصل الشفوي والمحفوظات',
      },
      durationInMin: 30,
    },
    {
      name: {
        en: 'Comprehension de l’écrit',
        fr: 'Comprehension de l’écrit',
        ar: 'القراءة',
      },
      durationInMin: 90,
    },
    {
      name: {
        en: 'Grammaire et Lexique',
        fr: 'Grammaire et Lexique',
        ar: 'قواعد اللغة',
      },
      durationInMin: 30,
    },
    {
      name: {
        en: 'Production Écrite',
        fr: 'Production Écrite',
        ar: 'الإنتاج الكتابي',
      },
      durationInMin: 90,
    },
  ],
  french: [
    {
      name: {
        en: 'Expression Orale et Écrite',
        fr: 'Exp.or. et réc.',
        ar: 'التعبير الشفوي والكتابي',
      },
      durationInMin: 60,
    },
    {
      name: {
        en: 'Comprehension de l’écrit',
        fr: 'lecture',
        ar: 'القراءة',
      },
      durationInMin: 90,
    },
    {
      name: {
        en: 'Comprehension et Production Écrite,Grammaire et Lexique,Dictée',
        fr: 'Prod . écrite,langue et dict.',
        ar: 'فهم المنطوق والإنتاج الكتابي، قواعد اللغة، الإملاء',
      },
      durationInMin: 120,
    },
  ],
  english: [
    {
      name: {
        en: 'English',
        fr: 'Anglais',
        ar: 'اللّغة الإنقليرية',
      },
      durationInMin: 60,
    },
  ],
  math: [
    {
      name: {
        en: 'Math',
        fr: 'Mathématiques',
        ar: 'الرّياضيّات',
      },
      durationInMin: 60,
    },
  ],
  science: [
    {
      name: {
        en: 'Sciences',
        fr: 'Sciences',
        ar: 'الايقاظ العلمي',
      },
      durationInMin: 60,
    },
  ],
  technology: [
    {
      name: {
        en: 'Technology',
        fr: 'Technologie',
        ar: 'ت . التكنولوجيّة',
      },
      durationInMin: 60,
    },
  ],
  islam: [
    {
      name: {
        en: 'Islam',
        fr: 'Islam',
        ar: 'التربية الإسلاميّة',
      },
      durationInMin: 60,
    },
  ],
  history: [
    {
      name: {
        en: 'History',
        fr: 'Histoire',
        ar: 'التّاريخ',
      },
      durationInMin: 60,
    },
  ],
  geography: [
    {
      name: {
        en: 'Geography',
        fr: 'Géographie',
        ar: 'الجغرافيا',
      },
      durationInMin: 60,
    },
  ],
  civic: [
    {
      name: {
        en: 'Civic',
        fr: 'Éducation Civique',
        ar: 'التّربية المدنيّة',
      },
      durationInMin: 60,
    },
  ],
  drawing: [
    {
      name: {
        en: 'Drawing',
        fr: 'Éducation Plastique',
        ar: 'التّربية التّشكيليّة',
      },
      durationInMin: 60,
    },
  ],
  music: [
    {
      name: {
        en: 'Music',
        fr: 'Éducation Musicale',
        ar: 'التّربية الموسيقيّة',
      },
      durationInMin: 60,
    },
  ],
  sport: [
    {
      name: {
        en: 'Sport',
        fr: 'Éducation Physique et Sportive',
        ar: 'التّربية البدنيّة',
      },
      durationInMin: 60,
    },
  ],
} as const satisfies Record<BaseSubjectsKeys, InitExamsPerSubjectType>;
