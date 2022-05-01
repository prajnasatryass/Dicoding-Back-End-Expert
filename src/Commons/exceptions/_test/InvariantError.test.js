const ClientError = require('../ClientError');
const InvariantError = require('../InvariantError');

describe('InvariantError', () => {
  it('should create InvariantError correctly', () => {
    const invariantError = new InvariantError('an error occured');

    expect(invariantError).toBeInstanceOf(InvariantError);
    expect(invariantError).toBeInstanceOf(ClientError);
    expect(invariantError).toBeInstanceOf(Error);

    expect(invariantError.name).toEqual('InvariantError');
    expect(invariantError.message).toEqual('an error occured');
    expect(invariantError.statusCode).toEqual(400);
  });
});
