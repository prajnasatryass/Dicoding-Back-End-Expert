/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const tableName = 'replies';

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-1', commentID = 'comment-1', content = 'test reply', ownerID = 'user-1',
  }) {
    const query = {
      text: `INSERT INTO ${tableName} VALUES($1, $2, $3, $4, current_timestamp, NULL, NULL)`,
      values: [id, commentID, content, ownerID],
    };
    await pool.query(query);
  },

  async getCommentReplies(id) {
    const query = {
      text: `SELECT * FROM ${tableName} WHERE comment_id = $1`,
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async deleteReply({
    id = 'reply-1',
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

module.exports = RepliesTableTestHelper;
