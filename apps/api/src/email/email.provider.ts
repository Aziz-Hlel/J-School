import Emailtransporter from '@/bootstrap/email.init';
import { logger } from '@/bootstrap/logger.init';
import { sesErrorExplanations, SES_ErrorCode } from '@/err/infra/ses.errors';
import { Mailpit_ErrorCode, mailpitErrorExplanations } from '@/err/infra/mailpit.errors';
import ENV from '@/config/env';

class TransporterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TransporterError';
  }
}

type MailpitError = Error & { code: Mailpit_ErrorCode };

type SES_Error = Error & { name: SES_ErrorCode };

const handleSES_Error = (error: SES_Error, throwable: boolean = true) => {
  const errorExplanation = sesErrorExplanations[error.name];
  if (!errorExplanation) return;

  const errorMessage = `❌ ERROR : Failed to send email\n${errorExplanation.message}\n${errorExplanation.explanation}`;
  logger.error({ error, humanError: errorExplanation }, errorMessage);
  if (throwable) throw new TransporterError(errorMessage);
  return {
    success: false,
    code: errorExplanation.name,
    error: error,
  };
};

const handleMailpit_Error = (error: MailpitError, throwable: boolean = true) => {
  const errorExplanation = mailpitErrorExplanations[error.code as Mailpit_ErrorCode];
  if (!errorExplanation) return;
  const errorMessage = `✖ ERROR : Failed to send email\n${errorExplanation.message}\n${errorExplanation.explanation}`;
  logger.error({ error, humanError: errorExplanation }, errorMessage);
  if (throwable) throw new TransporterError(errorMessage);
  return {
    success: false,
    code: errorExplanation.code,
    error: error,
  };
};

const isMailpitError = (error: Error): error is MailpitError => {
  return 'code' in error && typeof error.code === 'string' && error.code in mailpitErrorExplanations;
};

const isSESError = (error: Error): error is SES_Error => {
  return 'name' in error && typeof error.name === 'string' && error.name in sesErrorExplanations;
};
class EmailProvider {
  async sendEmail(
    payload: { from: string; to: string | string[]; subject: string; text: string },
    options: { throwable: boolean } = { throwable: true },
  ) {
    try {
      const info = await Emailtransporter.sendMail({
        from: payload.from,
        to: payload.to,
        subject: payload.subject,
        html: payload.text,
      });

      return {
        success: true,
      };
    } catch (error) {
      if (ENV.NODE_ENV === 'production' && error instanceof Error && isSESError(error)) {
        handleSES_Error(error, options.throwable);
      }
      if (ENV.NODE_ENV !== 'production' && error instanceof Error && isMailpitError(error)) {
        handleMailpit_Error(error, options.throwable);
      }
      if (options.throwable) throw error;
    }
  }
}

export const emailProvider = new EmailProvider();
