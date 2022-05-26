const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(ownerId, commentId, content) {
    const id = `reply-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, current_timestamp, NULL, NULL) RETURNING id, content, owner_id AS owner',
      values: [id, commentId, content, ownerId],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getCommentsReplies(commentIds) {
    const query = {
      text: 'SELECT a.id, a.comment_id, b.username, a.inserted_at AS date, a.content, a.deleted_at FROM replies a JOIN users b ON a.owner_id = b.id WHERE a.comment_id = ANY($1::TEXT[]) ORDER BY a.inserted_at ASC',
      values: [commentIds],
    };
    const { rows } = await this._pool.query(query);
    return rows;
  }

  async deleteReply(id) {
    const query = {
      text: 'UPDATE replies SET deleted_at = current_timestamp WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }
  }

  async isExistingReply(commentId, id) {
    const query = {
      text: 'SELECT COUNT(id) FROM replies WHERE id = $1 AND comment_id = $2',
      values: [id, commentId],
    };
    const result = await this._pool.query(query);
    if (result.rows[0].count === '0') {
      throw new NotFoundError('balasan tidak ditemukan');
    }
  }

  async verifyReplyOwnership(ownerId, id) {
    const query = {
      text: 'SELECT owner_id AS owner FROM replies WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }
    if (result.rows[0].owner !== ownerId) {
      throw new AuthorizationError('anda bukan pemilik balasan');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
