/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const tableName = 'threads';

const ThreadsTableTestHelper = {
  async createThread({
    id = 'thread-1', title = 'Test Thread', body = 'Test body', ownerId = 'user-1',
  }) {
    const query = {
      text: `INSERT INTO ${tableName} VALUES($1, $2, $3, $4, current_timestamp, NULL, NULL)`,
      values: [id, title, body, ownerId],
    };
    await pool.query(query);
  },

  async findThread(id) {
    const query = {
      text: `SELECT * FROM ${tableName} WHERE id = $1`,
      values: [id],
    };
    const { rows } = await pool.query(query);
    return rows;
  },

  async cleanTable() {
    await pool.query(`DELETE FROM ${tableName} WHERE 1=1`);
  },
};

module.exports = ThreadsTableTestHelper;
