const { HttpMethods } = require('../../../Commons/utils/constants');
const createServer = require('../createServer');

describe('HTTP server', () => {
  it('should return 401 response if a restricted route is accessed without authorization', async () => {
    const server = await createServer({});

    const response = await server.inject({
      method: HttpMethods.POST,
      url: '/threads',
    });

    expect(response.statusCode).toEqual(401);
  });

  it('should return 404 response if an unregistered route is requested', async () => {
    const server = await createServer({});

    const response = await server.inject({
      method: HttpMethods.GET,
      url: '/unregisteredRoute',
    });

    expect(response.statusCode).toEqual(404);
  });

  it('should return 500 if a server error occurred', async () => {
    const requestPayload = {
      username: 'John10',
      password: 'secret',
      fullname: 'John Doe',
    };
    const server = await createServer({});

    const response = await server.inject({
      method: HttpMethods.POST,
      url: '/users',
      payload: requestPayload,
    });

    const responsePayload = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responsePayload.status).toEqual('error');
    expect(responsePayload.message).toEqual('terjadi kegagalan pada server kami');
  });
});
