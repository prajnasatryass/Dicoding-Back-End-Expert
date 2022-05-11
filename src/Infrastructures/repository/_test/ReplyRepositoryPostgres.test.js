const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply', () => {
    it('should persist reply entry', async () => {
      const userId = 'user-1';
      const commentId = 'comment-1';
      const content = 'Content';
      const fakeIdGenerator = () => '1';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await replyRepositoryPostgres.addReply(userId, commentId, content);

      const reply = await RepliesTableTestHelper.findReply('reply-1');
      expect(reply).toHaveLength(1);
    });

    it('should return added reply', async () => {
      const userId = 'user-1';
      const commentId = 'comment-1';
      const content = 'Content';
      const fakeIdGenerator = () => '1';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const addedReply = await replyRepositoryPostgres.addReply(userId, commentId, content);

      expect(addedReply).toStrictEqual({
        id: 'reply-1',
        content,
        owner: userId,
      });
    });
  });

  describe('getCommentReplies', () => {
    it('should return replies', async () => {
      const userId = 'user-1';
      const commentId = 'comment-1';
      const expected = [{
        id: 'reply-1',
        username: 'John10',
        date: '2022-01-01T00:00:00.000Z',
        content: 'Content',
      }];
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: userId, username: expected[0].username });
      await RepliesTableTestHelper.addReply({
        id: expected[0].id, commentId, ownerId: userId, content: expected[0].content,
      });

      const replies = await replyRepositoryPostgres.getCommentReplies(commentId);

      expect(replies).toHaveLength(1);
      expect(replies[0].id).toStrictEqual(expected[0].id);
      expect(replies[0].username).toStrictEqual(expected[0].username);
      expect(replies[0].date).toBeDefined();
      expect(replies[0].content).toStrictEqual(expected[0].content);
    });
  });

  describe('deleteReply', () => {
    it('should throw NotFoundError if reply does not exist', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.deleteReply('reply-1')).rejects.toThrowError(NotFoundError);
    });

    it('should delete reply correctly', async () => {
      const userId = 'user-1';
      const commentId = 'comment-1';
      const replyId = 'reply-1';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: userId });
      await RepliesTableTestHelper.addReply({ id: replyId, commentId });

      await replyRepositoryPostgres.deleteReply(replyId);
      const replies = await replyRepositoryPostgres.getCommentReplies(commentId);

      expect(replies).toHaveLength(1);
      expect(replies[0].id).toStrictEqual(replyId);
      expect(replies[0].deleted).toStrictEqual(true);
    });
  });

  describe('isExistingReply', () => {
    it('should throw NotFoundError if reply does not exist', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.isExistingReply('comment-1', 'reply-1')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError if reply exists', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-1', commentId: 'comment-1' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.isExistingReply('comment-1', 'reply-1')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwnership', () => {
    it('should throw NotFoundError if reply does not exist', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwnership('user-1', 'reply-1')).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError if reply is not owned by user', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-1', ownerId: 'user-2' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwnership('user-1', 'reply-1')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError if reply is owned by user', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-1', ownerId: 'user-1' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwnership('user-1', 'reply-1')).resolves.not.toThrowError(AuthorizationError);
    });
  });
});
