import { ErrorDetails, Errors } from '../types/httpRequestErrorsTypes';

export default class HttpValidationError extends Error {
    code: number;
    details: ErrorDetails[];
    redirectTo: string;

    constructor({ message = '', code = 0, details = [], name = '', redirectTo = '' }: Errors) {
        super(message);
        this.code = code;
        this.details = details;
        this.name = name;
        this.redirectTo = redirectTo;
    }
}
