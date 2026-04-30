export const ProvidersMapping = {
  'google.com': 'google',
  'apple.com': 'apple',
  password: 'email/password',
} as const;

export type ProviderType = keyof typeof ProvidersMapping;
export type MappedProviderType = (typeof ProvidersMapping)[ProviderType];
