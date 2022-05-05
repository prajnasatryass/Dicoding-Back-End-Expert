/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const tableName = 'threads';

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-1', title = 'test thread', body = 'test', ownerID = 'user-1',
  }) {
    const query = {
      text: `INSERT INTO ${tableName} VALUES($1, $2, $3, $4, current_timestamp, NULL, NULL)`,
      values: [id, title, body, ownerID],
    };
    await pool.query(query);
  },

  async getThread(id) {
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

module.exports = ThreadsTableTestHelper;
