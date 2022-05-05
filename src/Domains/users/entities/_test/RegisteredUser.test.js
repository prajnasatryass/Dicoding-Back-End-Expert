const RegisteredUser = require('../RegisteredUser');

describe('RegisteredUser', () => {
  it('should throw Error if payload is missing one or more required properties', () => {
    const payload = {
      id: 'user-1',
      username: 'John10',
    };

    expect(() => new RegisteredUser(payload)).toThrowError('REGISTERED_USER.MISSING_REQUIRED_PROPERTIES');
  });

  it('should throw Error if one or more payload properties does not match specified data type', () => {
    const payload = {
      id: 123,
      username: 'John10',
      fullname: {},
    };

    expect(() => new RegisteredUser(payload)).toThrowError('REGISTERED_USER.DATA_TYPE_MISMATCH');
  });

  it('should create RegisteredUser correctly', () => {
    const payload = {
      id: 'user-1',
      username: 'John10',
      fullname: 'John Doe',
    };

    const registeredUser = new RegisteredUser(payload);

    expect(registeredUser).toBeInstanceOf(RegisteredUser);
    expect(registeredUser.id).toEqual(payload.id);
    expect(registeredUser.username).toEqual(payload.username);
    expect(registeredUser.fullname).toEqual(payload.fullname);
  });
});
