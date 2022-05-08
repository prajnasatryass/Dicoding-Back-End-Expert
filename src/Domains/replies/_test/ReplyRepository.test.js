const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository', () => {
  it('should throw Error if methods are invoked', async () => {
    const replyRepository = new ReplyRepository();

    await expect(replyRepository.addReply('', '')).rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.getCommentReplies('')).rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.deleteReply('')).rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.isExistingReply('', '')).rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.verifyReplyOwnership('', '')).rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
  });
});
