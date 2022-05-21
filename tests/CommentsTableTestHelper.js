/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const tableName = 'comments';

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-1', threadId = 'thread-1', content = 'Test comment', ownerId = 'user-1',
  }) {
    const query = {
      text: `INSERT INTO ${tableName} VALUES($1, $2, $3, $4, current_timestamp, NULL, NULL)`,
      values: [id, threadId, content, ownerId],
    };
    await pool.query(query);
  },

  async findComment(id) {
    const query = {
      text: `SELECT * FROM ${tableName} WHERE id = $1`,
      values: [id],
    };
    const { rows } = await pool.query(query);
    return rows;
  },

  async findThreadComments(threadId) {
    const query = {
      text: `SELECT * FROM ${tableName} a WHERE thread_id = $1`,
      values: [threadId],
    };
    const { rows } = await pool.query(query);
    return rows;
  },

  async deleteComment({
    id = 'comment-1',
  }) {
    const query = {
      text: `UPDATE ${tableName} SET deleted_at = current_timestamp WHERE id = $1 RETURNING id`,
      values: [id],
    };
    await pool.query(query);
  },

  async cleanTable() {
    await pool.query(`TRUNCATE TABLE ${tableName}`);
  },
};

module.exports = CommentsTableTestHelper;
