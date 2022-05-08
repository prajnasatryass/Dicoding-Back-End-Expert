class ReplyUseCases {
  constructor({
    threadRepository, commentRepository, replyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async addReply(userId, useCasePayload) {
    this._verifyAddReplyPayload(useCasePayload);
    const { threadId, commentId, content } = useCasePayload;
    await this._threadRepository.isExistingThread(threadId);
    await this._commentRepository.isExistingComment(threadId, commentId);
    return this._replyRepository.addReply(userId, commentId, content);
  }

  async deleteReply(userId, useCasePayload) {
    this._verifyDeleteReplyPayload(useCasePayload);
    const { threadId, commentId, replyId } = useCasePayload;
    await this._threadRepository.isExistingThread(threadId);
    await this._commentRepository.isExistingComment(threadId, commentId);
    await this._replyRepository.isExistingReply(commentId, replyId);
    await this._replyRepository.verifyReplyOwnership(userId, replyId);
    await this._replyRepository.deleteReply(replyId);
  }

  _verifyAddReplyPayload({ threadId, commentId, content }) {
    if (!threadId || !commentId || !content) {
      throw new Error('MISSING_REQUIRED_PROPERTIES');
    }
    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof content !== 'string') {
      throw new Error('DATA_TYPE_MISMATCH');
    }
  }

  _verifyDeleteReplyPayload({ threadId, commentId, replyId }) {
    if (!threadId || !commentId || !replyId) {
      throw new Error('MISSING_REQUIRED_PROPERTIES');
    }
    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof replyId !== 'string') {
      throw new Error('DATA_TYPE_MISMATCH');
    }
  }
}

module.exports = ReplyUseCases;
