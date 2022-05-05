class UserLogin {
  constructor(payload) {
    this._verifyPayload(payload);

    const { username, password } = payload;

    this.username = username;
    this.password = password;
  }

  _verifyPayload({ username, password }) {
    if (!username || !password) {
      throw new Error('USER_LOGIN.MISSING_REQUIRED_PROPERTIES');
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('USER_LOGIN.DATA_TYPE_MISMATCH');
    }
  }
}

module.exports = UserLogin;
