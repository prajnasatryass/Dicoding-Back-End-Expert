class NewAuth {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, accessToken, refreshToken,
    } = payload;

    this.user = { id, username };
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  _verifyPayload({
    id, username, accessToken, refreshToken,
  }) {
    if (!id || !username || !accessToken || !refreshToken) {
      throw new Error('MISSING_REQUIRED_PROPERTIES');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
      throw new Error('DATA_TYPE_MISMATCH');
    }
  }
}

module.exports = NewAuth;
