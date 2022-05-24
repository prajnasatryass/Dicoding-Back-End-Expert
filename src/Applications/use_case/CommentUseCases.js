class CommentUseCases {
  constructor({
    threadRepository, commentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async addComment(userId, useCasePayload) {
    this._verifyAddCommentPayload(useCasePayload);
    const { threadId, content } = useCasePayload;
    await this._threadRepository.isExistingThread(threadId);
    return this._commentRepository.addComment(userId, threadId, content);
  }

  async deleteComment(userId, useCasePayload) {
    this._verifyDeleteCommentPayload(useCasePayload);
    const { threadId, commentId } = useCasePayload;
    await this._threadRepository.isExistingThread(threadId);
    await this._commentRepository.isExistingComment(threadId, commentId);
    await this._commentRepository.verifyCommentOwnership(userId, commentId);
    await this._commentRepository.deleteComment(commentId);
  }

  async toggleCommentLikeStatus(userId, useCasePayload) {
    this._verifyToggleCommentLikeStatusPayload(useCasePayload);
    const { threadId, commentId } = useCasePayload;
    await this._threadRepository.isExistingThread(threadId);
    await this._commentRepository.isExistingComment(threadId, commentId);
    try {
      await this._commentRepository.likeComment(userId, commentId);
    } catch {
      await this._commentRepository.unlikeComment(userId, commentId);
    }
  }

  _verifyAddCommentPayload({ threadId, content }) {
    if (!threadId || !content) {
      throw new Error('MISSING_REQUIRED_PROPERTIES');
    }
    if (typeof threadId !== 'string' || typeof content !== 'string') {
      throw new Error('DATA_TYPE_MISMATCH');
    }
  }

  _verifyDeleteCommentPayload({ threadId, commentId }) {
    if (!threadId || !commentId) {
      throw new Error('MISSING_REQUIRED_PROPERTIES');
    }
    if (typeof threadId !== 'string' || typeof commentId !== 'string') {
      throw new Error('DATA_TYPE_MISMATCH');
    }
  }

  _verifyToggleCommentLikeStatusPayload({ threadId, commentId }) {
    if (!threadId || !commentId) {
      throw new Error('MISSING_REQUIRED_PROPERTIES');
    }
    if (typeof threadId !== 'string' || typeof commentId !== 'string') {
      throw new Error('DATA_TYPE_MISMATCH');
    }
  }
}

module.exports = CommentUseCases;
