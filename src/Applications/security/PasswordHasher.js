class PasswordHasher {
  async hash(password) {
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  }

  async matchPassword(plain, encrypted) {
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = PasswordHasher;
