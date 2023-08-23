import { schemaProperties } from "../types/methodTypes";

export default (schema: any): schemaProperties => {
  let schemaSwagger = {} as schemaProperties;
  const schemaKeyValues = Object.entries(schema);

  schemaKeyValues.forEach((pair) => {
    schemaSwagger[pair[0]] = {
      example: pair[1]
    }
  });

  return schemaSwagger;
};
