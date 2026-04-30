import ENV from '@/config/env';
import nodemailer, { Transporter } from 'nodemailer';

let Emailtransporter: Transporter;

try {
  Emailtransporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    secure: ENV.SMTP_SECURE,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: ENV.SMTP_USER,
      pass: ENV.SMTP_PASS,
    },
  });

  console.log('✅ SUCCESS : Email transporter created successfully.');
} catch (error) {
  console.error('❌ ERROR : Failed to create email transporter:', error);
  process.exit(1);
}

export default Emailtransporter;
