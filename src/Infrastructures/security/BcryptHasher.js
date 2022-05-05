const Hasher = require('../../Applications/security/Hasher');
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');

class BcryptHasher extends Hasher {
  constructor(bcrypt, saltRound = 10) {
    super();
    this._bcrypt = bcrypt;
    this._saltRound = saltRound;
  }

  async hash(plain) {
    return this._bcrypt.hash(plain, this._saltRound);
  }

  async match(plain, hashed) {
    if (!await this._bcrypt.compare(plain, hashed)) {
      throw new AuthenticationError('kredensial yang Anda masukkan salah');
    }
  }
}

module.exports = BcryptHasher;
