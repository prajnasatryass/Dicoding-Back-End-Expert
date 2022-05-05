const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../../Domains/users/UserRepository');
const Hasher = require('../../security/Hasher');
const RegisterUserUseCase = require('../RegisterUserUseCase');

describe('RegisterUserUseCase', () => {
  it('should orchestrate register user action correctly', async () => {
    const useCasePayload = {
      username: 'John10',
      password: 'secret',
      fullname: 'John Doe',
    };
    const expected = new RegisteredUser({
      id: 'user-1',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    });

    const mockUserRepository = new UserRepository();
    const mockHasher = new Hasher();

    mockUserRepository.verifyUsernameAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockHasher.hash = jest.fn()
      .mockImplementation(() => Promise.resolve('hashed_password'));
    mockUserRepository.registerUser = jest.fn()
      .mockImplementation(() => Promise.resolve(expected));

    const registerUserUseCase = new RegisterUserUseCase({
      userRepository: mockUserRepository,
      hasher: mockHasher,
    });

    const actual = await registerUserUseCase.execute(useCasePayload);

    expect(actual).toStrictEqual(expected);
    expect(mockUserRepository.verifyUsernameAvailability).toBeCalledWith(useCasePayload.username);
    expect(mockHasher.hash).toBeCalledWith(useCasePayload.password);
    expect(mockUserRepository.registerUser).toBeCalledWith(new RegisterUser({
      username: useCasePayload.username,
      password: 'hashed_password',
      fullname: useCasePayload.fullname,
    }));
  });
});
