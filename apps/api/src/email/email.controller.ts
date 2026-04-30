import { sendContactUsRequestSchema } from '@repo/contracts/schemas/email/sendContactUsRequest';
import { emailService } from './email.service';
import { Request, Response } from 'express';
import { SimpleApiResponse } from '@repo/contracts/types/api/SimpleApiResponse.dto';

class EmailController {
  async sendContactEmail(req: Request, res: Response<SimpleApiResponse>) {
    const parsedPayload = sendContactUsRequestSchema.parse(req.body);
    await emailService.sendContactEmail(parsedPayload);
    res.status(200).json({ message: 'Email sent successfully' });
  }
}

export const emailController = new EmailController();
