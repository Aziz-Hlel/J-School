export const repoErrors = {
  CONFLICT: {
    code: 'CONFLICT',
    message: 'Conflict',
    status: 409,
  },
  NOT_FOUND: {
    code: 'NOT_FOUND',
    message: 'Not Found',
    status: 404,
  },
  UNHANDLED_DB_ERROR: {
    code: 'UNHANDLED_DB_ERROR',
    message: 'Operation failed',
    status: 500,
  },
  UNKNOWN: {
    code: 'UNKNOWN_DB_ERROR',
    message: 'Unknown error',
    status: 500,
  },
} as const;

export type RepoErrorDefaults = (typeof repoErrors)[keyof typeof repoErrors];
