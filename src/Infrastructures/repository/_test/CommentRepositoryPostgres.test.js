const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await CommentLikesTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await CommentLikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment', () => {
    it('should persist comment entry', async () => {
      const userId = 'user-1';
      const threadId = 'thread-1';
      const content = 'Content';
      const fakeIdGenerator = () => '1';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepositoryPostgres.addComment(userId, threadId, content);

      const comment = await CommentsTableTestHelper.findComment('comment-1');
      expect(comment).toHaveLength(1);
    });

    it('should return added comment', async () => {
      const userId = 'user-1';
      const threadId = 'thread-1';
      const content = 'Content';
      const fakeIdGenerator = () => '1';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const addedComment = await commentRepositoryPostgres.addComment(userId, threadId, content);

      expect(addedComment).toStrictEqual({
        id: 'comment-1',
        content,
        owner: userId,
      });
    });
  });

  describe('getThreadComments', () => {
    it('should return comments', async () => {
      const userId = 'user-1';
      const threadId = 'thread-1';
      const expected = [{
        id: 'comment-1',
        username: 'John10',
        date: '2022-01-01T00:00:00.000Z',
        content: 'Content',
        like_count: '1',
      }];
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: userId, username: expected[0].username });
      await CommentsTableTestHelper.addComment({
        id: expected[0].id, threadId, ownerId: userId, content: expected[0].content,
      });
      await CommentLikesTableTestHelper.likeComment({ commentId: expected[0].id, userId });

      const comments = await commentRepositoryPostgres.getThreadComments(threadId);

      expect(comments).toHaveLength(1);
      expect(comments[0].id).toStrictEqual(expected[0].id);
      expect(comments[0].username).toStrictEqual(expected[0].username);
      expect(comments[0].date).toBeDefined();
      expect(comments[0].content).toStrictEqual(expected[0].content);
      expect(comments[0].like_count).toStrictEqual(expected[0].like_count);
    });
  });

  describe('deleteComment', () => {
    it('should throw NotFoundError if comment does not exist', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.deleteComment('comment-1')).rejects.toThrowError(NotFoundError);
    });

    it('should delete comment correctly', async () => {
      const userId = 'user-1';
      const threadId = 'thread-1';
      const commentId = 'comment-1';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId });

      await commentRepositoryPostgres.deleteComment(commentId);
      const comments = await commentRepositoryPostgres.getThreadComments(threadId);

      expect(comments).toHaveLength(1);
      expect(comments[0].id).toStrictEqual(commentId);
      expect(comments[0].deleted_at).toBeDefined();
    });
  });

  describe('isExistingComment', () => {
    it('should throw NotFoundError if comment does not exist', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.isExistingComment('thread-1', 'comment-1')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError if comment exists', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-1', threadId: 'thread-1' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.isExistingComment('thread-1', 'comment-1')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwnership', () => {
    it('should throw NotFoundError if comment does not exist', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwnership('user-1', 'comment-1')).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError if comment is not owned by user', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-1', ownerId: 'user-2' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwnership('user-1', 'comment-1')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError if comment is owned by user', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-1', ownerId: 'user-1' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwnership('user-1', 'comment-1')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('likeComment', () => {
    const userId = 'user-1';
    const commentId = 'comment-1';

    it('should throw Error if user already likes the comment', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await CommentLikesTableTestHelper.likeComment({ userId, commentId });

      await expect(commentRepositoryPostgres.likeComment(userId, commentId))
        .rejects.toThrowError(Error);
    });

    it('should like comment correctly', async () => {
      const fakeIdGenerator = () => '1';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepositoryPostgres.likeComment(userId, commentId);

      const likeCount = await CommentLikesTableTestHelper.getLikeCount(commentId);
      expect(likeCount).toBe('1');
    });
  });

  describe('unlikeComment', () => {
    it('should throw NotFoundError if comment like does not exist', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.unlikeComment('user-1', 'comment-1')).rejects.toThrowError(NotFoundError);
    });

    it('should unlike comment correctly', async () => {
      const userId = 'user-1';
      const commentId = 'comment-1';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await CommentLikesTableTestHelper.likeComment({ userId, commentId });

      await commentRepositoryPostgres.unlikeComment(userId, commentId);

      const likeCount = await CommentLikesTableTestHelper.getLikeCount(commentId);
      expect(likeCount).toBe('0');
    });
  });
});
