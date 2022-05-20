const { HttpMethods } = require('../../../Commons/utils/constants');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/users endpoint', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /users', () => {
    it('should return 201 response and added user', async () => {
      const requestPayload = {
        username: 'John10',
        password: 'secret',
        fullname: 'John Doe',
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: HttpMethods.POST,
        url: '/users',
        payload: requestPayload,
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(201);
      expect(responsePayload.status).toStrictEqual('success');
      expect(responsePayload.data.addedUser).toBeDefined();
    });

    it('should return 400 response if request payload is missing one or more required properties', async () => {
      const requestPayload = {
        username: 'John10',
        password: 'secret',
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: HttpMethods.POST,
        url: '/users',
        payload: requestPayload,
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responsePayload.status).toStrictEqual('fail');
      expect(responsePayload.message).toBeDefined();
    });

    it('should return 400 response if one or more request payload properties does not match specified data type', async () => {
      const requestPayload = {
        username: 123,
        password: 'secret',
        fullname: ['John Doe'],
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: HttpMethods.POST,
        url: '/users',
        payload: requestPayload,
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responsePayload.status).toStrictEqual('fail');
      expect(responsePayload.message).toBeDefined();
    });

    it('should return 400 response if username length exceeds 50 characters', async () => {
      const requestPayload = {
        username: 'loremipsumloremipsumloremipsumloremipsumloremipsumloremipsum',
        password: 'secret',
        fullname: 'John Doe',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: HttpMethods.POST,
        url: '/users',
        payload: requestPayload,
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responsePayload.status).toStrictEqual('fail');
      expect(responsePayload.message).toBeDefined();
    });

    it('should response 400 when username contain restricted character', async () => {
      const requestPayload = {
        username: 'John10!@#',
        password: 'secret',
        fullname: 'John Doe',
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: HttpMethods.POST,
        url: '/users',
        payload: requestPayload,
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responsePayload.status).toStrictEqual('fail');
      expect(responsePayload.message).toBeDefined();
    });

    it('should return 400 response if username is already taken', async () => {
      await UsersTableTestHelper.addUser({ username: 'John10' });
      const requestPayload = {
        username: 'John10',
        password: 'secret',
        fullname: 'John Doe',
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: HttpMethods.POST,
        url: '/users',
        payload: requestPayload,
      });

      const responsePayload = JSON.parse(response.payload);
      expect(response.statusCode).toStrictEqual(400);
      expect(responsePayload.status).toStrictEqual('fail');
      expect(responsePayload.message).toBeDefined();
    });
  });
});
