const { HttpMethods } = require('../../../../Commons/utils/constants');

const baseRoute = '/threads';
const commentsBaseRoute = `${baseRoute}/{threadId}/comments`;
const repliesBaseRoute = `${commentsBaseRoute}/{commentId}/replies`;

const routes = (handler) => ([
  {
    method: HttpMethods.POST,
    path: baseRoute,
    handler: handler.createThreadHandler,
    options: {
      auth: process.env.APP_AUTH_STRATEGY_NAME,
    },
  },
  {
    method: HttpMethods.GET,
    path: `${baseRoute}/{threadId}`,
    handler: handler.getThreadHandler,
  },
  {
    method: HttpMethods.POST,
    path: commentsBaseRoute,
    handler: handler.addCommentHandler,
    options: {
      auth: process.env.APP_AUTH_STRATEGY_NAME,
    },
  },
  {
    method: HttpMethods.DELETE,
    path: `${commentsBaseRoute}/{commentId}`,
    handler: handler.deleteCommentHandler,
    options: {
      auth: process.env.APP_AUTH_STRATEGY_NAME,
    },
  },
  {
    method: HttpMethods.POST,
    path: repliesBaseRoute,
    handler: handler.addReplyHandler,
    options: {
      auth: process.env.APP_AUTH_STRATEGY_NAME,
    },
  },
  {
    method: HttpMethods.DELETE,
    path: `${repliesBaseRoute}/{replyId}`,
    handler: handler.deleteReplyHandler,
    options: {
      auth: process.env.APP_AUTH_STRATEGY_NAME,
    },
  },
]);

module.exports = routes;
