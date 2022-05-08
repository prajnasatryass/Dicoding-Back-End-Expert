class ReplyRepository {
  async addReply(ownerId, content) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }

  async getCommentReplies(commentId) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }

  async deleteReply(id) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }

  async isExistingReply(commentId, id) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }

  async verifyReplyOwnership(ownerId, id) {
    throw new Error('METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ReplyRepository;
