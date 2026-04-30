// const moduleNames = {
//   subject: 'subject',
//   student: 'student',
//   teacher: 'teacher',
//   parent: 'parent',
//   owner: 'owner',
//   school: 'school',
//   user: 'user',
//   userRole: 'userRole',
//   notification: 'notification',
//   media: 'media',
//   account: 'account',
//   auth: 'auth',
//   classroom: 'classroom',
//   parentStudent: 'parentStudent',
//   studentProfile: 'studentProfile',
// } as const;
// type ModuleNames = (typeof moduleNames)[keyof typeof moduleNames];

export type ModuleError<Module extends string, Key extends string> = {
  [x in Key]: {
    name: `${Module}.${Key}`;
    message: string;
  };
} & {
  module: Module;
};

export const SubjectError = {
  notFound: {
    name: 'SubjectNotFound',
    message: 'Subject not found',
  },
  conflict: {
    name: 'SubjectAlreadyExists',
    message: 'Subject already exists',
  },
} as const;

// const moduleErrors = [{ module: 'subject', errors: SubjectError }] as const;

// const generateModuleErrorKey = <Module extends string, Key extends string>(module: Module, key: Key) => {
//   return `${module}.${key}` as const;
// };

// const byId = Object.fromEntries(
//   moduleErrors.map((item) => {
//     const { module, errors } = item;
//     const errorKeys = Object.keys(errors);
//     const errorObject = Object.fromEntries(
//       errorKeys.map((key) => {
//         const error = errors[key];
//         return [key, { ...error, key: generateModuleErrorKey(module, key) }];
//       }),
//     );
//     return [module, errorObject];
//   }),
// );

// ! not quite right
