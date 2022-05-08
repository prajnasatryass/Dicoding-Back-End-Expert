const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async createThread(ownerId, newThread) {
    const { title, body } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, current_timestamp, NULL, NULL) RETURNING id, title, owner_id AS owner',
      values: [id, title, body, ownerId],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getThread(id) {
    const query = {
      text: 'SELECT a.id, a.title, a.body, a.inserted_at as date, b.username FROM threads a JOIN users b ON a.owner_id = b.id WHERE a.id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
    return result.rows[0];
  }

  async isExistingThread(id) {
    const query = {
      text: 'SELECT COUNT(id) FROM threads WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (result.rows[0].count === '0') {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
