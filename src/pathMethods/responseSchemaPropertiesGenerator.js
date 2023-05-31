module.exports = (schema, { includeId=false }) => {
  let schemaSwagger = {};
  const schemaKeyValues = Object.entries(schema);

  schemaKeyValues.forEach((pair) => {
    schemaSwagger[pair[0]] = {
      example: pair[1]
    }
  })

  schemaSwagger = includeId ? Object.assign({ _id: { example: '' } }, schemaSwagger) : schemaSwagger;

  return schemaSwagger;
};
