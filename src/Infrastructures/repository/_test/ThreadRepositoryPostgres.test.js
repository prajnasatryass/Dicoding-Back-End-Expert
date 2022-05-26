const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('createThread', () => {
    it('should persist thread entry', async () => {
      const userId = 'user-1';
      const newThread = new NewThread({
        title: 'Title',
        body: 'Body',
      });
      const fakeIdGenerator = () => '1';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({});

      await threadRepositoryPostgres.createThread(userId, newThread);

      const thread = await ThreadsTableTestHelper.findThread('thread-1');
      expect(thread).toHaveLength(1);
    });

    it('should return added thread', async () => {
      const userId = 'user-1';
      const newThread = new NewThread({
        title: 'Title',
        body: 'Body',
      });
      const fakeIdGenerator = () => '1';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({});

      const addedThread = await threadRepositoryPostgres.createThread(userId, newThread);

      expect(addedThread).toStrictEqual({
        id: 'thread-1',
        title: 'Title',
        owner: 'user-1',
      });
    });
  });

  describe('getThread', () => {
    it('should throw NotFoundError if thread does not exist', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.getThread('thread-1')).rejects.toThrowError(NotFoundError);
    });

    it('should return thread', async () => {
      const expected = {
        id: 'thread-1',
        title: 'Title',
        body: 'Body',
        date: '2022-01-01T00:00:00.000Z',
        username: 'John10',
      };
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: 'user-1', username: expected.username });
      await ThreadsTableTestHelper.createThread({
        id: 'thread-1', title: 'Title', body: 'Body', ownerId: 'user-1',
      });

      const thread = await threadRepositoryPostgres.getThread('thread-1');

      expect(thread.id).toStrictEqual(expected.id);
      expect(thread.title).toStrictEqual(expected.title);
      expect(thread.body).toStrictEqual(expected.body);
      expect(thread.date).toBeDefined();
      expect(thread.username).toStrictEqual(expected.username);
    });
  });

  describe('isExistingThread', () => {
    it('should throw NotFoundError if thread does not exist', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.isExistingThread('thread-1')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError if thread exists', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.createThread({ id: 'thread-1' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.isExistingThread('thread-1')).resolves.not.toThrowError(NotFoundError);
    });
  });
});
