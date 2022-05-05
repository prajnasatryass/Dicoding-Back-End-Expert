const bcrypt = require('bcrypt');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');
const BcryptHasher = require('../BcryptHasher');

describe('BcryptHasher', () => {
  describe('hash', () => {
    it('should hash password correctly', async () => {
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const bcryptHasher = new BcryptHasher(bcrypt);

      const hashedPassword = await bcryptHasher.hash('plain_password');

      expect(typeof hashedPassword).toEqual('string');
      expect(hashedPassword).not.toEqual('plain_password');
      expect(spyHash).toBeCalledWith('plain_password', 10);
    });
  });

  describe('match', () => {
    it('should throw AuthenticationError if plain and hashed does not match', async () => {
      const bcryptHasher = new BcryptHasher(bcrypt);

      await expect(bcryptHasher.match('plain_password', 'hashed_password'))
        .rejects.toThrow(AuthenticationError);
    });

    it('should not return AuthenticationError if plain and hashed matches', async () => {
      const bcryptHasher = new BcryptHasher(bcrypt);
      const plainPassword = 'secret';
      const hashedPassword = await bcryptHasher.hash(plainPassword);

      await expect(bcryptHasher.match(plainPassword, hashedPassword))
        .resolves.not.toThrow(AuthenticationError);
    });
  });
});
