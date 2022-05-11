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
      text: 'SELECT a.id, b.username, a.inserted_at AS date, a.content, (CASE WHEN a.deleted_at IS NULL THEN FALSE ELSE TRUE END) AS deleted FROM comments a JOIN users b ON a.owner_id = b.id WHERE a.thread_id = $1 ORDER BY a.inserted_at ASC',
      values: [threadId],
    };
    const result = await this._pool.query(query);
    return result.rows;
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
}

module.exports = CommentRepositoryPostgres;
