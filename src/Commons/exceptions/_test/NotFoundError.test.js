const NotFoundError = require('../NotFoundError');

describe('NotFoundError', () => {
  it('should create NotFoundError correctly', () => {
    const notFoundError = new NotFoundError('resource not found');

    expect(notFoundError.statusCode).toStrictEqual(404);
    expect(notFoundError.message).toStrictEqual('resource not found');
    expect(notFoundError.name).toStrictEqual('NotFoundError');
  });
});
