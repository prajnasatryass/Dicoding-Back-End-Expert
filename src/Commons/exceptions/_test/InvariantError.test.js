const InvariantError = require('../InvariantError');

describe('InvariantError', () => {
  it('should create InvariantError correctly', () => {
    const invariantError = new InvariantError('an error occurred');

    expect(invariantError.statusCode).toEqual(400);
    expect(invariantError.message).toEqual('an error occurred');
    expect(invariantError.name).toEqual('InvariantError');
  });
});
