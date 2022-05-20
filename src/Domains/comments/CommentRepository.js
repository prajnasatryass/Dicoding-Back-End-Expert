class CommentRepository {
  async addComment(ownerId, content) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }

  async getThreadComments(threadId) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }

  async deleteComment(id) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }

  async isExistingComment(threadId, id) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }

  async verifyCommentOwnership(ownerId, id) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }

  async toggleCommentLikeStatus(userId, id) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = CommentRepository;
