const Reply = require('../Reply');

describe('Reply', () => {
  it('should create Reply correctly', () => {
    const payload = {
      id: 'reply-1',
      username: 'John10',
      date: '2022-01-01T00:00:00.000Z',
      content: 'Content',
      deleted_at: null,
    };

    const reply = new Reply(payload);

    expect(reply).toBeInstanceOf(Reply);
    expect(reply.id).toEqual(payload.id);
    expect(reply.username).toEqual(payload.username);
    expect(reply.date).toEqual(payload.date);
    expect(reply.content).toEqual(payload.content);
  });

  it('should create deleted Reply correctly', () => {
    const payload = {
      id: 'reply-1',
      username: 'John10',
      date: '2022-01-01T00:00:00.000Z',
      content: 'Content',
      deleted_at: '2022-01-01T00:00:00.000Z',
    };

    const reply = new Reply(payload);

    expect(reply).toBeInstanceOf(Reply);
    expect(reply.id).toEqual(payload.id);
    expect(reply.username).toEqual(payload.username);
    expect(reply.date).toEqual(payload.date);
    expect(reply.content).toEqual('**balasan telah dihapus**');
  });
});
