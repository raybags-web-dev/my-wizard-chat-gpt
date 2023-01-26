const CONTAINER = document.querySelector('#main-container')
const form = document.querySelector('.submit_form')
const textArea = document.querySelector('#my_input')
const leftContainer = document.querySelector('.inner_left_container')
const rightCont = document.querySelector('.inner_right_container')
const BTN_CONTAINER = Array.from(document.querySelectorAll('#BTN1 button'))

exports = { CONTAINER }
const loder = document.querySelector('.loading')
const sendButton = document.querySelector('#submit_button')
const my_key =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ3Mjk5NDgsImV4cCI6MTY3NDc4OTk0OH0.zm71_wO_rSxpkbsmpM2GqvF_gVWpl0rHlUVa57YOw-0'

function loader (element, isFinished) {
  if (!isFinished) {
    loder.classList.remove('hide')
    element.setAttribute('disabled', true)
    element.classList.add('hide_partial')
    return
  }
  setTimeout(() => {
    loder.classList.add('hide')
    element.removeAttribute('disabled')
    element.classList.remove('hide_partial')
  }, 1000)
}
//=============================
//=============================
function QUESTION_HTML (question) {
  return `
    <p style="min-width:100%"  class="init-quetion">
    ${question}
    <img src="./images/face_1.png"
        style="width:40px;height:40px;position:absolute;bottom:0;right:0;border-radius:50%;padding:.2rem;"
        alt="">
    </p>`
}
function RESPONSE_HTML (response) {
  return `
    <p style="min-width:100%"  class="init-response">
    ${response}
    <img src="./images/bot.webp"
        style="width:40px;height:40px;position:absolute;bottom:0;right:0;border-radius:50%;padding:.2rem;"
        alt="">
    </p>`
}
//=============================
//=============================
function DB_QN_HTML (question) {
  return `
  <p class="db-quetion animateUp
">
  ${question}
  <hr style="background-color: transparent;">
</p>`
}
function DB_RES_HTML (response) {
  return `
  <p class="db-response animateUp">
  ${response}
  <hr>
</p>`
}

;(async () => {
  BTN_CONTAINER.forEach(element => {
    element.addEventListener('click', async e => {
      try {
        if (e.target.classList.contains('b1')) {
          loader(sendButton, false)
          return FetchData('?page=1')
        }
        if (e.target.classList.contains('b2')) {
          loader(sendButton, false)
          return FetchData('?page=2')
        }
        if (e.target.classList.contains('b3')) {
          loader(sendButton, false)
          return FetchData('?page=3')
        }
        if (e.target.classList.contains('b4')) {
          loader(sendButton, false)
          return FetchData('?page=4')
        }
        if (e.target.classList.contains('b5')) {
          loader(sendButton, false)
          return FetchData('?page=5')
        }
        if (e.target.classList.contains('b6')) {
          loader(sendButton, false)
          return FetchData('?page=6')
        }
        if (e.target.classList.contains('b7')) {
          loader(sendButton, false)
          return FetchData('-all')
        }
      } catch (e) {
        console.log(e.message)
        LableFactory(`State: failed,  Details: ${e.message}`, 'alert-danger')
      }
    })
  })
  FetchData('-all')
})()

async function FetchData (query) {
  try {
    if (query == undefined) query == '?page=1'
    const OPTIONS = {
      method: 'get',
      url: `/raybags/v1/wizard/data${query}`,
      headers: {
        Authorisation: my_key
      }
    }

    const response = await axios(OPTIONS)
    if (!response.data.data.length)
      return LableFactory(
        `State: failed, Code: 404, Details: there is nothing in the database`,
        'alert-danger'
      )
    response.data.data.forEach(item => {
      const { createdAt, question, response } = item
      rightCont.insertAdjacentHTML(
        'afterbegin',
        DB_RES_HTML(response, createdAt)
      )
      rightCont.insertAdjacentHTML('afterbegin', DB_QN_HTML(question))
      loader(sendButton, true)
    })
  } catch (e) {
    console.log(e.message)
  }
}

const handleSubmit = async e => {
  e.preventDefault()
  let question_text = textArea.value
  if (!question_text || question_text == '') return
  try {
    loader(sendButton, false)
    await postFetch(question_text)
    loader(sendButton, true)
    form.reset()
  } catch (e) {
    console.log(e.message)
  }
}

async function postFetch (question) {
  if (!question || question == '') return
  localStorage.removeItem('question')
  localStorage.removeItem('response')
  localStorage.setItem('question', JSON.stringify(question))
  let options = {
    method: 'post',
    url: '/raybags/v1/wizard/ask-me',
    data: { data: question },
    headers: {
      'Content-Type': 'application/json',
      Authorisation: my_key
    }
  }
  // ======================remove loader===========
  try {
    const response = await axios(options)
    await localStorage.setItem('response', JSON.stringify(response))
    // await LableFactory(response.data.data, 'alert-success')
    loader(sendButton, true)

    const QN = await JSON.parse(localStorage.getItem('question'))
    const { data } = await JSON.parse(localStorage.getItem('response'))

    leftContainer.insertAdjacentHTML('afterbegin', RESPONSE_HTML(data.response))
    leftContainer.insertAdjacentHTML('afterbegin', QUESTION_HTML(QN))
  } catch (e) {
    console.log(e.message)
    const { message, status: statusText } = e.response.data
    const { status } = e.response
    if (status == 500 && statusText == 'failed') {
      return LableFactory(
        `State: ${statusText}, Code: ${status} Details: ${message}`,
        'alert-danger'
      )
    }
  }
}

// bring in data
;(async () => {
  try {
    const QN = JSON.parse(localStorage.getItem('question'))
    let item = localStorage.getItem('response')
    if (!item) return
    const { data } = JSON.parse(item)

    leftContainer.insertAdjacentHTML('afterbegin', RESPONSE_HTML(data.response))
    leftContainer.insertAdjacentHTML('afterbegin', QUESTION_HTML(QN))
    loader(sendButton, true)
  } catch (e) {
    console.log(e)
  }
})()

//'alert-danger'
//'alert-info'
//'alert-light'

async function LableFactory (Msg, alertLable_class) {
  if (!Msg) return
  const element = `<div class="alert ${alertLable_class} bg-dark text-white fixed-top text-center alert_lable" role="alert" style="margin-top:-10%;transition:0.5s;border-color:transparent;">${Msg}</div>`
  document.body.insertAdjacentHTML('afterbegin', element)
  return element
}

// typing effect
function typingEffect (text, outputAnchor) {
  let counter = 0
  function printLetter () {
    document.querySelector(outputAnchor).textContent += text[counter]
    counter++
    if (counter < text.length) {
      setTimeout(printLetter, Math.random() * 70)
    }
  }
  printLetter()
}
// ==========================================
form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', async e => {
  if (e.keyCode === 13) {
    handleSubmit(e)
  }
})
sendButton.addEventListener('click', handleSubmit)
