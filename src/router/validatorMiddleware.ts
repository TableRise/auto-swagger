import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { HttpValidationError } from '../errors/HttpValidationError';
import { RouteSchemas } from '../types/publicTypes';

function createValidationError(error: ZodError) {
  return new HttpValidationError({
    message: 'Schema error',
    code: 422,
    name: 'Unprocessable Entity',
    details: error.issues.map((issue) => ({
      attribute: issue.path.join('.'),
      reason: issue.message,
      path: 'payload',
    })),
  });
}

export function validatorMiddleware(
  schemas: RouteSchemas,
  requestContentType?: 'application/json' | 'multipart/form-data'
) {
  return (req: Request & { file?: File; files?: File[] }, _res: Response, next: NextFunction) => {
    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        throw createValidationError(result.error);
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        throw createValidationError(result.error);
      }
    }

    const hasMultipartFiles = Boolean(req.file) || (Array.isArray(req.files) && req.files.length > 0);

    if (schemas.body && !(requestContentType === 'multipart/form-data' && hasMultipartFiles)) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        throw createValidationError(result.error);
      }
    }

    next();
  };
}
