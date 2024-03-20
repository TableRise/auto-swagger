import { schemaProperties } from "../types/methodTypes";

export default (schema: any): schemaProperties => {
  let schemaSwagger = {} as schemaProperties;
  const schemaKeyValues = Object.entries(schema) as [string, any][];

  schemaKeyValues.forEach((pair) => {
    schemaSwagger[pair[0]] = {
      type: pair[1].isBinary ? 'string' : typeof pair[1],
      example: pair[1]
    }

    if (pair[1].isBinary) schemaSwagger[pair[0]].format = 'binary';
  });

  return schemaSwagger;
};
