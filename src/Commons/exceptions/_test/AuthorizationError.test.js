const ClientError = require('../ClientError');
const AuthorizationError = require('../AuthorizationError');

describe('AuthorizationError', () => {
  it('should create AuthorizationError correctly', () => {
    const authenticationError = new AuthorizationError('unauthorized');

    expect(authenticationError).toBeInstanceOf(AuthorizationError);
    expect(authenticationError).toBeInstanceOf(ClientError);
    expect(authenticationError).toBeInstanceOf(Error);

    expect(authenticationError.name).toEqual('AuthorizationError');
    expect(authenticationError.message).toEqual('unauthorized');
    expect(authenticationError.statusCode).toEqual(403);
  });
});
