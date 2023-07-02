const crypto = require('crypto');

module.exports = (prevContent, actualContent) => {
  const prevSwaggerHashed = crypto.createHash('sha256');
  const actualSwaggerHashed = crypto.createHash('sha256');

  prevSwaggerHashed.update(prevContent);
  actualSwaggerHashed.update(JSON.stringify(actualContent));

  const prevSwaggerDigest = prevSwaggerHashed.digest('hex');
  const actualSwaggerDigest = actualSwaggerHashed.digest('hex');

  if (prevSwaggerDigest === actualSwaggerDigest) return true;
  return false;
}
