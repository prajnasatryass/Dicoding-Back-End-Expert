const { StatusCodes } = require('http-status-codes');
const ThreadUseCases = require('../../../../Applications/use_case/ThreadUseCases');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.createThreadHandler = this.createThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
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
}

module.exports = ThreadsHandler;
