export const StudentError = {
  notFound: {
    code: 'STUDENT_NOT_FOUND',
    message: 'Student not found',
  },

  existsByUid: {
    code: 'STUDENT_EXISTS_BY_UID',
    message: 'Student already exists by uid',
  },
} as const;
