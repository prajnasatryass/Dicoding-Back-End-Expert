const NewAuth = require('../NewAuth');

describe('NewAuth', () => {
  it('should throw Error if payload is missing one or more required properties', () => {
    const payload = {
      accessToken: 'access_token',
    };

    expect(() => new NewAuth(payload)).toThrowError('MISSING_REQUIRED_PROPERTIES');
  });

  it('should throw Error if one or more payload properties does not match specified data type', () => {
    const payload = {
      accessToken: 123,
      refreshToken: {},
    };

    expect(() => new NewAuth(payload)).toThrowError('DATA_TYPE_MISMATCH');
  });

  it('should create NewAuth correctly', () => {
    const payload = {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    };

    const { accessToken, refreshToken } = new NewAuth(payload);

    expect(accessToken).toEqual(payload.accessToken);
    expect(refreshToken).toEqual(payload.refreshToken);
  });
});
