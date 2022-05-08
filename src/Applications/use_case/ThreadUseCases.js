const NewThread = require('../../Domains/threads/entities/NewThread');

class ThreadUseCases {
  constructor({
    threadRepository, commentRepository, replyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async createThread(userId, useCasePayload) {
    const newThread = new NewThread(useCasePayload);
    return this._threadRepository.createThread(userId, newThread);
  }

  async getThread(useCasePayload) {
    this._verifyGetThreadPayload(useCasePayload);
    const { threadId } = useCasePayload;
    const thread = await this._threadRepository.getThread(threadId);
    thread.comments = await this._commentRepository.getThreadComments(threadId);
    await Promise.all(thread.comments.map(
      async ({ id }) => this._replyRepository.getCommentReplies(id),
    )).then((replies) => {
      thread.comments.forEach(async (_, index) => {
        thread.comments[index].replies = replies[index];
      });
    });
    return thread;
  }

  _verifyGetThreadPayload({ threadId }) {
    if (!threadId) {
      throw new Error('THREAD.MISSING_THREAD_ID');
    }
    if (typeof threadId !== 'string') {
      throw new Error('DATA_TYPE_MISMATCH');
    }
  }
}

module.exports = ThreadUseCases;
