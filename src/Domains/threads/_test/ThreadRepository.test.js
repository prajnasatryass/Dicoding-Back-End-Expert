const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository', () => {
  it('should throw Error if methods are invoked', async () => {
    const threadRepository = new ThreadRepository();

    await expect(threadRepository.createThread({})).rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
    await expect(threadRepository.getThread('')).rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
    await expect(threadRepository.isExistingThread('')).rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
  });
});
