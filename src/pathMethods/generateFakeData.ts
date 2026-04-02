import { faker } from '@faker-js/faker';
import { ZodObject } from 'zod';

export default (schema: ZodObject): any => {
    const keys = Object.keys(schema.shape);
    const mock = {};

    keys.forEach((key) => {
        if (schema.shape[key] === 'string') mock[key] = faker.string.sample();
        if (schema.shape[key] === 'number') mock[key] = faker.number.int();
        if (schema.shape[key] === 'enum') mock[key] = faker.string.sample();
        if (schema.shape[key] === 'file') mock[key] = {};
        if (schema.shape[key] === 'uuid') mock[key] = faker.string.uuid();
        if (schema.shape[key] === 'email') mock[key] = faker.internet.email();
    })

    return mock;
}
