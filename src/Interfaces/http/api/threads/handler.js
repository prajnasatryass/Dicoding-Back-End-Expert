const { StatusCodes } = require('http-status-codes');
const CreateThreadUseCase = require('../../../../Applications/use_case/CreateThreadUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.createThreadHandler = this.createThreadHandler.bind(this);
  }

  async createThreadHandler(request, h) {
    const createThreadUseCase = this._container.getInstance(CreateThreadUseCase.name);
    const addedThread = await createThreadUseCase.execute(request.payload);

    return h.response({
      status: 'success',
      data: {
        addedThread,
      },
    }).code(StatusCodes.CREATED);
  }

  async getThreadHandler(request, h) {
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const thread = await getThreadUseCase.execute(request.payload);

    return h.response({
      status: 'success',
      data: {
        thread,
      },
    }).code(StatusCodes.OK);
  }

  async addCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute(request.payload);

    return h.response({
      status: 'success',
      data: {
        addedComment,
      },
    }).code(StatusCodes.CREATED);
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute(request.payload);

    return {
      status: 'success',
    };
  }

  async addReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute(request.payload);

    return h.response({
      status: 'success',
      data: {
        addedReply,
      },
    }).code(StatusCodes.CREATED);
  }

  async deleteReplyHandler(request, h) {
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    await deleteReplyUseCase.execute(request.payload);

    return {
      status: 'success',
    };
  }
}

module.exports = ThreadsHandler;
