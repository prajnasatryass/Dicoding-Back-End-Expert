/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const tableName = 'comment_likes';

const CommentLikesTableTestHelper = {
  async likeComment({
    id = 'c_like-1', commentId = 'comment-1', userId = 'user-1',
  }) {
    const query = {
      text: `INSERT INTO ${tableName} VALUES($1, $2, $3, current_timestamp)`,
      values: [id, commentId, userId],
    };
    await pool.query(query);
  },

  async getLikeCount(commentId = 'comment-1') {
    const query = {
      text: `SELECT COUNT(comment_id) FROM ${tableName} WHERE comment_id = $1`,
      values: [commentId],
    };
    const result = await pool.query(query);
    return result.rows[0].count;
  },

  async unlikeComment({
    commentId = 'comment-1', userId = 'user-1',
  }) {
    const query = {
      text: `DELETE FROM ${tableName} WHERE comment_id = $1 AND user_id = $2`,
      values: [commentId, userId],
    };
    await pool.query(query);
  },

  async cleanTable() {
    await pool.query(`TRUNCATE TABLE ${tableName}`);
  },
};

module.exports = CommentLikesTableTestHelper;
