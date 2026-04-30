type RequiredKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K;
}[keyof T];

export type GenericEntityCreateInput<T, K extends keyof T = never> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | K>;

export type GenericEntityResponse<T, K extends keyof T = never> = Omit<T, K>;
