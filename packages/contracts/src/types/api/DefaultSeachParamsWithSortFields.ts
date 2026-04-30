import z from 'zod';

const createSeachParamsSchemaWithSortFields = (allowedSortFields: string[]) => {
  return z.object({
    page: z.preprocess((val) => (isNaN(Number(val)) ? undefined : Number(val)), z.number().default(0)),
    size: z.preprocess((val) => (isNaN(Number(val)) ? undefined : Number(val)), z.number().min(1).max(25).default(10)),
    order: z
      .preprocess(
        (val) => {
          if (typeof val !== 'string') return undefined; // undefined → default applied
          const allowed = ['asc', 'desc'];
          return allowed.includes(val) ? val : undefined; // invalid → default applied
        },
        z.enum(['asc', 'desc'], { error: 'Invalid sort order' }),
      )
      .default('asc'),
    sort: z.preprocess((val) => {
      if (typeof val !== 'string') return undefined; // undefined → default applied
      return allowedSortFields.includes(val) ? val : undefined; // invalid → default applied
    }, z.string().default('createdAt')),
    search: z.string().trim().max(255, { message: 'Search query is too long, max 255 characters' }).optional(),
  });
};
export { createSeachParamsSchemaWithSortFields };
