const NewAuth = require('../NewAuth');

describe('NewAuth', () => {
  it('should throw Error if payload is missing one or more required properties', () => {
    const payload = {
    };

    expect(() => new NewAuth(payload)).toThrowError('MISSING_REQUIRED_PROPERTIES');
  });

  it('should throw Error if one or more payload properties does not match specified data type', () => {
    const payload = {
      id: 123,
      username: 'John10',
      accessToken: [],
      refreshToken: {},
    };

    expect(() => new NewAuth(payload)).toThrowError('DATA_TYPE_MISMATCH');
  });

  it('should create NewAuth correctly', () => {
    const payload = {
      id: 'user-1',
      username: 'John10',
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    };

    const { user, accessToken, refreshToken } = new NewAuth(payload);

    expect(user).toStrictEqual({ id: 'user-1', username: 'John10' });
    expect(accessToken).toStrictEqual(payload.accessToken);
    expect(refreshToken).toStrictEqual(payload.refreshToken);
  });
});
