/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const tableName = 'authentications';

const AuthenticationsTableTestHelper = {
  async addToken(token) {
    const query = {
      text: `INSERT INTO ${tableName} VALUES($1)`,
      values: [token],
    };
    await pool.query(query);
  },

  async findToken(token) {
    const query = {
      text: `SELECT token FROM ${tableName} WHERE token = $1`,
      values: [token],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query(`TRUNCATE TABLE ${tableName}`);
  },
};

module.exports = AuthenticationsTableTestHelper;
