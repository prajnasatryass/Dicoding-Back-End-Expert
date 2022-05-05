const AuthorizationError = require('../AuthorizationError');

describe('AuthorizationError', () => {
  it('should create AuthorizationError correctly', () => {
    const authorizationError = new AuthorizationError('unauthorized');

    expect(authorizationError.statusCode).toEqual(403);
    expect(authorizationError.message).toEqual('unauthorized');
    expect(authorizationError.name).toEqual('AuthorizationError');
  });
});
