class AuthenticationRepository {
  async registerToken(token) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }

  async verifyTokenAvailability(token) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }

  async deleteToken(token) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = AuthenticationRepository;
