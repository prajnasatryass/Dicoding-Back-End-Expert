const Hasher = require('../Hasher');

describe('Hasher', () => {
  it('should throw Error if methods are invoked', async () => {
    const hasher = new Hasher();

    await expect(hasher.hash('')).rejects.toThrowError('HASHER.METHOD_NOT_IMPLEMENTED');
    await expect(hasher.match('', '')).rejects.toThrowError('HASHER.METHOD_NOT_IMPLEMENTED');
  });
});
