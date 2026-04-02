import { ZodObject } from 'zod';
import { schemaProperties } from '../types/methodTypes';
import generateFakeData from './generateFakeData';

export default (schema: ZodObject): schemaProperties => {
  const mock = generateFakeData(schema);

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
