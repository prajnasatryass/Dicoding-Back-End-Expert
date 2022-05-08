const UserRepository = require('../UserRepository');

describe('UserRepository', () => {
  it('should throw Error if methods are invoked', async () => {
    const userRepository = new UserRepository();

    await expect(userRepository.registerUser({})).rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
    await expect(userRepository.verifyUsernameAvailability('')).rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
    await expect(userRepository.getPasswordByUsername('')).rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
    await expect(userRepository.getIdByUsername('')).rejects.toThrowError('METHOD_NOT_IMPLEMENTED');
  });
});
