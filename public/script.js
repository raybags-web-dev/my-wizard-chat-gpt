const CONTAINER = document.querySelector('#main-container')
const form = document.querySelector('.submit_form')
const textArea = document.querySelector('#my_input')
const leftContainer = document.querySelector('.inner_left_container')
const rightCont = document.querySelector('.inner_right_container')
const DBloader = document.querySelector('#RC')
const BTN_CONTAINER = Array.from(document.querySelectorAll('#BTN1 button'))

exports = { CONTAINER }
const loder = document.querySelector('.loading')
const sendButton = document.querySelector('#submit_button')
const my_key =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2MDUwMTMsImV4cCI6MTY3NDY2NTAxM30.Qy_5vbUXjq-xF8XZnvdaoCB2Sg3TqXpTPeurdDea6JM'

function loader (element, isFinished) {
  if (!isFinished) {
    loder.classList.remove('hide')
    element.setAttribute('disabled', true)
    element.classList.add('hide_partial')
    return
  }
  loder.classList.add('hide')
  element.removeAttribute('disabled')
  element.classList.remove('hide_partial')
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
  <p class="db-quetion animateUp">
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
  DBloader.classList.remove('hide')
  BTN_CONTAINER.forEach(element => {
    element.addEventListener('click', e => {
      if (e.target.classList.contains('b1')) {
        DBloader.classList.add('hide')
        return FetchData('?page=1')
      }
      if (e.target.classList.contains('b2')) {
        DBloader.classList.add('hide')
        return FetchData('?page=2')
      }
      if (e.target.classList.contains('b3')) {
        DBloader.classList.add('hide')
        return FetchData('?page=3')
      }
      if (e.target.classList.contains('b4')) {
        DBloader.classList.add('hide')
        return FetchData('?page=4')
      }
      if (e.target.classList.contains('b5')) {
        DBloader.classList.add('hide')
        return FetchData('?page=5')
      }
      if (e.target.classList.contains('b6')) {
        DBloader.classList.add('hide')
        return FetchData('?page=6')
      }
      if (e.target.classList.contains('b7')) {
        DBloader.classList.add('hide')
        return FetchData('-all')
      }
    })
  })
  FetchData('-all')
  DBloader.classList.add('hide')
})()

function FetchData (query) {
  if (query == undefined) query == '?page=1'
  const OPTIONS = {
    method: 'get',
    url: `/raybags/v1/wizard/data${query}`,
    headers: {
      Authorisation: my_key
    }
  }
  axios(OPTIONS).then(response => {
    response.data.data.forEach(item => {
      const { createdAt, question, response } = item

      rightCont.insertAdjacentHTML(
        'afterbegin',
        DB_RES_HTML(response, createdAt)
      )
      rightCont.insertAdjacentHTML('afterbegin', DB_QN_HTML(question))
      DBloader.classList.add('hide')
    })
  })
}

const handleSubmit = async e => {
  e.preventDefault()
  let question_text = textArea.value
  if (!question_text || question_text == '') return
  try {
    loader(sendButton, false)
    await postFetch(question_text)
    // DBloader.classList.add('hide')
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
  // ======================remove loader===========
  // ======================remove loader===========
  axios(options)
    .then(response => {
      localStorage.setItem('response', JSON.stringify(response))
      console.log(response)
      DBloader.classList.add('hide')
      loader(sendButton, true)

      const QN = JSON.parse(localStorage.getItem('question'))
      const { data } = JSON.parse(localStorage.getItem('response'))

      leftContainer.insertAdjacentHTML(
        'afterbegin',
        RESPONSE_HTML(data.response)
      )
      leftContainer.insertAdjacentHTML('afterbegin', QUESTION_HTML(QN))
    })
    .catch(e => console.log(e.message))
}

// bring in data
;(async () => {
  try {
    const QN = JSON.parse(localStorage.getItem('question'))
    const { data } = JSON.parse(localStorage.getItem('response'))

    leftContainer.insertAdjacentHTML('afterbegin', RESPONSE_HTML(data.response))
    leftContainer.insertAdjacentHTML('afterbegin', QUESTION_HTML(QN))
    loader(sendButton, true)
  } catch (e) {
    console.log(e)
  }
})()
// ==========================================
// ==========================================
form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', async e => {
  if (e.keyCode === 13) {
    handleSubmit(e)
  }
})
sendButton.addEventListener('click', handleSubmit)
