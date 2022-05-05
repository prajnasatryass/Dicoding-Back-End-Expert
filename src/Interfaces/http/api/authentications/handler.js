const { StatusCodes } = require('http-status-codes');
const AuthenticationUseCases = require('../../../../Applications/use_case/AuthenticationUseCases');

class AuthenticationsHandler {
  constructor(container) {
    this._container = container;
    this.loginHandler = this.loginHandler.bind(this);
    this.refreshHandler = this.refreshHandler.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);
  }

  async loginHandler(request, h) {
    const authenticationUseCases = this._container.getInstance(AuthenticationUseCases.name);
    const { accessToken, refreshToken } = await authenticationUseCases.login(request.payload);
    return h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    }).code(StatusCodes.CREATED);
  }

  async refreshHandler(request) {
    const authenticationUseCases = this._container.getInstance(AuthenticationUseCases.name);
    const accessToken = await authenticationUseCases.refresh(request.payload);
    return {
      status: 'success',
      data: {
        accessToken,
      },
    };
  }

  async logoutHandler(request) {
    const authenticationUseCases = this._container.getInstance(AuthenticationUseCases.name);
    await authenticationUseCases.logout(request.payload);
    return {
      status: 'success',
    };
  }
}

module.exports = AuthenticationsHandler;
