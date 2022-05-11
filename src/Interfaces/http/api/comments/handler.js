const { StatusCodes } = require('http-status-codes');
const CommentUseCases = require('../../../../Applications/use_case/CommentUseCases');

class CommentsHandler {
  constructor(container) {
    this._container = container;
    this.addCommentHandler = this.addCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
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
}

module.exports = CommentsHandler;
