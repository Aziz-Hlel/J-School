import 'react-i18next';

import type assignments from '../../public/locales/en/assignments.json';
import type attendance from '../../public/locales/en/attendance.json';
import type classrooms from '../../public/locales/en/classrooms.json';
import type common from '../../public/locales/en/common.json';
import type enums from '../../public/locales/en/enums.json';
import type exam from '../../public/locales/en/exam.json';
import type extracurriculars from '../../public/locales/en/extracurriculars.json';
import type parents from '../../public/locales/en/parents.json';
import type staff from '../../public/locales/en/staff.json';
import type students from '../../public/locales/en/students.json';
import type teachers from '../../public/locales/en/teachers.json';
import type timetable from '../../public/locales/en/timetable.json';
import type comments from '../../public/locales/en/comments.json';
import type homeworks from '../../public/locales/en/homeworks.json';
import type calendrier from '../../public/locales/en/calendrier.json';
import type feed from '../../public/locales/en/feed.json';
import type sidebar from '../../public/locales/en/sidebar.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      classrooms: typeof classrooms;
      enums: typeof enums;
      staff: typeof staff;
      teachers: typeof teachers; // Assuming teachers.json has the same structure as staff.json
      parents: typeof parents; // Assuming parents.json has the same structure as staff.json
      studentProfile: typeof students; // Assuming studentProfile.json has the same structure as students.json
      assignments: typeof assignments; // Assuming assignments.json has the same structure as common.json
      timetable: typeof timetable; // Assuming timetable.json has the same structure as common.json
      exam: typeof exam;
      attendance: typeof attendance;
      extracurriculars: typeof extracurriculars;
      comments: typeof comments;
      homeworks: typeof homeworks;
      calendrier: typeof calendrier;
      feed: typeof feed;
      sidebar: typeof sidebar;
    };
  }
}
