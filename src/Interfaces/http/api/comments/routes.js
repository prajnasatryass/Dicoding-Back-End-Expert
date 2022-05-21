const { HttpMethods } = require('../../../../Commons/utils/constants');

const baseRoute = '/threads/{threadId}/comments';

const routes = (handler) => ([
  {
    method: HttpMethods.POST,
    path: baseRoute,
    handler: handler.addCommentHandler,
    options: {
      auth: 'auth_jwt',
    },
  },
  {
    method: HttpMethods.DELETE,
    path: `${baseRoute}/{commentId}`,
    handler: handler.deleteCommentHandler,
    options: {
      auth: 'auth_jwt',
    },
  },
  {
    method: HttpMethods.PUT,
    path: `${baseRoute}/{commentId}/likes`,
    handler: handler.toggleCommentLikeStatusHandler,
    options: {
      auth: 'auth_jwt',
    },
  },
]);

module.exports = routes;
