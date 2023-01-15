const express = require('express')
const app = express()
const cors = require('cors')

const morgan = require('morgan')

const {
  Authenticate,
  AskGPT,
  GetPaginatedResults,
  GetAll,
  DeleteOne,
  FindOneItem
} = require('./functions/router')
const connectDB = require('./src/DB/connect')

require('dotenv').config()
const { MONGO_URI } = process.env

app.use(cors())
app.use(express.static('public'))
app.use(express.json())
app.use(morgan('tiny'))

Authenticate(app)
AskGPT(app)
GetPaginatedResults(app)
GetAll(app)
DeleteOne(app)
FindOneItem(app)

const PORT = process.env.PORT || 4200
app.listen(PORT, () => {
  connectDB(MONGO_URI)
  console.log('GPT running on port: ' + PORT)
})
