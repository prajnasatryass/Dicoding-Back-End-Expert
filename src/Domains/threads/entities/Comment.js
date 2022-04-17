class Comment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { threadID, content, ownerID } = payload;

    this.threadID = threadID;
    this.content = content;
    this.ownerID = ownerID;
  }

  _verifyPayload({ threadID, content, ownerID }) {
    if (!threadID || !content || !ownerID) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadID !== 'string' || typeof content !== 'string' || typeof ownerID !== 'string') {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
