const Comment = require('../Comment');

describe('Comment', () => {
  it('should create Comment correctly', () => {
    const payload = {
      id: 'comment-1',
      username: 'John10',
      date: '2022-01-01T00:00:00.000Z',
      content: 'Content',
      deleted_at: null,
      like_count: '1',
      replies: [{
        id: 'reply-1',
      }],
    };

    const comment = new Comment(payload);

    expect(comment).toBeInstanceOf(Comment);
    expect(comment.id).toStrictEqual(payload.id);
    expect(comment.username).toStrictEqual(payload.username);
    expect(comment.date).toStrictEqual(payload.date);
    expect(comment.content).toStrictEqual(payload.content);
    expect(comment.likeCount).toStrictEqual(1);
    expect(comment.replies).toStrictEqual(payload.replies);
  });

  it('should create deleted Comment correctly', () => {
    const payload = {
      id: 'comment-1',
      username: 'John10',
      date: '2022-01-01T00:00:00.000Z',
      content: 'Content',
      deleted_at: '2022-01-01T00:00:00.000Z',
      like_count: '1',
      replies: [{
        id: 'reply-1',
      }],
    };

    const comment = new Comment(payload);

    expect(comment).toBeInstanceOf(Comment);
    expect(comment.id).toStrictEqual(payload.id);
    expect(comment.username).toStrictEqual(payload.username);
    expect(comment.date).toStrictEqual(payload.date);
    expect(comment.content).toStrictEqual('**komentar telah dihapus**');
    expect(comment.likeCount).toStrictEqual(1);
    expect(comment.replies).toStrictEqual(payload.replies);
  });
});
