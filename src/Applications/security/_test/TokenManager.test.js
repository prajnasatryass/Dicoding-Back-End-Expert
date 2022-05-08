const TokenManager = require('../TokenManager');

describe('TokenManager', () => {
  it('should throw Error if methods are invoked', async () => {
    const tokenManager = new TokenManager();

    await expect(tokenManager.createAccessToken('')).rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
    await expect(tokenManager.createRefreshToken('')).rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
    await expect(tokenManager.verifyRefreshToken('')).rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
    await expect(tokenManager.decodePayload('')).rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
  });
});
