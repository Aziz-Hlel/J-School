import z from 'zod';

export const requiredNotificationLanguage = {
  en: 'en',
} as const;

export const optionalNotificationLanguage = {
  ar: 'ar',
  fr: 'fr',
} as const;

export const NotificationLanguage = {
  ...requiredNotificationLanguage,
  ...optionalNotificationLanguage,
} as const;

export type NotificationLanguage = (typeof NotificationLanguage)[keyof typeof NotificationLanguage];

export const TranslationSchema = z.object({
  language: z.enum(NotificationLanguage),
  title: z.string(),
  content: z.string(),
  data: z.string(),
});

export const optionalLanguagesSchema = z.object({
  ar: TranslationSchema.optional(),
  fr: TranslationSchema.optional(),
});

export type OptionalLanguagesSchema = z.infer<typeof optionalLanguagesSchema>;
