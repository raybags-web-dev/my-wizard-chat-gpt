// token handler
async function getToken () {
  // get the current date and time
  let now = new Date()

  // format the date and time in a way that can be compared to the stored date and time
  let nowFormatted = `${now.getFullYear()}-${
    now.getMonth() + 1
  }-${now.getDate()}-${now.getHours()}`
  // get the stored date and time of the last token
  let tokenDate = localStorage.getItem('tokenDate')

  // if there is a stored token and it's not from today
  if (tokenDate && tokenDate !== nowFormatted) {
    localStorage.removeItem('token')
  }
  // get the stored token
  let token = localStorage.getItem('token')

  // if there is no stored token
  if (!token) {
    try {
      let options = {
        method: 'post',
        url: '/raybags/v1/wizard/auth',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await axios(options)
      token = response.data.token
      localStorage.setItem('token', token)
      localStorage.setItem('tokenDate', nowFormatted)
    } catch (e) {
      console.log(e.message)
    }
  }
  return token
}
