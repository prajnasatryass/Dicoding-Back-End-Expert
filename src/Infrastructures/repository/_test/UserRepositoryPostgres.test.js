const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('UserRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyUsernameAvailability', () => {
    it('should throw InvariantError if username is empty', async () => {
      await UsersTableTestHelper.addUser({ username: 'test' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      await expect(userRepositoryPostgres.verifyUsernameAvailability('test')).rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError if username is not empty', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      await expect(userRepositoryPostgres.verifyUsernameAvailability('test')).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('registerUser', () => {
    it('should persist registered user entry', async () => {
      const registerUser = new RegisterUser({
        username: 'John10',
        password: 'hashed_password',
        fullname: 'John Doe',
      });
      const fakeIdGenerator = () => '1';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      await userRepositoryPostgres.registerUser(registerUser);

      const users = await UsersTableTestHelper.getUserById('user-1');
      expect(users).toHaveLength(1);
    });

    it('should return registered user', async () => {
      const registerUser = new RegisterUser({
        username: 'John10',
        password: 'hashed_password',
        fullname: 'John Doe',
      });
      const fakeIdGenerator = () => '1';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      const registeredUser = await userRepositoryPostgres.registerUser(registerUser);

      expect(registeredUser).toStrictEqual(new RegisteredUser({
        id: 'user-1',
        username: 'John10',
        fullname: 'John Doe',
      }));
    });
  });

  describe('getPasswordByUsername', () => {
    it('should throw InvariantError if user is not found', () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      return expect(userRepositoryPostgres.getPasswordByUsername('John10'))
        .rejects
        .toThrowError(InvariantError);
    });

    it('should return user\'s password if user is found', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        username: 'John10',
        password: 'hashed_password',
      });

      const password = await userRepositoryPostgres.getPasswordByUsername('John10');

      expect(password).toBe('hashed_password');
    });
  });

  // TODO: REVISE
  describe('getIdByUsername', () => {
    it('should throw InvariantError if user is not found', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      await expect(userRepositoryPostgres.getIdByUsername('John10'))
        .rejects
        .toThrowError(InvariantError);
    });

    it('should return user\'s id if user is found', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'John10' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      const userId = await userRepositoryPostgres.getIdByUsername('John10');

      expect(userId).toEqual('user-1');
    });
  });
});
