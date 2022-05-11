const { StatusCodes } = require('http-status-codes');
const ReplyUseCases = require('../../../../Applications/use_case/ReplyUseCases');

class RepliesHandler {
  constructor(container) {
    this._container = container;
    this.addReplyHandler = this.addReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async addReplyHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const payload = Object.assign(request.params, request.payload);
    const replyUseCases = this._container.getInstance(ReplyUseCases.name);
    const addedReply = await replyUseCases.addReply(userId, payload);

    return h.response({
      status: 'success',
      data: {
        addedReply,
      },
    }).code(StatusCodes.CREATED);
  }

  async deleteReplyHandler(request) {
    const { id: userId } = request.auth.credentials;
    const payload = Object.assign(request.params, request.payload);
    const replyUseCases = this._container.getInstance(ReplyUseCases.name);
    await replyUseCases.deleteReply(userId, payload);

    return {
      status: 'success',
    };
  }
}

module.exports = RepliesHandler;
