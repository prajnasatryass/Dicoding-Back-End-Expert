const { HttpMethods } = require('../../../../Commons/utils/constants');

const baseRoute = '/threads/{threadId}/comments/{commentId}/replies';

const routes = (handler) => ([
  {
    method: HttpMethods.POST,
    path: baseRoute,
    handler: handler.addReplyHandler,
    options: {
      auth: process.env.APP_AUTH_STRATEGY_NAME,
    },
  },
  {
    method: HttpMethods.DELETE,
    path: `${baseRoute}/{replyId}`,
    handler: handler.deleteReplyHandler,
    options: {
      auth: process.env.APP_AUTH_STRATEGY_NAME,
    },
  },
]);

module.exports = routes;
