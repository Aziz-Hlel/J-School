import ENV from '@/config/env.variables';

export const apiRoutes = {
  baseUrl: () => ENV.BASE_URL,

  health: () => '/health',

  media: {
    presignedUrl: () => '/media/presigned-url' as const,
  },

  auth: {
    signIn: () => '/auth/password',
    signUp: () => '/accounts/admin',
    oAuthSignIn: () => '/auth/provider',
    me: () => '/auth/me',
  },

  schools: {
    create: () => `/schools`,
    selectParent: (schoolId: string) => `/schools/${schoolId}/parents/select`,
    selectClassrooms: (schoolId: string) => `/schools/${schoolId}/classrooms/select`,
  },

  staff: {
    create: (schoolId: string) => `/schools/${schoolId}/staff`,
    update: (schoolId: string, id: string) => `/schools/${schoolId}/staff/${id}`,
    getPage: (schoolId: string) => `/schools/${schoolId}/staff`,
    getById: (schoolId: string, id: string) => `/schools/${schoolId}/staff/${id}`,
    delete: (schoolId: string, id: string) => `/schools/${schoolId}/staff/${id}`,
  },

  student: {
    create: (schoolId: string) => `/schools/${schoolId}/students`,
    update: (schoolId: string, id: string) => `/schools/${schoolId}/students/${id}`,
    updateWithStatus: (schoolId: string, id: string) => `/schools/${schoolId}/students/${id}/with-status`,
    getPage: (schoolId: string) => `/schools/${schoolId}/students`,
    getById: (schoolId: string, id: string) => `/schools/${schoolId}/students/${id}`,
    findFullDetails: (schoolId: string, id: string) => `/schools/${schoolId}/students/${id}/full-details`,
    assignToClassroom: (schoolId: string, id: string) => `/schools/${schoolId}/students/${id}/classroom`,
    delete: (schoolId: string, id: string) => `/schools/${schoolId}/students/${id}`,
    getFees: (schoolId: string, id: string) => `/schools/${schoolId}/students/${id}/fees`,
  },

  teacher: {
    create: (schoolId: string) => `/schools/${schoolId}/teachers`,
    update: (schoolId: string, id: string) => `/schools/${schoolId}/teachers/${id}`,
    getPage: (schoolId: string) => `/schools/${schoolId}/teachers`,
    getById: (schoolId: string, id: string) => `/schools/${schoolId}/teachers/${id}`,
    delete: (schoolId: string, id: string) => `/schools/${schoolId}/teachers/${id}`,
    selectTeacher: (schoolId: string) => `/schools/${schoolId}/teachers/select`,
  },

  parent: {
    create: (schoolId: string) => `/schools/${schoolId}/parents`,
    update: (schoolId: string, id: string) => `/schools/${schoolId}/parents/${id}`,
    getPage: (schoolId: string) => `/schools/${schoolId}/parents`,
    getById: (schoolId: string, id: string) => `/schools/${schoolId}/parents/${id}`,
    delete: (schoolId: string, id: string) => `/schools/${schoolId}/parents/${id}`,
  },

  parentStudent: {
    unassignStudentFromParent: (studentId: string, parentId: string, schoolId: string) =>
      `/schools/${schoolId}/students/${studentId}/parents/${parentId}`,
    assignStudentToParent: (studentId: string, parentId: string, schoolId: string) =>
      `/schools/${schoolId}/students/${studentId}/parents/${parentId}`,
  },

  classrooms: {
    create: (schoolId: string) => `/schools/${schoolId}/classrooms`,
    update: (schoolId: string, id: string) => `/schools/${schoolId}/classrooms/${id}`,
    getPage: (schoolId: string) => `/schools/${schoolId}/classrooms`,
    getById: (schoolId: string, id: string) => `/schools/${schoolId}/classrooms/${id}`,
    delete: (schoolId: string, id: string) => `/schools/${schoolId}/classrooms/${id}`,
    timetable: {
      create: (schoolId: string, classroomId: string) => `/schools/${schoolId}/classrooms/${classroomId}/timetable`,
      getWeekly: (schoolId: string, classroomId: string) =>
        `/schools/${schoolId}/classrooms/${classroomId}/timetable/weekly`,
      delete: (schoolId: string, classroomId: string, timetableId: string) =>
        `/schools/${schoolId}/classrooms/${classroomId}/timetable/${timetableId}`,
    },
    exams: {
      get: (schoolId: string, classroomId: string) => `/schools/${schoolId}/classrooms/${classroomId}/exams`,
      update: (schoolId: string, classroomId: string, examId: string) =>
        `/schools/${schoolId}/classrooms/${classroomId}/exams/${examId}`,
      delete: (schoolId: string, classroomId: string, examId: string) =>
        `/schools/${schoolId}/classrooms/${classroomId}/exams/${examId}`,
      select: (schoolId: string, classroomId: string) => `/schools/${schoolId}/classrooms/${classroomId}/exams/select`,
    },
    subjects: (schoolId: string, classroomId: string) => `/schools/${schoolId}/classrooms/${classroomId}/subjects`,
  },

  assignments: {
    assignTeacher: (schoolId: string, classroomId: string, assignmentId: string) =>
      `/schools/${schoolId}/classrooms/${classroomId}/assignments/${assignmentId}/teacher`,
  },

  examSchedules: {
    create: (schoolId: string) => `/schools/${schoolId}/exam-schedules`,
    update: (schoolId: string, examScheduleId: string) => `/schools/${schoolId}/exam-schedules/${examScheduleId}`,
    delete: (schoolId: string, examScheduleId: string) => `/schools/${schoolId}/exam-schedules/${examScheduleId}`,
  },

  extracurriculars: {
    create: (schoolId: string) => `/schools/${schoolId}/extra-curriculars`,
    update: (schoolId: string, id: string) => `/schools/${schoolId}/extra-curriculars/${id}`,
    delete: (schoolId: string, id: string) => `/schools/${schoolId}/extra-curriculars/${id}`,
    getPage: (schoolId: string) => `/schools/${schoolId}/extra-curriculars`,
    get: (schoolId: string, id: string) => `/schools/${schoolId}/extra-curriculars/${id}`,
    getStudents: (schoolId: string, id: string) => `/schools/${schoolId}/extra-curriculars/${id}/students`,
    post: {
      getCursor: (schoolId: string, id: string) => `/schools/${schoolId}/extra-curriculars/${id}/posts`,
    },
  },
  fees: {
    create: (schoolId: string) => `/schools/${schoolId}/fees`,
    update: (schoolId: string, id: string) => `/schools/${schoolId}/fees/${id}`,
    delete: (schoolId: string, id: string) => `/schools/${schoolId}/fees/${id}`,
    items: {
      create: (schoolId: string, feeId: string) => `/schools/${schoolId}/fees/${feeId}/items`,
      update: (schoolId: string, feeId: string, id: string) => `/schools/${schoolId}/fees/${feeId}/items/${id}`,
      delete: (schoolId: string, feeId: string, id: string) => `/schools/${schoolId}/fees/${feeId}/items/${id}`,
      getAll: (schoolId: string, feeId: string) => `/schools/${schoolId}/fees/${feeId}/items`,
    },
  },

  feed: {
    get: (schoolId: string) => `/schools/${schoolId}/feed`,
    create: (schoolId: string) => `/schools/${schoolId}/feed`,
    update: (schoolId: string, id: string) => `/schools/${schoolId}/feed/${id}`,
    delete: (schoolId: string, id: string) => `/schools/${schoolId}/feed/${id}`,
  },

  calendar: {
    get: (schoolId: string) => `/schools/${schoolId}/calendars`,
    create: (schoolId: string) => `/schools/${schoolId}/calendars`,
    update: (schoolId: string, id: string) => `/schools/${schoolId}/calendars/${id}`,
    delete: (schoolId: string, id: string) => `/schools/${schoolId}/calendars/${id}`,
  },

  attendance: {
    sync: (schoolId: string) => `/schools/${schoolId}/attendances`,
    get: (schoolId: string, classroomId: string) => `/schools/${schoolId}/classrooms/${classroomId}/attendances`,
  },

  owner: {
    create: () => `/owners`,
  },
};
