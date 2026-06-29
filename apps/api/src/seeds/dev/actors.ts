import { UserRole } from '@repo/db/prisma/enums';
import { genUuid } from '../helper/generateUuid';

export const userSeedData = {
  director1: {
    id: genUuid('director1'),
    email: 'director1@fake.com',
    role: UserRole.DIRECTOR,
  },
  director2: {
    id: genUuid('director2'),
    email: 'director2@fake.com',
    role: UserRole.DIRECTOR,
  },
  director3: {
    id: genUuid('director1'),
    email: 'director1@fake.com',
    role: UserRole.MANAGER,
  },
  manager1: {
    id: genUuid('manager1'),
    email: 'manager1@fake.com',
    role: UserRole.MANAGER,
  },
  manager2: {
    id: genUuid('manager2'),
    email: 'manager2@fake.com',
    role: UserRole.MANAGER,
  },
  nurse1: {
    id: genUuid('nurse1'),
    email: 'nurse1@fake.com',
    role: UserRole.NURSE,
  },
  nurse2: {
    id: genUuid('nurse2'),
    email: 'nurse2@fake.com',
    role: UserRole.NURSE,
  },
  driver1: {
    id: genUuid('driver1'),
    email: 'driver1@fake.com',
    role: UserRole.DRIVER,
  },
  driver2: {
    id: genUuid('driver2'),
    email: 'driver2@fake.com',
    role: UserRole.DRIVER,
  },
};

export const teacherSeedData = {
  director1: {
    id: genUuid('director1'),
    userId: '019177b5-5d7e-5297-9541-f97957e77f53',
    email: 'director1@fake.com',
    role: UserRole.TEACHER,
  },
  teacher1: {
    id: genUuid('teacher1'),
    userId: genUuid('teacher1'),
    email: 'teacher1@fake.com',
    role: UserRole.TEACHER,
  },
  teacher2: {
    id: genUuid('teacher2'),
    userId: genUuid('teacher2'),
    email: 'teacher2@fake.com',
    role: UserRole.TEACHER,
  },
  teacher3: {
    id: genUuid('teacher3'),
    userId: genUuid('teacher3'),
    email: 'teacher3@fake.com',
    role: UserRole.TEACHER,
  },
  teacher4: {
    id: genUuid('teacher4'),
    userId: genUuid('teacher4'),
    email: 'teacher4@fake.com',
    role: UserRole.TEACHER,
  },
  teacher5: {
    id: genUuid('teacher5'),
    userId: genUuid('teacher5'),
    email: 'teacher5@fake.com',
    role: UserRole.TEACHER,
  },
};

const parentSeed = {
  director1: {
    id: genUuid('director1'),
    userId: '019177b5-5d7e-5297-9541-f97957e77f53',
    email: 'director1@fake.com',
    role: UserRole.PARENT,
  },
  parent1: {
    id: genUuid('parent1'),
    userId: genUuid('parent1'),
    email: 'parent1@fake.com',
    role: UserRole.PARENT,
  },
  parent2: {
    id: genUuid('parent2'),
    userId: genUuid('parent2'),
    email: 'parent2@fake.com',
    role: UserRole.PARENT,
  },
};

export const parentSeedData = parentSeed;

export const studentSeedData = {
  student1: {
    id: genUuid('student1'),
    uid: 'student1',
  },
  student2: {
    id: genUuid('student2'),
    uid: 'student2',
  },
  student3: {
    id: genUuid('student3'),
    uid: 'student3',
  },
  student4: {
    id: genUuid('student4'),
    uid: 'student4',
  },
  student5: {
    id: genUuid('student5'),
    uid: 'student5',
  },
};

export const parentStudentSeedData = [
  {
    parentId: parentSeedData.director1.id,
    studentId: studentSeedData.student1.id,
  },
  {
    parentId: parentSeedData.parent1.id,
    studentId: studentSeedData.student1.id,
  },
  {
    parentId: parentSeedData.parent1.id,
    studentId: studentSeedData.student2.id,
  },
  {
    parentId: parentSeedData.director1.id,
    studentId: studentSeedData.student3.id,
  },
  {
    parentId: parentSeedData.parent2.id,
    studentId: studentSeedData.student3.id,
  },
  {
    parentId: parentSeedData.parent2.id,
    studentId: studentSeedData.student4.id,
  },
];
