const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadUseCases = require('../ThreadUseCases');
const Comment = require('../../../Domains/comments/entities/Comment');
const Reply = require('../../../Domains/replies/entities/Reply');

describe('ThreadUseCases', () => {
  describe('createThread', () => {
    it('should orchestrate create thread action correctly', async () => {
      const userId = 'user-1';
      const useCasePayload = {
        title: 'Title',
        body: 'Body',
      };
      const expected = {
        id: 'thread-1',
        title: useCasePayload.title,
        owner: userId,
      };

      const mockThreadRepository = new ThreadRepository();

      mockThreadRepository.createThread = jest.fn(() => Promise.resolve({
        id: 'thread-1',
        title: 'Title',
        owner: 'user-1',
      }));

      const threadUseCases = new ThreadUseCases({
        threadRepository: mockThreadRepository,
      });

      const actual = await threadUseCases.createThread(userId, useCasePayload);

      expect(actual).toStrictEqual(expected);
      expect(mockThreadRepository.createThread).toBeCalledWith(userId, new NewThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
      }));
    });
  });

  describe('getThread', () => {
    it('should throw Error if payload does not contain thread ID', async () => {
      const useCasePayload = {};
      const threadUseCases = new ThreadUseCases({});

      await expect(threadUseCases.getThread(useCasePayload))
        .rejects
        .toThrowError('THREAD.MISSING_THREAD_ID');
    });

    it('should throw Error if thread ID data type is not string', async () => {
      const useCasePayload = {
        threadId: 123,
      };
      const threadUseCases = new ThreadUseCases({});

      await expect(threadUseCases.getThread(useCasePayload))
        .rejects
        .toThrowError('DATA_TYPE_MISMATCH');
    });

    it('should orchestrate get thread action correctly', async () => {
      const useCasePayload = {
        threadId: 'thread-1',
      };
      const expected = {
        id: 'thread-1',
        title: 'Title',
        body: 'Body',
        date: '2022-01-01T00:00:00.000Z',
        username: 'John10',
        comments: [
          new Comment({
            id: 'comment-1',
            username: 'John10',
            date: '2022-01-01T00:00:00.000Z',
            content: 'Content',
            deleted_at: '2022-01-01T00:00:00.000Z',
            likeCount: 0,
            replies: [new Reply({
              id: 'reply-1',
              username: 'John10',
              date: '2022-01-01T00:00:00.000Z',
              content: 'Content',
            })],
          }),
          new Comment({
            id: 'comment-2',
            username: 'John10',
            date: '2022-01-01T00:00:00.000Z',
            content: 'Content',
            likeCount: 0,
            replies: [new Reply({
              id: 'reply-2',
              username: 'John10',
              date: '2022-01-01T00:00:00.000Z',
              content: 'Content',
              deleted_at: '2022-01-01T00:00:00.000Z',
            })],
          }),
        ],
      };

      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      mockThreadRepository.getThread = jest.fn(() => Promise.resolve({
        id: 'thread-1',
        title: 'Title',
        body: 'Body',
        date: '2022-01-01T00:00:00.000Z',
        username: 'John10',
      }));
      mockCommentRepository.getThreadComments = jest.fn(() => Promise.resolve([
        {
          id: 'comment-1',
          username: 'John10',
          date: '2022-01-01T00:00:00.000Z',
          content: 'Content',
          deleted_at: '2022-01-01T00:00:00.000Z',
          likeCount: 0,
        },
        {
          id: 'comment-2',
          username: 'John10',
          date: '2022-01-01T00:00:00.000Z',
          content: 'Content',
          deleted_at: null,
          likeCount: 0,
        },
      ]));
      mockReplyRepository.getCommentsReplies = jest.fn(() => Promise.resolve([
        {
          id: 'reply-1',
          comment_id: 'comment-1',
          username: 'John10',
          date: '2022-01-01T00:00:00.000Z',
          content: 'Content',
          deleted_at: null,
        },
        {
          id: 'reply-2',
          comment_id: 'comment-2',
          username: 'John10',
          date: '2022-01-01T00:00:00.000Z',
          content: 'Content',
          deleted_at: '2022-01-01T00:00:00.000Z',
        },
      ]));

      const threadUseCases = new ThreadUseCases({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
      });

      const actual = await threadUseCases.getThread(useCasePayload);

      expect(actual).toStrictEqual(expected);
      expect(mockThreadRepository.getThread).toBeCalledWith(useCasePayload.threadId);
      expect(mockCommentRepository.getThreadComments).toBeCalledWith(useCasePayload.threadId);
      expect(mockReplyRepository.getCommentsReplies).toBeCalledWith(['comment-1', 'comment-2']);
    });
  });
});
