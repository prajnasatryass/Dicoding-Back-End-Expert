const AuthenticationError = require('../AuthenticationError');

describe('AuthenticationError', () => {
  it('should create AuthenticationError correctly', () => {
    const authenticationError = new AuthenticationError('unauthenticated');

    expect(authenticationError.statusCode).toEqual(401);
    expect(authenticationError.message).toEqual('unauthenticated');
    expect(authenticationError.name).toEqual('AuthenticationError');
  });
});
