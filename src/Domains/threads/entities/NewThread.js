class NewThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { title, body, ownerID } = payload;

    this.title = title;
    this.body = body;
    this.ownerID = ownerID;
  }

  _verifyPayload({ title, body, ownerID }) {
    if (!title || !body || !ownerID) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string' || typeof ownerID !== 'string') {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewThread;
