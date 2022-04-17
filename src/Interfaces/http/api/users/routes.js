const { HttpMethods } = require('../../../../Commons/utils/constants');

const baseRoute = '/users';

const routes = (handler) => ([
  {
    method: HttpMethods.POST,
    path: baseRoute,
    handler: handler.registerUserHandler,
  },
]);

module.exports = routes;
