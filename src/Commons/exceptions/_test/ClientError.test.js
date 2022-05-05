const ClientError = require('../ClientError');

describe('ClientError', () => {
  it('should throw Error if used directly', () => {
    expect(() => new ClientError('')).toThrowError('cannot instantiate abstract class');
  });
});
