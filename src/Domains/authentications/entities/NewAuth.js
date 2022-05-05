class NewAuth {
  constructor(payload) {
    this._verifyPayload(payload);

    const { accessToken, refreshToken } = payload;

    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  _verifyPayload({ accessToken, refreshToken }) {
    if (!accessToken || !refreshToken) {
      throw new Error('NEW_AUTH.MISSING_REQUIRED_PROPERTIES');
    }

    if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
      throw new Error('NEW_AUTH.DATA_TYPE_MISMATCH');
    }
  }
}

module.exports = NewAuth;
