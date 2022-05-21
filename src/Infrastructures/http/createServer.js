const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const ClientError = require('../../Commons/exceptions/ClientError');
const DomainErrorTranslator = require('../../Commons/exceptions/DomainErrorTranslator');
const users = require('../../Interfaces/http/api/users');
const authentications = require('../../Interfaces/http/api/authentications');
const threads = require('../../Interfaces/http/api/threads');
const comments = require('../../Interfaces/http/api/comments');
const replies = require('../../Interfaces/http/api/replies');

const createServer = async (container) => {
  const server = Hapi.server({
    host: 'localhost',
    port: '5000',
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('auth_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
        username: artifacts.decoded.payload.username,
      },
    }),
  });

  await server.register([
    {
      plugin: users,
      options: { container },
    },
    {
      plugin: authentications,
      options: { container },
    },
    {
      plugin: threads,
      options: { container },
    },
    {
      plugin: comments,
      options: { container },
    },
    {
      plugin: replies,
      options: { container },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(response);

      if (translatedError instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: translatedError.message,
        }).code(translatedError.statusCode);
      }

      if (!translatedError.isServer) {
        return h.continue;
      }

      return h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      }).code(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return h.continue;
  });

  server.events.on('response', (request) => {
    console.log(`
    ${new Date().toISOString()}
    ${request.info.remoteAddress}: ${request.method.toUpperCase()} ${request.url.pathname}${request.url.search} - ${request.response.statusCode} ${getReasonPhrase(request.response.statusCode)}
    ${JSON.stringify(request.response.source)}
    `);
  });

  return server;
};

module.exports = createServer;
