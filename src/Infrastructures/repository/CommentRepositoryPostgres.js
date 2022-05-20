const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(ownerId, threadId, content) {
    const id = `comment-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, current_timestamp, NULL, NULL) RETURNING id, content, owner_id AS owner',
      values: [id, threadId, content, ownerId],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getThreadComments(threadId) {
    const query = {
      text: 'SELECT a.id, b.username, a.inserted_at AS date, a.content, a.deleted_at, COUNT(c.comment_id) AS like_count FROM comments a JOIN users b ON a.owner_id = b.id LEFT JOIN comment_likes c on a.id = c.comment_id WHERE a.thread_id = $1 GROUP BY a.id, b.username, a.inserted_at, a.content, a.deleted_at ORDER BY a.inserted_at ASC',
      values: [threadId],
    };
    const { rows } = await this._pool.query(query);
    return rows;
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET deleted_at = current_timestamp WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async isExistingComment(threadId, id) {
    const query = {
      text: 'SELECT COUNT(id) FROM comments WHERE id = $1 AND thread_id = $2',
      values: [id, threadId],
    };
    const result = await this._pool.query(query);
    if (result.rows[0].count === '0') {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async verifyCommentOwnership(ownerId, id) {
    const query = {
      text: 'SELECT owner_id AS owner FROM comments WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
    if (result.rows[0].owner !== ownerId) {
      throw new AuthorizationError('anda bukan pemilik komentar');
    }
  }

  async toggleCommentLikeStatus(userId, commentId) {
    const id = `c_like-${this._idGenerator()}`;
    let query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3, current_timestamp) RETURNING id',
      values: [id, commentId, userId],
    };
    try {
      await this._pool.query(query);
    } catch {
      query = {
        text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2 RETURNING id',
        values: [commentId, userId],
      };
      await this._pool.query(query);
    }
  }
}

module.exports = CommentRepositoryPostgres;
