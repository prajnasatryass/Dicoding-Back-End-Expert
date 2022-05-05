const TokenManager = require('../TokenManager');

describe('TokenManager', () => {
  it('should throw Error if methods are invoked', async () => {
    const tokenManager = new TokenManager();

    // Action & Assert
    await expect(tokenManager.createAccessToken('')).rejects.toThrowError('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    await expect(tokenManager.createRefreshToken('')).rejects.toThrowError('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    await expect(tokenManager.verifyRefreshToken('')).rejects.toThrowError('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    await expect(tokenManager.decodePayload('')).rejects.toThrowError('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  });
});
