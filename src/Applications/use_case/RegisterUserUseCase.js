const RegisterUser = require('../../Domains/users/entities/RegisterUser');

class RegisterUserUseCase {
  constructor({ userRepository, hasher }) {
    this._userRepository = userRepository;
    this._hasher = hasher;
  }

  async execute(useCasePayload) {
    const registerUser = new RegisterUser(useCasePayload);
    await this._userRepository.verifyUsernameAvailability(registerUser.username);
    registerUser.password = await this._hasher.hash(registerUser.password);
    return this._userRepository.registerUser(registerUser);
  }
}

module.exports = RegisterUserUseCase;
