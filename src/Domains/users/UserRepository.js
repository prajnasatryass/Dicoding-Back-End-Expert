class UserRepository {
  async registerUser(registerUser) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }

  async verifyUsernameAvailability(username) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }

  async getPasswordByUsername(username) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }

  async getIdByUsername(username) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = UserRepository;
