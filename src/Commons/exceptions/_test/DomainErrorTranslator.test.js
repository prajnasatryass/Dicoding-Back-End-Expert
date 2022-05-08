const DomainErrorTranslator = require('../DomainErrorTranslator');
const InvariantError = require('../InvariantError');

describe('DomainErrorTranslator', () => {
  it('should translate errors correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('MISSING_REQUIRED_PROPERTIES')))
      .toStrictEqual(new InvariantError('ada properti wajib yang tidak disediakan'));
    expect(DomainErrorTranslator.translate(new Error('DATA_TYPE_MISMATCH')))
      .toStrictEqual(new InvariantError('ada properti dengan tipe data yang tidak sesuai'));

    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_TOO_LONG')))
      .toStrictEqual(new InvariantError('panjang username melebihi 50 karakter'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_NOT_ALPHANUMERIC')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'));

    expect(DomainErrorTranslator.translate(new Error('AUTHENTICATION.MISSING_REFRESH_TOKEN')))
      .toStrictEqual(new InvariantError('refresh token tidak disediakan'));

    expect(DomainErrorTranslator.translate(new Error('THREAD.MISSING_THREAD_ID')))
      .toStrictEqual(new InvariantError('thread ID tidak disediakan'));
  });

  it('should return original error if error message cannot be translated', () => {
    const error = new Error('some_error_message');

    const translatedError = DomainErrorTranslator.translate(error);

    expect(translatedError).toStrictEqual(error);
  });
});
