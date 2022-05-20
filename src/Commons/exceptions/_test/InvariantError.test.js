const InvariantError = require('../InvariantError');

describe('InvariantError', () => {
  it('should create InvariantError correctly', () => {
    const invariantError = new InvariantError('an error occurred');

    expect(invariantError.statusCode).toStrictEqual(400);
    expect(invariantError.message).toStrictEqual('an error occurred');
    expect(invariantError.name).toStrictEqual('InvariantError');
  });
});
