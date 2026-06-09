export type Cursor<T> = {
  items: T[];
  meta: {
    nextCursor: string | null;
    hasNext: boolean;
  };
};
