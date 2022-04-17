const { HttpMethods } = require('../../../../Commons/utils/constants');

const threadsBaseRoute = '/threads';
const commentsBaseRoute = `${threadsBaseRoute}/{threadID}/comments`;
const repliesBaseRoute = `${commentsBaseRoute}/{commentID}/replies`;

const routes = (handler) => ([
  {
    method: HttpMethods.POST,
    path: threadsBaseRoute,
    handler: handler.createThreadHandler,
  },
  {
    method: HttpMethods.GET,
    path: `${threadsBaseRoute}/{threadID}`,
    handler: handler.getThreadHandler,
  },
  {
    method: HttpMethods.POST,
    path: commentsBaseRoute,
    handler: handler.addCommentHandler,
  },
  {
    method: HttpMethods.DELETE,
    path: `${commentsBaseRoute}/{commentID}`,
    handler: handler.deleteCommentHandler,
  },
  {
    method: HttpMethods.POST,
    path: repliesBaseRoute,
    handler: handler.addReplyHandler,
  },
  {
    method: HttpMethods.DELETE,
    path: `${repliesBaseRoute}/{replyID}`,
    handler: handler.deleteReplyHandler,
  },
]);

module.exports = routes;
