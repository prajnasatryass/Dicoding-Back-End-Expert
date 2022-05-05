/* istanbul ignore file */
const HttpMethods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

const PgTypes = {
  INT: 'INT',
  TEXT: 'TEXT',
  TIMESTAMP: 'TIMESTAMP',
  VARCHAR: (n) => `VARCHAR(${n})`,
};

module.exports = { HttpMethods, PgTypes };
