const CONTAINER = document.querySelector('#main-container')
const form = document.querySelector('.submit_form')
const textArea = document.querySelector('#my_input')
const leftContainer = document.querySelector('.inner_left_container')
const rightCont = document.querySelector('.inner_right_container')
const DBlader = document.querySelector('#RC')
const BTN_CONTAINER = Array.from(document.querySelectorAll('#BTN1 button'))

exports = { CONTAINER }
const loder = document.querySelector('.loading')
const sendButton = document.querySelector('#submit_button')
const my_key =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQwMzgxODYsImV4cCI6MTY3NDA5ODE4Nn0.EjIVgkgOHVpIc3mD-ny6gDaLhYUu-44KhaXp7nUq7SM'

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
  DBlader.classList.remove('hide')
  BTN_CONTAINER.forEach(element => {
    element.addEventListener('click', e => {
      DBlader.classList.remove('hide')
      if (e.target.classList.contains('b1')) {
        DBlader.classList.add('hide')
        return FetchData('?page=1')
      }
      if (e.target.classList.contains('b2')) {
        DBlader.classList.add('hide')
        return FetchData('?page=2')
      }
      if (e.target.classList.contains('b3')) {
        DBlader.classList.add('hide')
        return FetchData('?page=3')
      }
      if (e.target.classList.contains('b4')) {
        DBlader.classList.add('hide')
        return FetchData('?page=4')
      }
      if (e.target.classList.contains('b5')) {
        DBlader.classList.add('hide')
        return FetchData('?page=5')
      }
      if (e.target.classList.contains('b6')) {
        DBlader.classList.add('hide')
        return FetchData('?page=6')
      }
      if (e.target.classList.contains('b7')) {
        DBlader.classList.add('hide')
        return FetchData('-all')
      }
    })
  })

  FetchData('?page=1')
  DBlader.classList.add('hide')
})()

function FetchData (query) {
  const OPTIONS = {
    method: 'get',
    url: `http://localhost:4200/historical-data${query}`,
    headers: {
      Authorisation: my_key
    }
  }
  axios(OPTIONS).then(response => {
    response.data.forEach(item => {
      const { createdAt, question, response } = item

      rightCont.insertAdjacentHTML(
        'afterbegin',
        DB_RES_HTML(response, createdAt)
      )
      rightCont.insertAdjacentHTML('afterbegin', DB_QN_HTML(question))
      //   DBlader.classList.add('hide')
    })
  })
}

const handleSubmit = async e => {
  e.preventDefault()
  let question_text = textArea.value
  if (!question_text || question_text == '') return
  try {
    loader(sendButton, false)
    postFetch(question_text)
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
    url: 'http://localhost:4200/raybags/ask-me',
    data: { data: question },
    headers: {
      Authorisation: my_key
    }
  }

  axios(options)
    .then(response => {
      localStorage.setItem('response', JSON.stringify(response))
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
    console.log(e.message)
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
