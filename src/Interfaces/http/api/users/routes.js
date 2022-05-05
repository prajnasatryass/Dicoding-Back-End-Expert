const { HttpMethods } = require('../../../../Commons/utils/constants');

const basePath = '/users';

const routes = (handler) => ([
  {
    method: HttpMethods.POST,
    path: basePath,
    handler: handler.registerUserHandler,
  },
]);

module.exports = routes;
