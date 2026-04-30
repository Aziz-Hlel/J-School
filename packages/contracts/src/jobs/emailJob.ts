export type EmailJob = {
  type: 'contact-us' | 'reservation';
  from: string;
  to: string[];
  subject: string;
  // text: string;
  html: string;
};
