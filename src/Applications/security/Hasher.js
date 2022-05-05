class Hasher {
  async hash(plain) {
    throw new Error('HASHER.METHOD_NOT_IMPLEMENTED');
  }

  async match(plain, hashed) {
    throw new Error('HASHER.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = Hasher;
