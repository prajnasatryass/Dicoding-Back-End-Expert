const PasswordHasher = require('../PasswordHasher');

describe('PasswordHasher interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const passwordHasher = new PasswordHasher();

    // Action & Assert
    await expect(passwordHasher.hash('password')).rejects.toThrowError('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
    await expect(passwordHasher.matchPassword('plain', 'encrypted')).rejects.toThrowError('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  });
});
