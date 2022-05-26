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
    const replies = await this._replyRepository.getCommentsReplies(comments.map(({ id }) => id));
    thread.comments = comments.map((comment) => {
      comment.replies = replies.filter((reply) => reply.comment_id === comment.id)
        .map((reply) => new Reply(reply));
      return new Comment(comment);
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
