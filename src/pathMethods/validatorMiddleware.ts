import { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod';
import HttpValidationError from './httpRequestErrors';
import { $ZodIssue } from 'zod/v4/core';

export function validatorMiddleware(schema: ZodType) {
    return (_res: Response, req: Request, next: NextFunction) => {
        if (schema) {
            let payload: any;

            if (req.body) payload = req.body;
            if (req.params) payload = req.params;
            if (req.query) payload = req.query;

            const verify = schema.safeParse(payload);

            if (!verify.success)
                throw new HttpValidationError({
                    message: 'Schema error',
                    code: 422,
                    name: 'Unprocessable Entity',
                    details: verify.error.issues.map((err: $ZodIssue ) => ({
                        attribute: JSON.stringify(err.path)
                            .replace(/,/g, '.')
                            .replace(/ /g, '')
                            .replace(/['"[\]]/g, ''),
                        reason: err.message,
                        path: 'payload',
                    })),
                });
        }

        next();
    }
}
