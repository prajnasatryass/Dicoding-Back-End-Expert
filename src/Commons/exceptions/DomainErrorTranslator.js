const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

// TODO: ADD MISSING ERROR MESSAGES
DomainErrorTranslator._directories = {
  'REGISTER_USER.MISSING_REQUIRED_PROPERTIES': new InvariantError('registrasi user gagal: Ada properti wajib yang tidak disediakan'),
  'REGISTER_USER.DATA_TYPE_MISMATCH': new InvariantError('registrasi user gagal: Ada properti dengan tipe data yang tidak sesuai'),
  'REGISTER_USER.USERNAME_TOO_LONG': new InvariantError('registrasi user gagal: Panjang username melebihi 50 karakter'),
  'REGISTER_USER.USERNAME_NOT_ALPHANUMERIC': new InvariantError('registrasi user gagal: Username mengandung karakter non-alfanumerik'),

  'REGISTERED_USER.MISSING_REQUIRED_PROPERTIES': new InvariantError('registrasi user gagal: Ada properti wajib yang tidak disediakan'),
  'REGISTERED_USER.DATA_TYPE_MISMATCH': new InvariantError('registrasi user gagal: Ada properti dengan tipe data yang tidak sesuai'),

  'NEW_AUTH.MISSING_REQUIRED_PROPERTIES': new InvariantError('login gagal: Ada properti wajib yang tidak disediakan'),
  'NEW_AUTH.DATA_TYPE_MISMATCH': new InvariantError('login gagal: Ada properti dengan tipe data yang tidak sesuai'),

  'USER_LOGIN.MISSING_REQUIRED_PROPERTIES': new InvariantError(),
  'USER_LOGIN.DATA_TYPE_MISMATCH': new InvariantError(),

  'AUTHENTICATION_USE_CASES.REFRESH.MISSING_REFRESH_TOKEN': new InvariantError(),
  'AUTHENTICATION_USE_CASES.REFRESH.DATA_TYPE_MISMATCH': new InvariantError(),

  'AUTHENTICATION_USE_CASES.LOGOUT.MISSING_REFRESH_TOKEN': new InvariantError(),
  'AUTHENTICATION_USE_CASES.LOGOUT.DATA_TYPE_MISMATCH': new InvariantError(),
};

module.exports = DomainErrorTranslator;
