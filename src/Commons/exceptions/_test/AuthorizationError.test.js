const AuthorizationError = require('../AuthorizationError');

describe('AuthorizationError', () => {
  it('should create AuthorizationError correctly', () => {
    const authorizationError = new AuthorizationError('unauthorized');

    expect(authorizationError.statusCode).toStrictEqual(403);
    expect(authorizationError.message).toStrictEqual('unauthorized');
    expect(authorizationError.name).toStrictEqual('AuthorizationError');
  });
});
