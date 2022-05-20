const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ReplyUseCases = require('../ReplyUseCases');

describe('ReplyUseCases', () => {
  describe('addReply', () => {
    it('should throw Error if payload is missing one or more required properties', async () => {
      const userId = 'user-1';
      const useCasePayload = {
        threadId: 'thread-1',
        commentId: 'comment-1',
      };
      const replyUseCases = new ReplyUseCases({});

      await expect(replyUseCases.addReply(userId, useCasePayload))
        .rejects
        .toThrowError('MISSING_REQUIRED_PROPERTIES');
    });

    it('should throw Error if one or more payload properties does not match specified data type', async () => {
      const userId = 'user-1';
      const useCasePayload = {
        threadId: 123,
        commentId: {},
        content: [],
      };
      const replyUseCases = new ReplyUseCases({});

      await expect(replyUseCases.addReply(userId, useCasePayload))
        .rejects
        .toThrowError('DATA_TYPE_MISMATCH');
    });

    it('should orchestrate add reply action correctly', async () => {
      const userId = 'user-1';
      const useCasePayload = {
        threadId: 'thread-1',
        commentId: 'comment-1',
        content: 'Content',
      };
      const expected = {
        id: 'reply-1',
        content: useCasePayload.content,
        owner: userId,
      };

      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      mockThreadRepository.isExistingThread = jest.fn(() => Promise.resolve());
      mockCommentRepository.isExistingComment = jest.fn(() => Promise.resolve());
      mockReplyRepository.addReply = jest.fn(() => Promise.resolve({
        id: 'reply-1',
        content: 'Content',
        owner: 'user-1',
      }));

      const replyUseCases = new ReplyUseCases({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
      });

      const actual = await replyUseCases.addReply(userId, useCasePayload);

      expect(actual).toStrictEqual(expected);
      expect(mockThreadRepository.isExistingThread)
        .toBeCalledWith(useCasePayload.threadId);
      expect(mockCommentRepository.isExistingComment)
        .toBeCalledWith(useCasePayload.threadId, useCasePayload.commentId);
      expect(mockReplyRepository.addReply)
        .toBeCalledWith(userId, useCasePayload.commentId, useCasePayload.content);
    });
  });

  describe('deleteReply', () => {
    it('should throw Error if payload is missing one or more required properties', async () => {
      const userId = 'user-1';
      const useCasePayload = {
        threadId: 'thread-1',
        commentId: 'comment-1',
      };
      const replyUseCases = new ReplyUseCases({});

      await expect(replyUseCases.deleteReply(userId, useCasePayload))
        .rejects
        .toThrowError('MISSING_REQUIRED_PROPERTIES');
    });

    it('should throw Error if one or more payload properties does not match specified data type', async () => {
      const userId = 'user-1';
      const useCasePayload = {
        threadId: 123,
        commentId: {},
        replyId: [],
      };
      const replyUseCases = new ReplyUseCases({});

      await expect(replyUseCases.deleteReply(userId, useCasePayload))
        .rejects
        .toThrowError('DATA_TYPE_MISMATCH');
    });

    it('should orchestrate delete reply action correctly', async () => {
      const userId = 'user-1';
      const useCasePayload = {
        threadId: 'thread-1',
        commentId: 'comment-1',
        replyId: 'reply-1',
      };

      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      mockThreadRepository.isExistingThread = jest.fn(() => Promise.resolve());
      mockCommentRepository.isExistingComment = jest.fn(() => Promise.resolve());
      mockReplyRepository.isExistingReply = jest.fn(() => Promise.resolve());
      mockReplyRepository.verifyReplyOwnership = jest.fn(() => Promise.resolve());
      mockReplyRepository.deleteReply = jest.fn(() => Promise.resolve());

      const replyUseCases = new ReplyUseCases({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
      });

      await replyUseCases.deleteReply(userId, useCasePayload);

      expect(mockThreadRepository.isExistingThread)
        .toBeCalledWith(useCasePayload.threadId);
      expect(mockCommentRepository.isExistingComment)
        .toBeCalledWith(useCasePayload.threadId, useCasePayload.commentId);
      expect(mockReplyRepository.isExistingReply)
        .toBeCalledWith(useCasePayload.commentId, useCasePayload.replyId);
      expect(mockReplyRepository.verifyReplyOwnership)
        .toBeCalledWith(userId, useCasePayload.replyId);
      expect(mockReplyRepository.deleteReply)
        .toBeCalledWith(useCasePayload.replyId);
    });
  });
});
