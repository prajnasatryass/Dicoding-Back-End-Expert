const UserLogin = require('../UserLogin');

describe('UserLogin', () => {
  it('should throw Error if payload is missing one or more required properties', () => {
    const payload = {
      username: 'John10',
    };

    expect(() => new UserLogin(payload)).toThrowError('MISSING_REQUIRED_PROPERTIES');
  });

  it('should throw Error if one or more payload properties does not match specified data type', () => {
    const payload = {
      username: 123,
      password: {},
    };

    expect(() => new UserLogin(payload)).toThrowError('DATA_TYPE_MISMATCH');
  });

  it('should create UserLogin correctly', () => {
    const payload = {
      username: 'John10',
      password: 'secret',
    };

    const userLogin = new UserLogin(payload);

    expect(userLogin).toBeInstanceOf(UserLogin);
    expect(userLogin.username).toEqual(payload.username);
    expect(userLogin.password).toEqual(payload.password);
  });
});
