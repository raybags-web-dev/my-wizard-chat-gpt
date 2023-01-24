const { ObjectId } = require('mongodb')
require('dotenv').config()
const { GPT_5 } = require('../gptEngine/runners')
const asyncMiddleware = require('../middleware/asyncErros')

const { validateJWTToken, generateJWTToken } = require('../middleware/auth')
const { GPT_RESPONSE } = require('../src/models/responseModel')

function Authenticate (app) {
  app.post('/api/auth', async (req, res) => {
    try {
      const token = await generateJWTToken(req.headers.authorisation)
      return res.status(200).json({ token })
    } catch (err) {
      console.log(err.message)
    }
  })
}
function AskGPT (app) {
  app.post(
    '/raybags/v1/wizard/ask-me',
    asyncMiddleware(async (req, res) => {
      const isAuth = await validateJWTToken(req.headers.authorisation)
      if (!isAuth) return res.status(403).send('Unauthorized!')
      let question = req.body.data
      const response = await GPT_5(question)

      try {
        const newResponse = new GPT_RESPONSE({
          question: question,
          response,
          token: JSON.stringify(isAuth.iat)
        })
        await newResponse.save()
        return res.status(200).json({ status: 'Success', response })
      } catch (error) {
        if (error.name === 'ValidationError') {
          if (error.errors.question) {
            return res
              .status(400)
              .json({ status: 'Error', message: error.errors.question.message })
          }
          if (error.errors.response) {
            return res
              .status(400)
              .json({ status: 'Error', message: error.errors.response.message })
          }
          if (error.errors.token) {
            return res
              .status(400)
              .json({ status: 'Error', message: error.errors.token.message })
          }
        }
        return res
          .status(500)
          .json({ status: 'Error', message: 'An internal error occurred' })
      }
    })
  )
}
function GetPaginatedResults (app) {
  app.get(
    '/raybags/v1/wizard/data',
    asyncMiddleware(async (req, res) => {
      try {
        if (req.query.page <= '0') throw new Error(`Page can't be 0`)
        const page = req.query.page
        const limit = 10
        const skip = (page - 1) * limit
        let response = await GPT_RESPONSE.find({})
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
        const totalPages = Math.ceil(
          (await GPT_RESPONSE.countDocuments()) / limit
        )
        res
          .status(200)
          .json({ data: response, totalPages: totalPages, currentPage: page })
        return response
      } catch (error) {
        if (error.message === `Page can't be 0`) {
          return res
            .status(400)
            .json({ status: 'Error', message: error.message })
        } else if (error.name === 'CastError' && error.path === 'page') {
          return res
            .status(400)
            .json({ status: 'Error', message: 'Page should be a number' })
        } else if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .json({ status: 'Error', message: error.message })
        } else {
          console.error(error)
          return res
            .status(500)
            .json({ status: 'Error', message: 'An internal error occurred' })
        }
      }
    })
  )
}
function GetAll (app) {
  app.get(
    '/raybags/v1/wizard/data-all',
    asyncMiddleware(async (req, res) => {
      let response = await GPT_RESPONSE.find({}).sort({ createdAt: 1 })
      if (response.length === 0)
        return res.status(404).json('Sorry I have nothing for you!')

      let page = parseInt(req.query.page) || 1
      let perPage = parseInt(req.query.perPage) || 10
      let totalPages = Math.ceil(response.length / perPage)

      let paginatedResponse = response.slice(
        (page - 1) * perPage,
        page * perPage
      )

      res.status(200).json({
        totalPages: totalPages,
        currentPage: page,
        data: paginatedResponse
      })
      return response
    })
  )
}
function FindOneItem (app) {
  app.get(
    '/raybags/v1/wizard/item/:id',
    asyncMiddleware(async (req, res) => {
      const itemId = req.params.id
      let item = await GPT_RESPONSE.findOne({ _id: new ObjectId(itemId) })
      if (!item) return res.status(404).json('Item could not be found')
      res.status(200).json({ message: 'Success', item })
    })
  )
}
function DeleteOne (app) {
  app.delete(
    '/raybags/v1/wizard/delete-item/:id',
    asyncMiddleware(async (req, res) => {
      const itemId = req.params.id
      let item = await GPT_RESPONSE.findOne({ _id: new ObjectId(itemId) })
      if (!item) return res.status(404).json('Item could not be found')
      await item.delete()
      res.status(200).json({ message: 'Item deleletd', item })
    })
  )
}
function DeleteAll (app) {
  app.delete(
    '/raybags/v1/wizard/delete-all',
    asyncMiddleware(async (req, res) => {
      const isAuth = await validateJWTToken(req.headers.authorization)
      if (!isAuth) return res.status(401).send('Unauthorized')
      await GPT_RESPONSE.deleteMany({})
      res.status(200).json({ message: 'All items deleted' })
    })
  )
}
function NotSupported (req, res, next) {
  res.status(404).json("Sorry, that route doesn't exist.")
}
module.exports = {
  Authenticate,
  AskGPT,
  GetPaginatedResults,
  GetAll,
  DeleteOne,
  FindOneItem,
  DeleteAll,
  NotSupported
}
