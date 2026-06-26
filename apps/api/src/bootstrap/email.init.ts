import { Transporter } from 'nodemailer';

let Emailtransporter: Transporter;

try {
  Emailtransporter = {
    sendMail: async () => {
      console.warn('Email service disabled');
      return;
    },
  } as unknown as Transporter;
  console.log('✅ SUCCESS : Email transporter created successfully.');
} catch (error) {
  console.error('❌ ERROR : Failed to create email transporter:', error);
  process.exit(1);
}

export default Emailtransporter;
