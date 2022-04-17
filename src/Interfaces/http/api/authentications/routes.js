const { HttpMethods } = require('../../../../Commons/utils/constants');

const baseRoute = '/authentications';

const routes = (handler) => ([
  {
    method: HttpMethods.POST,
    path: baseRoute,
    handler: handler.loginHandler,
  },
  {
    method: HttpMethods.PUT,
    path: baseRoute,
    handler: handler.refreshHandler,
  },
  {
    method: HttpMethods.DELETE,
    path: baseRoute,
    handler: handler.logoutHandler,
  },
]);

module.exports = routes;
