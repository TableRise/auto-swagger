import { ZodType, z } from 'zod';
import { install, fake } from 'zod-schema-faker'
import { faker } from '@faker-js/faker'
import { schemaProperties } from '../types/methodTypes';
import { ZodSchema } from 'zod/v3';

export default (schema: ZodType): schemaProperties => {
  install();
  const mock = fake(schema as unknown as ZodSchema);

  let schemaSwagger = {} as schemaProperties;
  const schemaKeyValues = Object.entries(mock) as [string, any][];

  schemaKeyValues.forEach((pair) => {
    if (!pair[1]) pair[1] = 'string';

    schemaSwagger[pair[0]] = {
      type: pair[1].isBinary ? 'string' : typeof pair[1],
      example: pair[1]
    }

    if (pair[1].isBinary) schemaSwagger[pair[0]].format = 'binary';
  });

  return schemaSwagger;
};
