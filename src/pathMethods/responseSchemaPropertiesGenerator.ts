import { ZodType, z } from 'zod';
import { zocker } from 'zocker';
import { schemaProperties } from '../types/methodTypes';

export default function rp (schema: ZodType): schemaProperties {
  const mock = zocker(schema).generate();

  let schemaSwagger = {} as schemaProperties;
  const schemaKeyValues = Object.entries(mock) as [string, any][];

  schemaKeyValues.forEach((pair) => {
    schemaSwagger[pair[0]] = {
      type: pair[1].isBinary ? 'string' : typeof pair[1],
      example: pair[1]
    }

    if (pair[1].isBinary) schemaSwagger[pair[0]].format = 'binary';
  });

  return schemaSwagger;
};

rp({} as ZodType);
