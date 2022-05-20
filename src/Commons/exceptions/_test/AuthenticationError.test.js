const AuthenticationError = require('../AuthenticationError');

describe('AuthenticationError', () => {
  it('should create AuthenticationError correctly', () => {
    const authenticationError = new AuthenticationError('unauthenticated');

    expect(authenticationError.statusCode).toStrictEqual(401);
    expect(authenticationError.message).toStrictEqual('unauthenticated');
    expect(authenticationError.name).toStrictEqual('AuthenticationError');
  });
});
