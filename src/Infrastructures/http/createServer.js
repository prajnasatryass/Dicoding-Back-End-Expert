const Hapi = require('@hapi/hapi');
const { getReasonPhrase } = require('http-status-codes');
const ClientError = require('../../Commons/exceptions/ClientError');
const DomainErrorTranslator = require('../../Commons/exceptions/DomainErrorTranslator');
const users = require('../../Interfaces/http/api/users');
const authentications = require('../../Interfaces/http/api/authentications');

const createServer = async (container) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
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
  ]);

  server.events.on('request', (request) => {
    console.log(`\n${new Date().toISOString()}\n${request.info.remoteAddress}: ${request.method.toUpperCase()} ${request.url.pathname}${request.url.search}`);
  });

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(response);

      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: translatedError.message,
        });
        newResponse.code(translatedError.statusCode);
        return newResponse;
      }

      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!translatedError.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  server.events.on('response', (request) => {
    console.log(`\n${new Date().toISOString()}\n${request.info.remoteAddress}: ${request.method.toUpperCase()} ${request.url.pathname}${request.url.search} - ${request.response.statusCode} ${getReasonPhrase(request.response.statusCode)}`);
  });

  return server;
};

module.exports = createServer;
