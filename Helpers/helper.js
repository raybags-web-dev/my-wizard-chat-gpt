const fs = require('fs')

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
  }
}
