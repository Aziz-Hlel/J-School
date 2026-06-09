export class CursorMapper {
  static toCursor<T>(params: { data: T[]; nextCursor: string | null }) {
    const { data: items, nextCursor } = params;

    return {
      items,
      meta: {
        nextCursor,
        hasNext: !!nextCursor,
      },
    };
  }
}
