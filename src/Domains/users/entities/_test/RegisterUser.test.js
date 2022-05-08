const RegisterUser = require('../RegisterUser');

describe('RegisterUser', () => {
  it('should throw Error if payload is missing one or more required properties', () => {
    const payload = {
      username: 'dummy',
      password: 'secret',
    };

    expect(() => new RegisterUser(payload)).toThrowError('MISSING_REQUIRED_PROPERTIES');
  });

  it('should throw Error if one or more payload properties does not match specified data type', () => {
    const payload = {
      username: 123,
      password: 'secret',
      fullname: ['John Doe'],
    };

    expect(() => new RegisterUser(payload)).toThrowError('DATA_TYPE_MISMATCH');
  });

  it('should throw Error if username length exceeds 50 characters', () => {
    const payload = {
      username: 'loremipsumloremipsumloremipsumloremipsumloremipsumloremipsum',
      password: 'secret',
      fullname: 'John Doe',
    };

    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.USERNAME_TOO_LONG');
  });

  it('should throw Error if username is not alphanumeric', () => {
    const payload = {
      username: 'John10!@#',
      password: 'secret',
      fullname: 'John Doe',
    };

    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.USERNAME_NOT_ALPHANUMERIC');
  });

  it('should create RegisterUser correctly', () => {
    const payload = {
      username: 'John10',
      password: 'secret',
      fullname: 'John Doe',
    };

    const registerUser = new RegisterUser(payload);

    expect(registerUser).toBeInstanceOf(RegisterUser);
    expect(registerUser.username).toEqual(payload.username);
    expect(registerUser.password).toEqual(payload.password);
    expect(registerUser.fullname).toEqual(payload.fullname);
  });
});
