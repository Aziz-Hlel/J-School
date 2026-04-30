import ErrorNames, { ErrorNameKeys } from '../errors.names';

export type Mailpit_ErrorCode = 'ECONNREFUSED' | 'ESOCKET' | 'ETIMEDOUT' | 'EENVELOPE';

export const mailpitErrorExplanations: Record<
  Mailpit_ErrorCode,
  { message: string; explanation: string; code: number; name: ErrorNameKeys }
> = {
  ECONNREFUSED: {
    message: 'Connection refused',
    explanation: `
        ° Mailpit is not running
        ° Wrong port
        ° Firewall blocking
        `,
    code: 500,
    name: ErrorNames.INTERNAL_SERVER,
  },
  ESOCKET: {
    message: 'Socket error',
    explanation: `
        ° Mailpit is not running
        ° Wrong port
        ° Firewall blocking
        `,
    code: 500,
    name: ErrorNames.INTERNAL_SERVER,
  },
  ETIMEDOUT: {
    message: 'Timeout error',
    explanation: `
        ° Mailpit is not running
        ° Wrong port
        ° Firewall blocking
        `,
    code: 503,
    name: ErrorNames.INTERNAL_SERVER,
  },
  EENVELOPE: {
    message: 'Envelope error',
    explanation: `
        ° Invalid sender or recipient
        `,
    code: 400,
    name: ErrorNames.BAD_REQUEST,
  },
};
