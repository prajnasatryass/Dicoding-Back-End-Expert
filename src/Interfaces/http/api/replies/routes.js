const { HttpMethods } = require('../../../../Commons/utils/constants');

const baseRoute = '/threads/{threadId}/comments/{commentId}/replies';

const routes = (handler) => ([
  {
    method: HttpMethods.POST,
    path: baseRoute,
    handler: handler.addReplyHandler,
    options: {
      auth: 'auth_jwt',
    },
  },
  {
    method: HttpMethods.DELETE,
    path: `${baseRoute}/{replyId}`,
    handler: handler.deleteReplyHandler,
    options: {
      auth: 'auth_jwt',
    },
  },
]);

module.exports = routes;
