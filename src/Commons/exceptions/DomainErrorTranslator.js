/* eslint-disable quote-props */
const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'MISSING_REQUIRED_PROPERTIES': new InvariantError('ada properti wajib yang tidak disediakan'),
  'DATA_TYPE_MISMATCH': new InvariantError('ada properti dengan tipe data yang tidak sesuai'),

  'REGISTER_USER.USERNAME_TOO_LONG': new InvariantError('panjang username melebihi 50 karakter'),
  'REGISTER_USER.USERNAME_NOT_ALPHANUMERIC': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),

  'AUTHENTICATION.MISSING_REFRESH_TOKEN': new InvariantError('refresh token tidak disediakan'),

  'THREAD.MISSING_THREAD_ID': new InvariantError('thread ID tidak disediakan'),
};

module.exports = DomainErrorTranslator;
