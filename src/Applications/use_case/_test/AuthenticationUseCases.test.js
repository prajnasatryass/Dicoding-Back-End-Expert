const NewAuth = require('../../../Domains/authentications/entities/NewAuth');
const Hasher = require('../../security/Hasher');
const TokenManager = require('../../security/TokenManager');
const UserRepository = require('../../../Domains/users/UserRepository');
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const AuthenticationUseCases = require('../AuthenticationUseCases');

describe('AuthenticationUseCases', () => {
  describe('login', () => {
    it('should orchestrate login action correctly', async () => {
      const useCasePayload = {
        username: 'John10',
        password: 'secret',
      };
      const expected = new NewAuth({
        id: 'user-1',
        username: 'John10',
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      });
      const mockAuthenticationRepository = new AuthenticationRepository();
      const mockUserRepository = new UserRepository();
      const mockHasher = new Hasher();
      const mockTokenManager = new TokenManager();

      mockUserRepository.getPasswordByUsername = jest.fn(() => Promise.resolve('hashed_password'));
      mockHasher.match = jest.fn(() => Promise.resolve());
      mockTokenManager.createAccessToken = jest.fn(() => Promise.resolve('access_token'));
      mockTokenManager.createRefreshToken = jest.fn(() => Promise.resolve('refresh_token'));
      mockUserRepository.getIdByUsername = jest.fn(() => Promise.resolve('user-1'));
      mockAuthenticationRepository.registerToken = jest.fn(() => Promise.resolve());

      const authenticationUseCases = new AuthenticationUseCases({
        authenticationRepository: mockAuthenticationRepository,
        userRepository: mockUserRepository,
        hasher: mockHasher,
        tokenManager: mockTokenManager,
      });

      const actual = await authenticationUseCases.login(useCasePayload);

      expect(actual).toStrictEqual(expected);
      expect(mockUserRepository.getPasswordByUsername)
        .toBeCalledWith('John10');
      expect(mockHasher.match)
        .toBeCalledWith('secret', 'hashed_password');
      expect(mockUserRepository.getIdByUsername)
        .toBeCalledWith('John10');
      expect(mockTokenManager.createAccessToken)
        .toBeCalledWith({ username: 'John10', id: 'user-1' });
      expect(mockTokenManager.createRefreshToken)
        .toBeCalledWith({ username: 'John10', id: 'user-1' });
      expect(mockAuthenticationRepository.registerToken)
        .toBeCalledWith(expected.refreshToken);
    });
  });

  describe('refresh', () => {
    it('should throw Error if payload does not contain refresh token', async () => {
      const useCasePayload = {};
      const authenticationUseCases = new AuthenticationUseCases({});

      await expect(authenticationUseCases.refresh(useCasePayload))
        .rejects
        .toThrowError('AUTHENTICATION.MISSING_REFRESH_TOKEN');
    });

    it('should throw Error if refresh token data type is not string', async () => {
      const useCasePayload = {
        refreshToken: 1,
      };
      const authenticationUseCases = new AuthenticationUseCases({});

      await expect(authenticationUseCases.refresh(useCasePayload))
        .rejects
        .toThrowError('DATA_TYPE_MISMATCH');
    });

    it('should orchestrate refresh action correctly', async () => {
      const useCasePayload = {
        refreshToken: 'refresh_token',
      };
      const expected = 'access_token';
      const mockAuthenticationRepository = new AuthenticationRepository();
      const mockTokenManager = new TokenManager();

      mockAuthenticationRepository.verifyTokenAvailability = jest.fn(() => Promise.resolve());
      mockTokenManager.verifyRefreshToken = jest.fn(() => Promise.resolve());
      mockTokenManager.decodePayload = jest.fn(() => Promise.resolve({ username: 'John10', id: 'user-1' }));
      mockTokenManager.createAccessToken = jest.fn(() => Promise.resolve('access_token'));

      const authenticationUseCases = new AuthenticationUseCases({
        authenticationRepository: mockAuthenticationRepository,
        tokenManager: mockTokenManager,
      });

      const actual = await authenticationUseCases.refresh(useCasePayload);

      expect(actual).toStrictEqual(expected);
      expect(mockTokenManager.verifyRefreshToken)
        .toBeCalledWith(useCasePayload.refreshToken);
      expect(mockAuthenticationRepository.verifyTokenAvailability)
        .toBeCalledWith(useCasePayload.refreshToken);
      expect(mockTokenManager.decodePayload)
        .toBeCalledWith(useCasePayload.refreshToken);
      expect(mockTokenManager.createAccessToken)
        .toBeCalledWith({ username: 'John10', id: 'user-1' });
    });
  });

  describe('logout', () => {
    it('should throw Error if payload does not contain refresh token', async () => {
      const useCasePayload = {};
      const authenticationUseCases = new AuthenticationUseCases({});

      await expect(authenticationUseCases.logout(useCasePayload))
        .rejects
        .toThrowError('AUTHENTICATION.MISSING_REFRESH_TOKEN');
    });

    it('should throw Error if refresh token data type is not string', async () => {
      const useCasePayload = {
        refreshToken: 123,
      };
      const authenticationUseCases = new AuthenticationUseCases({});

      await expect(authenticationUseCases.logout(useCasePayload))
        .rejects
        .toThrowError('DATA_TYPE_MISMATCH');
    });

    it('should orchestrate logout action correctly', async () => {
      const useCasePayload = {
        refreshToken: 'refresh_ token',
      };
      const mockAuthenticationRepository = new AuthenticationRepository();

      mockAuthenticationRepository.verifyTokenAvailability = jest.fn(() => Promise.resolve());
      mockAuthenticationRepository.deleteToken = jest.fn(() => Promise.resolve());

      const authenticationUseCases = new AuthenticationUseCases({
        authenticationRepository: mockAuthenticationRepository,
      });

      await authenticationUseCases.logout(useCasePayload);

      expect(mockAuthenticationRepository.verifyTokenAvailability)
        .toHaveBeenCalledWith(useCasePayload.refreshToken);
      expect(mockAuthenticationRepository.deleteToken)
        .toHaveBeenCalledWith(useCasePayload.refreshToken);
    });
  });
});
