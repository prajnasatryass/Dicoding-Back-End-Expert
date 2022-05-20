const NewThread = require('../../Domains/threads/entities/NewThread');
const Comment = require('../../Domains/comments/entities/Comment');
const Reply = require('../../Domains/replies/entities/Reply');

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
    const comments = await this._commentRepository.getThreadComments(threadId);
    thread.comments = await Promise.all(comments.map(async (comment) => {
      const replies = await this._replyRepository.getCommentReplies(comment.id);
      comment.replies = replies.map((reply) => new Reply(reply));
      return new Comment(comment);
    }));

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
