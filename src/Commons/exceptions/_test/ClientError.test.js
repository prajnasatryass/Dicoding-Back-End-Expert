const ClientError = require('../ClientError');

describe('ClientError', () => {
  it('should throw error when used directly', () => {
    expect(() => new ClientError('')).toThrowError('cannot instantiate abstract class');
  });
});
