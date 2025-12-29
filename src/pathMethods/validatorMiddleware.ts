import { NextFunction, Request, Response } from 'express';
import HttpValidationError from './httpRequestErrors';
import { $ZodIssue } from 'zod/v4/core';
import { routeFormatedTypes } from '../types/routesTypes';

export function validatorMiddleware(schemas: routeFormatedTypes['schemas']) {
    return (req: Request & { file: File }, _res: Response, next: NextFunction) => {
        if (schemas) {
            schemas.forEach((schema) => {
                let httpDataType: string;

                Object.entries(schema).forEach(([key, value]) => {
                    if (value !== undefined) {
                        httpDataType = key;
                    }
                });

                if (!req.file) {
                    const verify = schema[httpDataType].safeParse(req[httpDataType]);
    
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
            });
        }

        next();
    }
}
