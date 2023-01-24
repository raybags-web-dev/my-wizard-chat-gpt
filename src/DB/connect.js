const mongoose = require('mongoose')

module.exports = function connectToDB (url) {
  try {
    mongoose.set('strictQuery', true)
    return mongoose
      .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => console.log('connected to Database...'))
  } catch (e) {
    console.log(e.message)
  }
}
