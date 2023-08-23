export default (schema) => {
  let schemaSwagger = {};
  const schemaKeyValues = Object.entries(schema);

  schemaKeyValues.forEach((pair) => {
    schemaSwagger[pair[0]] = {
      example: pair[1]
    }
  });

  return schemaSwagger;
};
