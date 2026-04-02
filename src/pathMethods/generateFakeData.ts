import { faker } from '@faker-js/faker';
import { ZodObject } from 'zod';

export default (schema: ZodObject): any => {
    const keys = Object.keys(schema.shape);
    const mock = {};

    keys.forEach((key) => {
        if (schema.shape[key].type === 'string') mock[key] = faker.string.sample();
        if (schema.shape[key].type === 'number') mock[key] = faker.number.int();
        if (schema.shape[key].type === 'enum') mock[key] = faker.string.sample();
        if (schema.shape[key].type === 'file') mock[key] = {};
        if (schema.shape[key].type === 'uuid') mock[key] = faker.string.uuid();
        if (schema.shape[key].type === 'email') mock[key] = faker.internet.email();
    })

    return mock;
}
