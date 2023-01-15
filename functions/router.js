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
    '/raybags/ask-me',
    asyncMiddleware(async (req, res) => {
      const isAuth = await validateJWTToken(req.headers.authorisation)
      if (!isAuth) return res.status(403).send('Unauthorized!')
      let question = req.body.data
      const response = await GPT_5(question)
      //save to db
      GPT_RESPONSE.create({
        question: question,
        response,
        token: JSON.stringify(isAuth.iat)
      })
      return res.status(200).json({ status: 'Success', response })
    })
  )
}
// get paginatged results:
function GetPaginatedResults (app) {
  app.get(
    '/historical-data',
    asyncMiddleware(async (req, res) => {
      if (req.query.page <= '0') return res.status(400).json(`page can't be 0`)
      const page = req.query.page
      const limit = 10
      const skip = (page - 1) * limit
      let response = await GPT_RESPONSE.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
      res.status(200).json(response)
      return response
    })
  )
}
function GetAll (app) {
  app.get(
    '/historical-data-all',
    asyncMiddleware(async (req, res) => {
      let response = await GPT_RESPONSE.find({}).sort({ createdAt: 1 })
      if (response.length === 0)
        return res.status(404).json('Sorry I have nothing for you!')
      res.status(200).json(response)
      return response
    })
  )
}

function FindOneItem (app) {
  app.get(
    '/story-item/:id',
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
    '/item/:id',
    asyncMiddleware(async (req, res) => {
      const itemId = req.params.id
      let item = await GPT_RESPONSE.findOne({ _id: new ObjectId(itemId) })
      if (!item) return res.status(404).json('Item could not be found')
      await item.delete()
      res.status(200).json({ message: 'Item deleletd', item })
    })
  )
}

module.exports = {
  Authenticate,
  AskGPT,
  GetPaginatedResults,
  GetAll,
  DeleteOne,
  FindOneItem
}
