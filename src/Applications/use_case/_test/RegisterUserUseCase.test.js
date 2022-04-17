const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../../Domains/users/UserRepository');
const PasswordHasher = require('../../security/PasswordHasher');
const RegisterUserUseCase = require('../RegisterUserUseCase');

describe('RegisterUserUseCase', () => {
  it('should correctly orchestrate register user action', async () => {
    // Arrange
    const useCasePayload = {
      username: 'test',
      password: 'secret',
      fullname: 'Test User',
    };
    const expectedRegisteredUser = new RegisteredUser({
      id: 'user-1',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    });

    /** creating dependencies of use case */
    const mockUserRepository = new UserRepository();
    const mockPasswordHasher = new PasswordHasher();

    /** mocking needed functions */
    mockUserRepository.verifyAvailableUsername = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockPasswordHasher.hash = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockUserRepository.registerUser = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedRegisteredUser));

    /** creating use case instances */
    const getUserUseCase = new RegisterUserUseCase({
      userRepository: mockUserRepository,
      passwordHasher: mockPasswordHasher,
    });

    // Action
    const registeredUser = await getUserUseCase.execute(useCasePayload);

    // Assert
    expect(registeredUser).toStrictEqual(expectedRegisteredUser);
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(useCasePayload.username);
    expect(mockPasswordHasher.hash).toBeCalledWith(useCasePayload.password);
    expect(mockUserRepository.registerUser).toBeCalledWith(new RegisterUser({
      username: useCasePayload.username,
      password: 'encrypted_password',
      fullname: useCasePayload.fullname,
    }));
  });
});
