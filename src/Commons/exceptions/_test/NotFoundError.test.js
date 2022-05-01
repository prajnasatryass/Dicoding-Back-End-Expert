const NotFoundError = require('../NotFoundError');
const ClientError = require('../ClientError');

describe('NotFoundError', () => {
  it('should create NotFoundError correctly', () => {
    const notFoundError = new NotFoundError('resource not found');

    expect(notFoundError).toBeInstanceOf(NotFoundError);
    expect(notFoundError).toBeInstanceOf(ClientError);
    expect(notFoundError).toBeInstanceOf(Error);

    expect(notFoundError.name).toEqual('NotFoundError');
    expect(notFoundError.message).toEqual('resource not found');
    expect(notFoundError.statusCode).toEqual(404);
  });
});
