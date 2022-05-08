class Hasher {
  async hash(plain) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }

  async match(plain, hashed) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = Hasher;
