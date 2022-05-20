const CommentRepository = require('../CommentRepository');

describe('CommentRepository', () => {
  it('should throw Error if methods are invoked', async () => {
    const commentRepository = new CommentRepository();

    await expect(commentRepository.addComment('', '')).rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.getThreadComments('')).rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.deleteComment('')).rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.isExistingComment('', '')).rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.verifyCommentOwnership('', '')).rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.toggleCommentLikeStatus('', '')).rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
  });
});
