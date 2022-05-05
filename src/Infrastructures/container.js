/* istanbul ignore file */
const { createContainer } = require('instances-container');

// external agencies
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool');

// services (repository, helper, manager, etc)
const UserRepository = require('../Domains/users/UserRepository');
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');

const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');

const Hasher = require('../Applications/security/Hasher');
const BcryptHasher = require('./security/BcryptHasher');

const TokenManager = require('../Applications/security/TokenManager');
const JwtTokenManager = require('./security/JwtTokenManager');

// use cases
const RegisterUserUseCase = require('../Applications/use_case/RegisterUserUseCase');
const AuthenticationUseCases = require('../Applications/use_case/AuthenticationUseCases');

// container
const container = createContainer();

// registering services and repositories
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: Hasher.name,
    Class: BcryptHasher,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
  {
    key: TokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token,
        },
      ],
    },
  },
]);

// registering use cases
container.register([
  {
    key: RegisterUserUseCase.name,
    Class: RegisterUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'hasher',
          internal: Hasher.name,
        },
      ],
    },
  },
  {
    key: AuthenticationUseCases.name,
    Class: AuthenticationUseCases,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'hasher',
          internal: Hasher.name,
        },
        {
          name: 'tokenManager',
          internal: TokenManager.name,
        },
      ],
    },
  },
]);

module.exports = container;
