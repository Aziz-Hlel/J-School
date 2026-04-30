import { treeifyError, ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export function validateBody<T extends ZodSchema>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: treeifyError(parsed.error),
      });
    }

    // ⭐ Assign validated, typed data back to req.body
    req.body = parsed.data;

    next();
  };
}
