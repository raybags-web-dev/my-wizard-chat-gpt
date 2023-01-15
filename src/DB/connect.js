const mongoose = require("mongoose")

module.exports = function async(url) {
    try {
        mongoose.set("strictQuery", true);
        return mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).finally(() => console.log('connected to Database...'));
    } catch (e) {
        console.log(e.message)
    }
}