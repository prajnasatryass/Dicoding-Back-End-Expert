const { HttpMethods } = require('../../../../Commons/utils/constants');

const baseRoute = '/threads';

const routes = (handler) => ([
  {
    method: HttpMethods.POST,
    path: baseRoute,
    handler: handler.createThreadHandler,
    options: {
      auth: 'auth_jwt',
    },
  },
  {
    method: HttpMethods.GET,
    path: `${baseRoute}/{threadId}`,
    handler: handler.getThreadHandler,
  },
]);

module.exports = routes;
