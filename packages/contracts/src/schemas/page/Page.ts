import type { Pageable } from './Pageable';

export type Page<T> = {
  data: T[];
  pagination: Pageable;
};
