class Reply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { commentID, content, ownerID } = payload;

    this.commentID = commentID;
    this.content = content;
    this.ownerID = ownerID;
  }

  _verifyPayload({ commentID, content, ownerID }) {
    if (!commentID || !content || !ownerID) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentID !== 'string' || typeof content !== 'string' || typeof ownerID !== 'string') {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Reply;
