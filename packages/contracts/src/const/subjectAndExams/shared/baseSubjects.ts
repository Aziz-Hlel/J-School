import { SubjectDomain } from '../../../types/enums/enums';
import type { BaseSubjectsKeys, InitSubjectsPerGradeType } from '../type';

export const baseSubjects = {
  arabic: {
    name: {
      en: 'Arabic',
      fr: 'Arabe',
      ar: 'العربية',
    },
    domain: SubjectDomain.ARABIC_LANGUAGE,
  },
  french: {
    name: {
      en: 'French',
      fr: 'Français',
      ar: 'الفرنسية',
    },
    domain: SubjectDomain.FRENCH_LANGUAGE,
  },
  english: {
    name: {
      en: 'English',
      fr: 'Anglais',
      ar: 'الإنجليزية',
    },
    domain: SubjectDomain.ENGLISH_LANGUAGE,
  },
  math: {
    name: {
      en: 'Math',
      fr: 'Mathématiques',
      ar: 'الرياضيات',
    },
    domain: SubjectDomain.SCIENCE_TECHNOLOGY,
  },
  science: {
    name: {
      en: 'Science',
      fr: 'Sciences',
      ar: 'العلوم',
    },
    domain: SubjectDomain.SCIENCE_TECHNOLOGY,
  },
  technology: {
    name: {
      en: 'Technology',
      fr: 'Technologie',
      ar: 'ت . التكنولوجيّة',
    },
    domain: SubjectDomain.SCIENCE_TECHNOLOGY,
  },
  islam: {
    name: {
      en: 'Islamic Education',
      fr: 'Éducation Islamique',
      ar: 'ت . الإسلاميّة',
    },
    domain: SubjectDomain.SOCIAL_EDUCATION,
  },
  history: {
    name: {
      en: 'History',
      fr: 'Histoire',
      ar: 'التاريخ',
    },
    domain: SubjectDomain.SOCIAL_EDUCATION,
  },
  geography: {
    name: {
      en: 'Geography',
      fr: 'Géographie',
      ar: 'الجغرافيا',
    },
    domain: SubjectDomain.SOCIAL_EDUCATION,
  },
  civic: {
    name: {
      en: 'Civic Education',
      fr: 'Éducation Civique',
      ar: 'ت . المدنية',
    },
    domain: SubjectDomain.SOCIAL_EDUCATION,
  },
  drawing: {
    name: {
      en: 'Drawing',
      fr: 'Dessin',
      ar: 'الرسم',
    },
    domain: SubjectDomain.SOCIAL_EDUCATION,
  },
  music: {
    name: {
      en: 'Music',
      fr: 'Musique',
      ar: 'الموسيقى',
    },
    domain: SubjectDomain.SOCIAL_EDUCATION,
  },
  sport: {
    name: {
      en: 'Sport',
      fr: 'Sport',
      ar: 'تربية بدنيّة',
    },
    domain: SubjectDomain.SOCIAL_EDUCATION,
  },
} as const satisfies Record<BaseSubjectsKeys, Omit<InitSubjectsPerGradeType, 'hoursPerWeek'>>;
