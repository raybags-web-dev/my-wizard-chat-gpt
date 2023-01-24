const mongoose = require('mongoose')
// scrapped data object
const ResponseModel = {
  question: {
    type: String,
    maxlength: 10000,
    minlength: 1
  },
  response: {
    type: String,
    maxlength: 20000000000,
    minlength: 1
  },
  token: {
    type: String,
    maxlength: 500,
    minlength: 3
  }
}
// scrapped data schema
const GPT_RESPONSE_SCHEMA = new mongoose.Schema(ResponseModel, {
  timestamps: true
})
module.exports = {
  GPT_RESPONSE: mongoose.model('gpt-collection', GPT_RESPONSE_SCHEMA)
}
