const {
  Authenticate,
  AskGPT,
  GetPaginatedResults,
  GetAll,
  DeleteOne,
  FindOneItem,
  DeleteAll,
  NotSupported
} = require('../functions/router')

module.exports = async app => {
  Authenticate(app)
  AskGPT(app)
  GetPaginatedResults(app)
  GetAll(app)
  DeleteOne(app)
  FindOneItem(app)
  DeleteAll(app)
  app.use(NotSupported)
}
