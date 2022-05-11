const { HttpMethods } = require('../../../../Commons/utils/constants');

const baseRoute = '/threads/{threadId}/comments';

const routes = (handler) => ([
  {
    method: HttpMethods.POST,
    path: baseRoute,
    handler: handler.addCommentHandler,
    options: {
      auth: process.env.APP_AUTH_STRATEGY_NAME,
    },
  },
  {
    method: HttpMethods.DELETE,
    path: `${baseRoute}/{commentId}`,
    handler: handler.deleteCommentHandler,
    options: {
      auth: process.env.APP_AUTH_STRATEGY_NAME,
    },
  },
]);

module.exports = routes;
