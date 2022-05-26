const { HttpMethods } = require('../../../Commons/utils/constants');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

let Authorization = '';
let ActiveUserId = '';
let ActiveUsername = '';

describe('/threads/{threadId}/comments endpoint', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();

    const server = await createServer(container);
    await server.inject({
      method: HttpMethods.POST,
      url: '/users',
      payload: {
        username: 'John10',
        password: 'secret',
        fullname: 'John Doe',
      },
    });

    const loginResponse = await server.inject({
      method: HttpMethods.POST,
      url: '/authentications',
      payload: {
        username: 'John10',
        password: 'secret',
      },
    });
    const { data: { user, accessToken } } = JSON.parse(loginResponse.payload);
    Authorization = `Bearer ${accessToken}`;
    ActiveUserId = user.id;
    ActiveUsername = user.username;
  });

  afterEach(async () => {
    await UsersTableTestHelper.deleteUser({});
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /threads/{threadId}/comments', () => {
    it('should return 201 response and added comment', async () => {
      const threadId = 'thread-1';
      const requestPayload = {
        content: 'Content',
      };
      const server = await createServer(container);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.createThread({ id: threadId });

      const response = await server.inject({
        method: HttpMethods.POST,
        url: `/threads/${threadId}/comments`,
        headers: {
          Authorization,
        },
        payload: requestPayload,
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(201);
      expect(responsePayload.status).toStrictEqual('success');
      expect(responsePayload.data.addedComment).toBeDefined();
    });

    it('should return 401 response if request does not have authorization header', async () => {
      const requestPayload = {};
      const server = await createServer(container);

      const response = await server.inject({
        method: HttpMethods.POST,
        url: '/threads/thread-1/comments',
        payload: requestPayload,
      });

      expect(response.statusCode).toStrictEqual(401);
    });

    it('should return 400 response if payload is missing one or more required properties', async () => {
      const threadId = 'thread-1';
      const requestPayload = {};
      const server = await createServer(container);

      const response = await server.inject({
        method: HttpMethods.POST,
        url: `/threads/${threadId}/comments`,
        headers: {
          Authorization,
        },
        payload: requestPayload,
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responsePayload.status).toStrictEqual('fail');
      expect(responsePayload.message).toBeDefined();
    });

    it('should return 400 response if one or more payload properties does not match specified data type', async () => {
      const threadId = 'thread-1';
      const requestPayload = {
        content: 123,
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: HttpMethods.POST,
        url: `/threads/${threadId}/comments`,
        headers: {
          Authorization,
        },
        payload: requestPayload,
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responsePayload.status).toStrictEqual('fail');
      expect(responsePayload.message).toBeDefined();
    });

    it('should return 404 response if thread does not exist', async () => {
      const threadId = 'thread-1';
      const requestPayload = {
        content: 'Content',
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: HttpMethods.POST,
        url: `/threads/${threadId}/comments`,
        headers: {
          Authorization,
        },
        payload: requestPayload,
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(404);
      expect(responsePayload.status).toStrictEqual('fail');
      expect(responsePayload.message).toBeDefined();
    });
  });

  describe('DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should return 200 response if comment deletion is successful', async () => {
      const threadId = 'thread-1';
      const commentId = 'comment-1';
      const server = await createServer(container);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.createThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId, ownerId: ActiveUserId });

      const response = await server.inject({
        method: HttpMethods.DELETE,
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization,
        },
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(200);
      expect(responsePayload.status).toStrictEqual('success');
    });

    it('should return 401 response if request does not have authorization header', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: HttpMethods.DELETE,
        url: '/threads/thread-1/comments/comment-1',
      });

      expect(response.statusCode).toStrictEqual(401);
    });

    it('should return 404 response if thread does not exist', async () => {
      const threadId = 'thread-1';
      const commentId = 'comment-1';
      const server = await createServer(container);

      const response = await server.inject({
        method: HttpMethods.DELETE,
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization,
        },
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(404);
      expect(responsePayload.status).toStrictEqual('fail');
      expect(responsePayload.message).toBeDefined();
    });

    it('should return 404 response if comment does not exist', async () => {
      const threadId = 'thread-1';
      const commentId = 'comment-1';
      const server = await createServer(container);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.createThread({ id: threadId });

      const response = await server.inject({
        method: HttpMethods.DELETE,
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization,
        },
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(404);
      expect(responsePayload.status).toStrictEqual('fail');
      expect(responsePayload.message).toBeDefined();
    });

    it('should return 403 response if comment is not owned by user', async () => {
      const threadId = 'thread-1';
      const commentId = 'comment-1';
      const server = await createServer(container);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.createThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId });

      const response = await server.inject({
        method: HttpMethods.DELETE,
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization,
        },
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(403);
      expect(responsePayload.status).toStrictEqual('fail');
      expect(responsePayload.message).toBeDefined();
    });
  });

  describe('PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should return 200 response if liking comment is successful', async () => {
      const threadId = 'thread-1';
      const commentId = 'comment-1';
      const server = await createServer(container);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.createThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId });

      const response = await server.inject({
        method: HttpMethods.PUT,
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization,
        },
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(200);
      expect(responsePayload.status).toStrictEqual('success');
    });

    it('should return 200 response if unliking comment is successful', async () => {
      const threadId = 'thread-1';
      const commentId = 'comment-1';
      const server = await createServer(container);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.createThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId });
      await CommentLikesTableTestHelper.likeComment({ commentId, userId: ActiveUserId });

      const response = await server.inject({
        method: HttpMethods.PUT,
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization,
        },
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(200);
      expect(responsePayload.status).toStrictEqual('success');
    });

    it('should return 401 response if request does not have authorization header', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: HttpMethods.PUT,
        url: '/threads/thread-1/comments/comment-1/likes',
      });

      expect(response.statusCode).toStrictEqual(401);
    });

    it('should return 404 response if thread does not exist', async () => {
      const threadId = 'thread-1';
      const commentId = 'comment-1';
      const server = await createServer(container);

      const response = await server.inject({
        method: HttpMethods.PUT,
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization,
        },
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(404);
      expect(responsePayload.status).toStrictEqual('fail');
      expect(responsePayload.message).toBeDefined();
    });

    it('should return 404 response if comment does not exist', async () => {
      const threadId = 'thread-1';
      const commentId = 'comment-1';
      const server = await createServer(container);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.createThread({ id: threadId });

      const response = await server.inject({
        method: HttpMethods.PUT,
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization,
        },
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(404);
      expect(responsePayload.status).toStrictEqual('fail');
      expect(responsePayload.message).toBeDefined();
    });
  });
});
