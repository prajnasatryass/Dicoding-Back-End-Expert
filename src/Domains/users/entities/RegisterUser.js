class RegisterUser {
  constructor(payload) {
    this._verifyPayload(payload);

    const { username, password, fullname } = payload;

    this.username = username;
    this.password = password;
    this.fullname = fullname;
  }

  _verifyPayload({ username, password, fullname }) {
    if (!username || !password || !fullname) {
      throw new Error('MISSING_REQUIRED_PROPERTIES');
    }

    if (typeof username !== 'string' || typeof password !== 'string' || typeof fullname !== 'string') {
      throw new Error('DATA_TYPE_MISMATCH');
    }

    if (username.length > 50) {
      throw new Error('REGISTER_USER.USERNAME_TOO_LONG');
    }

    if (!username.match(/^[\w]+$/)) {
      throw new Error('REGISTER_USER.USERNAME_NOT_ALPHANUMERIC');
    }
  }
}

module.exports = RegisterUser;
