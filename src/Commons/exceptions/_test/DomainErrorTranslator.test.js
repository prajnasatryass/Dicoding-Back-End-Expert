const DomainErrorTranslator = require('../DomainErrorTranslator');
const InvariantError = require('../InvariantError');

// TODO: ADD MISSING ERROR MESSAGES
describe('DomainErrorTranslator', () => {
  it('should translate error correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.MISSING_REQUIRED_PROPERTIES')))
      .toStrictEqual(new InvariantError('registrasi user gagal: Ada properti wajib yang tidak disediakan'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.DATA_TYPE_MISMATCH')))
      .toStrictEqual(new InvariantError('registrasi user gagal: Ada properti dengan tipe data yang tidak sesuai'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_TOO_LONG')))
      .toStrictEqual(new InvariantError('registrasi user gagal: Panjang username melebihi 50 karakter'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_NOT_ALPHANUMERIC')))
      .toStrictEqual(new InvariantError('registrasi user gagal: Username mengandung karakter non-alfanumerik'));

    expect(DomainErrorTranslator.translate(new Error('REGISTERED_USER.MISSING_REQUIRED_PROPERTIES')))
      .toStrictEqual(new InvariantError('registrasi user gagal: Ada properti wajib yang tidak disediakan'));
    expect(DomainErrorTranslator.translate(new Error('REGISTERED_USER.DATA_TYPE_MISMATCH')))
      .toStrictEqual(new InvariantError('registrasi user gagal: Ada properti dengan tipe data yang tidak sesuai'));

    expect(DomainErrorTranslator.translate(new Error('NEW_AUTH.MISSING_REQUIRED_PROPERTIES')))
      .toStrictEqual(new InvariantError('login gagal: Ada properti wajib yang tidak disediakan'));
    expect(DomainErrorTranslator.translate(new Error('NEW_AUTH.DATA_TYPE_MISMATCH')))
      .toStrictEqual(new InvariantError('login gagal: Ada properti dengan tipe data yang tidak sesuai'));

    expect(DomainErrorTranslator.translate(new Error('USER_LOGIN.MISSING_REQUIRED_PROPERTIES')))
      .toStrictEqual(new InvariantError());
    expect(DomainErrorTranslator.translate(new Error('USER_LOGIN.DATA_TYPE_MISMATCH')))
      .toStrictEqual(new InvariantError());

    expect(DomainErrorTranslator.translate(new Error('AUTHENTICATION_USE_CASES.REFRESH.MISSING_REFRESH_TOKEN')))
      .toStrictEqual(new InvariantError());
    expect(DomainErrorTranslator.translate(new Error('AUTHENTICATION_USE_CASES.REFRESH.DATA_TYPE_MISMATCH')))
      .toStrictEqual(new InvariantError());

    expect(DomainErrorTranslator.translate(new Error('AUTHENTICATION_USE_CASES.LOGOUT.MISSING_REFRESH_TOKEN')))
      .toStrictEqual(new InvariantError());
    expect(DomainErrorTranslator.translate(new Error('AUTHENTICATION_USE_CASES.LOGOUT.DATA_TYPE_MISMATCH')))
      .toStrictEqual(new InvariantError());
  });

  it('should return original error if error message cannot be translated', () => {
    const error = new Error('some_error_message');

    const translatedError = DomainErrorTranslator.translate(error);

    expect(translatedError).toStrictEqual(error);
  });
});
