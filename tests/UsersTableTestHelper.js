/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const tableName = 'users';

const UsersTableTestHelper = {
  async addUser({
    id = 'user-1', username = 'test', password = 'secret', fullname = 'Test User',
  }) {
    const query = {
      text: `INSERT INTO ${tableName} VALUES($1, $2, $3, $4, current_timestamp, NULL)`,
      values: [id, username, password, fullname],
    };
    await pool.query(query);
  },

  async findUser(id) {
    const query = {
      text: `SELECT * FROM ${tableName} WHERE id = $1`,
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query(`TRUNCATE TABLE ${tableName}`);
  },
};

module.exports = UsersTableTestHelper;
