class ThreadRepository {
  async createThread(newThread) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }

  async getThread(id) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }

  async isExistingThread(id) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ThreadRepository;
