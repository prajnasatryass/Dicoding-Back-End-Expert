const RegisterUser = require('../../Domains/users/entities/RegisterUser');

class RegisterUserUseCase {
  constructor({ userRepository, passwordHasher }) {
    this._userRepository = userRepository;
    this._passwordHasher = passwordHasher;
  }

  async execute(useCasePayload) {
    const registerUser = new RegisterUser(useCasePayload);
    await this._userRepository.verifyUsernameAvailability(registerUser.username);
    registerUser.password = await this._passwordHasher.hash(registerUser.password);
    return this._userRepository.registerUser(registerUser);
  }
}

module.exports = RegisterUserUseCase;
