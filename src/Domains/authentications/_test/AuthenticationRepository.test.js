const AuthenticationRepository = require('../AuthenticationRepository');

describe('AuthenticationRepository', () => {
  it('should throw Error if methods are invoked', async () => {
    const authenticationRepository = new AuthenticationRepository();

    await expect(authenticationRepository.registerToken('')).rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
    await expect(authenticationRepository.verifyTokenAvailability('')).rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
    await expect(authenticationRepository.deleteToken('')).rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
  });
});
