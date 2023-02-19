const fs = require('fs')
const path = require('path')

module.exports = {
  WRITTER: async data => {
    const stream = fs.createWriteStream('output.txt', { flags: 'a' })
    // Write the text to the stream
    stream.write(`${data}\n**********************************`)
    // Wait for the stream to finish writing
    stream.on('finish', () => {
      console.log('======== Done =======')
    })
    // Close the stream
    stream.end()
    // Schedule a task to run every month
    const oneMonth = 30 * 24 * 60 * 60 * 1000 // in milliseconds
    setInterval(() => {
      // Delete all text from the "output.txt" file
      fs.writeFile(path.join(__dirname, 'output.txt'), '', err => {
        if (err) throw err
        console.log('File cleared <=> 👌')
      })
    }, oneMonth)
  }
}
