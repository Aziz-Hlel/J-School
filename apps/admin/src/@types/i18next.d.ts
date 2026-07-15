import 'react-i18next';

import type classrooms from '../../public/locales/en/classrooms.json';
import type common from '../../public/locales/en/common.json';
import type students from '../../public/locales/en/students.json';
import type enums from '../../public/locales/en/enums.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      students: typeof students;
      classrooms: typeof classrooms;
      enums: typeof enums;
    };
  }
}
