import { SendContactUsRequest } from '@repo/contracts/schemas/email/sendContactUsRequest';

class EmailUtils {
  createContactUsHtml(payload: SendContactUsRequest) {
    const { email, name, subject, message } = payload;
    const html = `
        <h1>Contact Us</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
        `;
    return html;
  }
}

export const emailUtils = new EmailUtils();
