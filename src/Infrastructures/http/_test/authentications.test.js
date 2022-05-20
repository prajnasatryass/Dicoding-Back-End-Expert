const { HttpMethods } = require('../../../Commons/utils/constants');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const TokenManager = require('../../../Applications/security/TokenManager');
const container = require('../../container');
const createServer = require('../createServer');

describe('/authentications endpoint', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /authentications', () => {
    it('should return 201 response and new access and refresh token', async () => {
      const requestPayload = {
        username: 'John10',
        password: 'secret',
      };
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

      const response = await server.inject({
        method: HttpMethods.POST,
        url: '/authentications',
        payload: requestPayload,
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(201);
      expect(responsePayload.status).toStrictEqual('success');
      expect(responsePayload.data.accessToken).toBeDefined();
      expect(responsePayload.data.refreshToken).toBeDefined();
    });

    it('should return 400 response if username is not found', async () => {
      const requestPayload = {
        username: 'John10',
        password: 'secret',
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: HttpMethods.POST,
        url: '/authentications',
        payload: requestPayload,
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responsePayload.status).toStrictEqual('fail');
      expect(responsePayload.message).toBeDefined();
    });

    it('should return 401 response if password is incorrect', async () => {
      const requestPayload = {
        username: 'John10',
        password: 'wrong_password',
      };
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

      const response = await server.inject({
        method: HttpMethods.POST,
        url: '/authentications',
        payload: requestPayload,
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(401);
      expect(responsePayload.status).toStrictEqual('fail');
      expect(responsePayload.message).toBeDefined();
    });

    it('should return 400 response if login payload is missing one or more required properties', async () => {
      const requestPayload = {
        username: 'John10',
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: HttpMethods.POST,
        url: '/authentications',
        payload: requestPayload,
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responsePayload.status).toStrictEqual('fail');
      expect(responsePayload.message).toBeDefined();
    });

    it('should response 400 if one or more payload properties does not match specified data type', async () => {
      const requestPayload = {
        username: 123,
        password: {},
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: HttpMethods.POST,
        url: '/authentications',
        payload: requestPayload,
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responsePayload.status).toStrictEqual('fail');
      expect(responsePayload.message).toBeDefined();
    });
  });

  describe('PUT /authentications', () => {
    it('should return 200 response and new access token', async () => {
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
      const { data: { refreshToken } } = JSON.parse(loginResponse.payload);

      const response = await server.inject({
        method: HttpMethods.PUT,
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(200);
      expect(responsePayload.status).toStrictEqual('success');
      expect(responsePayload.data.accessToken).toBeDefined();
    });

    it('should return 400 response if payload does not contain refresh token', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: HttpMethods.PUT,
        url: '/authentications',
        payload: {},
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responsePayload.status).toStrictEqual('fail');
      expect(responsePayload.message).toBeDefined();
    });

    it('should return 400 response if refresh token data type is not string', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: HttpMethods.PUT,
        url: '/authentications',
        payload: {
          refreshToken: 123,
        },
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responsePayload.status).toStrictEqual('fail');
      expect(responsePayload.message).toBeDefined();
    });

    it('should return 400 response if refresh token is invalid', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: HttpMethods.PUT,
        url: '/authentications',
        payload: {
          refreshToken: 'invalid_refresh_token',
        },
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responsePayload.status).toStrictEqual('fail');
      expect(responsePayload.message).toBeDefined();
    });

    it('should return 400 response if refresh token is not registered in database', async () => {
      const server = await createServer(container);
      const refreshToken = await container.getInstance(TokenManager.name).createRefreshToken({ id: 'user-1', username: 'John10' });

      const response = await server.inject({
        method: HttpMethods.PUT,
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responsePayload.status).toStrictEqual('fail');
      expect(responsePayload.message).toBeDefined();
    });
  });

  describe('DELETE /authentications', () => {
    it('should return 200 response if refresh token is deleted successfully', async () => {
      const server = await createServer(container);
      const refreshToken = 'refresh_token';
      await AuthenticationsTableTestHelper.addToken(refreshToken);

      const response = await server.inject({
        method: HttpMethods.DELETE,
        url: '/authentications',
        payload: {
          refreshToken,
        },
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(200);
      expect(responsePayload.status).toStrictEqual('success');
    });

    it('should return 400 response if payload does not contain refresh token', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: HttpMethods.DELETE,
        url: '/authentications',
        payload: {},
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responsePayload.status).toStrictEqual('fail');
      expect(responsePayload.message).toBeDefined();
    });

    it('should response 400 if refresh token data type is not string', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: HttpMethods.DELETE,
        url: '/authentications',
        payload: {
          refreshToken: 123,
        },
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responsePayload.status).toStrictEqual('fail');
      expect(responsePayload.message).toBeDefined();
    });
  });
});
