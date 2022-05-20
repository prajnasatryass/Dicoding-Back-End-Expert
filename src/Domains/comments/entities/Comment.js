class Comment {
  constructor({
    id, username, date, content, deleted_at: deletedAt, like_count: likeCount, replies,
  }) {
    this.id = id;
    this.username = username;
    this.date = date;
    this.content = deletedAt ? '**komentar telah dihapus**' : content;
    this.likeCount = parseInt(likeCount, 10);
    this.replies = replies;
  }
}

module.exports = Comment;
