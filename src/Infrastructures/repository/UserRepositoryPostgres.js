const InvariantError = require('../../Commons/exceptions/InvariantError');
const RegisteredUser = require('../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../Domains/users/UserRepository');

class UserRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyUsernameAvailability(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);
    if (result.rowCount) {
      throw new InvariantError('username telah digunakan');
    }
  }

  async registerUser(registerUser) {
    const { username, password, fullname } = registerUser;
    const id = `user-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, current_timestamp, NULL) RETURNING id, username, fullname',
      values: [id, username, password, fullname],
    };
    const result = await this._pool.query(query);
    return new RegisteredUser({ ...result.rows[0] });
  }

  async getPasswordByUsername(username) {
    const query = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('user tidak ditemukan');
    }
    return result.rows[0].password;
  }

  async getIdByUsername(username) {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('user tidak ditemukan');
    }
    return result.rows[0].id;
  }
}

module.exports = UserRepositoryPostgres;
