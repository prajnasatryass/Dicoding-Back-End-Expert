const { StatusCodes } = require('http-status-codes');
const ThreadUseCases = require('../../../../Applications/use_case/ThreadUseCases');
const CommentUseCases = require('../../../../Applications/use_case/CommentUseCases');
const ReplyUseCases = require('../../../../Applications/use_case/ReplyUseCases');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.createThreadHandler = this.createThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
    this.addCommentHandler = this.addCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.addReplyHandler = this.addReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async createThreadHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const threadUseCases = this._container.getInstance(ThreadUseCases.name);
    const addedThread = await threadUseCases.createThread(userId, request.payload);

    return h.response({
      status: 'success',
      data: {
        addedThread,
      },
    }).code(StatusCodes.CREATED);
  }

  async getThreadHandler(request, h) {
    const payload = Object.assign(request.params, request.payload);
    const threadUseCases = this._container.getInstance(ThreadUseCases.name);
    const thread = await threadUseCases.getThread(payload);

    return h.response({
      status: 'success',
      data: {
        thread,
      },
    });
  }

  async addCommentHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const payload = Object.assign(request.params, request.payload);
    const commentUseCases = this._container.getInstance(CommentUseCases.name);
    const addedComment = await commentUseCases.addComment(userId, payload);

    return h.response({
      status: 'success',
      data: {
        addedComment,
      },
    }).code(StatusCodes.CREATED);
  }

  async deleteCommentHandler(request) {
    const { id: userId } = request.auth.credentials;
    const payload = Object.assign(request.params, request.payload);
    const commentUseCases = this._container.getInstance(CommentUseCases.name);
    await commentUseCases.deleteComment(userId, payload);

    return {
      status: 'success',
    };
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

module.exports = ThreadsHandler;
