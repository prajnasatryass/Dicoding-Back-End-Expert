const NewUser = require('../../Domains/users/entities/NewUser');

class RegisterUserUseCase {
  constructor({ userRepository, passwordHasher }) {
    this._userRepository = userRepository;
    this._passwordHasher = passwordHasher;
  }

  async execute(useCasePayload) {
    const newUser = new NewUser(useCasePayload);
    await this._userRepository.verifyUsernameAvailability(newUser.username);
    newUser.password = await this._passwordHasher.hash(newUser.password);
    return this._userRepository.registerUser(newUser);
  }
}

module.exports = RegisterUserUseCase;
