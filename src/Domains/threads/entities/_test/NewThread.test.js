const NewThread = require('../NewThread');

describe('NewThread', () => {
  it('should throw Error if payload is missing one or more required properties', () => {
    const payload = {
      title: 'Title',
    };

    expect(() => new NewThread(payload)).toThrowError('MISSING_REQUIRED_PROPERTIES');
  });

  it('should throw Error if one or more payload properties does not match specified data type', () => {
    const payload = {
      title: 123,
      body: {},
    };

    expect(() => new NewThread(payload)).toThrowError('DATA_TYPE_MISMATCH');
  });

  it('should create NewThread correctly', () => {
    const payload = {
      title: 'Title',
      body: 'Body',
    };

    const newThread = new NewThread(payload);

    expect(newThread).toBeInstanceOf(NewThread);
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
  });
});
