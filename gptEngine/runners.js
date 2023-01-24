const { Configuration, OpenAIApi } = require('openai')
const { WRITTER } = require('../Helpers/helper')

require('dotenv').config()
const { API_KEY_1, API_KEY_2 } = process.env

module.exports = {
  GPT_5: async arg => {
    try {
      console.log('How can I help ?? ')
      if (!arg) return console.log('Type your question!')
      console.log('processing......')
      const configuration = new Configuration({
        apiKey: API_KEY_1 || API_KEY_2
      })
      const openai = new OpenAIApi(configuration)

      let OPTIONS = {
        model: 'text-davinci-003',
        prompt: arg,
        temperature: 0.9,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.6
      }

      const response = await openai.createCompletion(OPTIONS)
      //console.log(response.data.choices[0].text)
      WRITTER(response.data.choices[0].text)
      return response.data.choices[0].text
    } catch (e) {
      console.log(`Error: ${e.message}`)
    }
  }
}
