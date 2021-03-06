const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentUseCases = require('../CommentUseCases');

describe('CommentUseCases', () => {
  describe('addComment', () => {
    it('should throw Error if payload is missing one or more required properties', async () => {
      const userId = 'user-1';
      const useCasePayload = {
        threadId: 'thread-1',
      };
      const commentUseCases = new CommentUseCases({});

      await expect(commentUseCases.addComment(userId, useCasePayload))
        .rejects
        .toThrowError('MISSING_REQUIRED_PROPERTIES');
    });

    it('should throw Error if one or more payload properties does not match specified data type', async () => {
      const userId = 'user-1';
      const useCasePayload = {
        threadId: 123,
        content: {},
      };
      const commentUseCases = new CommentUseCases({});

      await expect(commentUseCases.addComment(userId, useCasePayload))
        .rejects
        .toThrowError('DATA_TYPE_MISMATCH');
    });

    it('should orchestrate add comment action correctly', async () => {
      const userId = 'user-1';
      const useCasePayload = {
        threadId: 'thread-1',
        content: 'Content',
      };
      const expected = {
        id: 'comment-1',
        content: useCasePayload.content,
        owner: userId,
      };

      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();

      mockThreadRepository.isExistingThread = jest.fn(() => Promise.resolve());
      mockCommentRepository.addComment = jest.fn(() => Promise.resolve({
        id: 'comment-1',
        content: 'Content',
        owner: 'user-1',
      }));

      const commentUseCases = new CommentUseCases({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      const actual = await commentUseCases.addComment(userId, useCasePayload);

      expect(actual).toStrictEqual(expected);
      expect(mockThreadRepository.isExistingThread)
        .toBeCalledWith(useCasePayload.threadId);
      expect(mockCommentRepository.addComment)
        .toBeCalledWith(userId, useCasePayload.threadId, useCasePayload.content);
    });
  });

  describe('deleteComment', () => {
    it('should throw Error if payload is missing one or more required properties', async () => {
      const userId = 'user-1';
      const useCasePayload = {
        threadId: 'thread-1',
      };
      const commentUseCases = new CommentUseCases({});

      await expect(commentUseCases.deleteComment(userId, useCasePayload))
        .rejects
        .toThrowError('MISSING_REQUIRED_PROPERTIES');
    });

    it('should throw Error if one or more payload properties does not match specified data type', async () => {
      const userId = 'user-1';
      const useCasePayload = {
        threadId: 123,
        commentId: {},
      };
      const commentUseCases = new CommentUseCases({});

      await expect(commentUseCases.deleteComment(userId, useCasePayload))
        .rejects
        .toThrowError('DATA_TYPE_MISMATCH');
    });

    it('should orchestrate delete comment action correctly', async () => {
      const userId = 'user-1';
      const useCasePayload = {
        threadId: 'thread-1',
        commentId: 'comment-1',
      };

      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();

      mockCommentRepository.isExistingComment = jest.fn(() => Promise.resolve());
      mockCommentRepository.verifyCommentOwnership = jest.fn(() => Promise.resolve());
      mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());

      const commentUseCases = new CommentUseCases({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      await commentUseCases.deleteComment(userId, useCasePayload);

      expect(mockCommentRepository.isExistingComment)
        .toBeCalledWith(useCasePayload.threadId, useCasePayload.commentId);
      expect(mockCommentRepository.verifyCommentOwnership)
        .toBeCalledWith(userId, useCasePayload.commentId);
      expect(mockCommentRepository.deleteComment)
        .toBeCalledWith(useCasePayload.commentId);
    });
  });

  describe('toggleCommentLikeStatus', () => {
    it('should throw Error if payload is missing one or more required properties', async () => {
      const userId = 'user-1';
      const useCasePayload = {
        threadId: 'thread-1',
      };
      const commentUseCases = new CommentUseCases({});

      await expect(commentUseCases.toggleCommentLikeStatus(userId, useCasePayload))
        .rejects
        .toThrowError('MISSING_REQUIRED_PROPERTIES');
    });

    it('should throw Error if one or more payload properties does not match specified data type', async () => {
      const userId = 'user-1';
      const useCasePayload = {
        threadId: 123,
        commentId: {},
      };
      const commentUseCases = new CommentUseCases({});

      await expect(commentUseCases.toggleCommentLikeStatus(userId, useCasePayload))
        .rejects
        .toThrowError('DATA_TYPE_MISMATCH');
    });

    it('should orchestrate like comment action correctly', async () => {
      const userId = 'user-1';
      const useCasePayload = {
        threadId: 'thread-1',
        commentId: 'comment-1',
      };

      const mockCommentRepository = new CommentRepository();

      mockCommentRepository.isExistingComment = jest.fn(() => Promise.resolve());
      mockCommentRepository.likeComment = jest.fn(() => Promise.resolve());

      const commentUseCases = new CommentUseCases({
        commentRepository: mockCommentRepository,
      });

      await commentUseCases.toggleCommentLikeStatus(userId, useCasePayload);

      expect(mockCommentRepository.isExistingComment)
        .toBeCalledWith(useCasePayload.threadId, useCasePayload.commentId);
      expect(mockCommentRepository.likeComment)
        .toBeCalledWith(userId, useCasePayload.commentId);
    });

    it('should orchestrate unlike comment action correctly', async () => {
      const userId = 'user-1';
      const useCasePayload = {
        threadId: 'thread-1',
        commentId: 'comment-1',
      };

      const mockCommentRepository = new CommentRepository();

      mockCommentRepository.isExistingComment = jest.fn(() => Promise.resolve());
      mockCommentRepository.likeComment = jest.fn(() => Promise.reject());
      mockCommentRepository.unlikeComment = jest.fn(() => Promise.resolve());

      const commentUseCases = new CommentUseCases({
        commentRepository: mockCommentRepository,
      });

      await commentUseCases.toggleCommentLikeStatus(userId, useCasePayload);

      expect(mockCommentRepository.isExistingComment)
        .toBeCalledWith(useCasePayload.threadId, useCasePayload.commentId);
      expect(mockCommentRepository.likeComment)
        .toBeCalledWith(userId, useCasePayload.commentId);
      expect(mockCommentRepository.unlikeComment)
        .toBeCalledWith(userId, useCasePayload.commentId);
    });
  });
});
