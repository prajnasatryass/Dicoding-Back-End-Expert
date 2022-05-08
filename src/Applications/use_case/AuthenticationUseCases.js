const UserLogin = require('../../Domains/users/entities/UserLogin');
const NewAuth = require('../../Domains/authentications/entities/NewAuth');

class AuthenticationUseCases {
  constructor({
    authenticationRepository, userRepository, hasher, tokenManager,
  }) {
    this._authenticationRepository = authenticationRepository;
    this._userRepository = userRepository;
    this._hasher = hasher;
    this._tokenManager = tokenManager;
  }

  async login(useCasePayload) {
    const { username, password } = new UserLogin(useCasePayload);
    const hashedPassword = await this._userRepository.getPasswordByUsername(username);
    await this._hasher.match(password, hashedPassword);

    const id = await this._userRepository.getIdByUsername(username);

    const accessToken = await this._tokenManager
      .createAccessToken({ id, username });
    const refreshToken = await this._tokenManager
      .createRefreshToken({ id, username });
    await this._authenticationRepository.registerToken(refreshToken);

    return new NewAuth({
      accessToken,
      refreshToken,
    });
  }

  async refresh(useCasePayload) {
    this._verifyRefreshPayload(useCasePayload);
    const { refreshToken } = useCasePayload;
    await this._tokenManager.verifyRefreshToken(refreshToken);
    await this._authenticationRepository.verifyTokenAvailability(refreshToken);
    const { id, username } = await this._tokenManager.decodePayload(refreshToken);
    return this._tokenManager.createAccessToken({ id, username });
  }

  async logout(useCasePayload) {
    this._verifyLogoutPayload(useCasePayload);
    const { refreshToken } = useCasePayload;
    await this._authenticationRepository.verifyTokenAvailability(refreshToken);
    await this._authenticationRepository.deleteToken(refreshToken);
  }

  _verifyRefreshPayload({ refreshToken }) {
    if (!refreshToken) {
      throw new Error('AUTHENTICATION.MISSING_REFRESH_TOKEN');
    }
    if (typeof refreshToken !== 'string') {
      throw new Error('DATA_TYPE_MISMATCH');
    }
  }

  _verifyLogoutPayload({ refreshToken }) {
    if (!refreshToken) {
      throw new Error('AUTHENTICATION.MISSING_REFRESH_TOKEN');
    }
    if (typeof refreshToken !== 'string') {
      throw new Error('DATA_TYPE_MISMATCH');
    }
  }
}

module.exports = AuthenticationUseCases;
