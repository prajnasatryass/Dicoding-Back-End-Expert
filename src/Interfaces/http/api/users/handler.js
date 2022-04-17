const { StatusCodes } = require('http-status-codes');
const RegisterUserUseCase = require('../../../../Applications/use_case/RegisterUserUseCase');

class UsersHandler {
  constructor(container) {
    this._container = container;

    this.registerUserHandler = this.registerUserHandler.bind(this);
  }

  async registerUserHandler(request, h) {
    const registerUserUseCase = this._container.getInstance(RegisterUserUseCase.name);
    const addedUser = await registerUserUseCase.execute(request.payload);

    return h.response({
      status: 'success',
      data: {
        addedUser,
      },
    }).code(StatusCodes.CREATED);
  }
}

module.exports = UsersHandler;
