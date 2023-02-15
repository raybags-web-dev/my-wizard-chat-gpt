const CONTAINER = document.querySelector('#main-container')
const form = document.querySelector('.submit_form')
const textArea = document.querySelector('#my_input')
const sendButton = document.querySelector('#submit_button')
const authButton = document.querySelector('#access_btn')
const leftContainer = document.querySelector('.inner_left_container')
const rightCont = document.querySelector('.inner_right_container')
const outRightContainer = document.querySelector('.right-container')
const BTN_CONTAINER = Array.from(document.querySelectorAll('#BTN1 button'))
const mainLoaderRing = document.querySelector('#main-page-loader')
let lastScroll = 0

exports = { CONTAINER }
const loading_1 = document.getElementById('__db_loader')

function GET_loader (element, isFinished) {
  if (!isFinished) return element.classList.add('con_loader')
  setTimeout(() => element.classList.remove('con_loader'), 200)
}
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
function DB_QN_HTML (question, id, created_at) {
  return `<p data-id="${id}"  class="db-quetion">${question}<br>
  <span class="link-danger text-muted fs-6">${id}</span>
  <span class="link-danger float-end text-muted fs-6">${created_at}</span>
  </p> `
}
function DB_RES_HTML (response, id, created_at) {
  return `<p data-id="${id}" class="db-response">${response}<br>
  <span class="link-danger text-muted">${id}</span>
  <span class="link-danger float-end text-muted">${created_at}</span>
  </p>`
}
function dbItem (item_id, quetion, response, createdAt, updatedAt) {
  return `
    <div id="single_item" class=" card text-white">
        <div class="card-header d-flex  p-2 justify-content-between">
            <p class="link-danger">${item_id}</p>
            <a id="del_BTN" href="#" class="btn btn-danger">DELETE ITEM</a>
        </div>
        <div class="card-body">
          <p class="card-text">Question:&nbsp;${quetion}</p>
          <hr>
          <p class="card-text">Response:&nbsp;${response}</p>
        </div>
        <div class="d-flex justify-content-between card-footer link-danger ">
          <p >Created:&nbsp;${createdAt}</p>
          <p class="floadt-end">Updated:&nbsp;${updatedAt}</p>
        </div>
    </div>
    `
}
// Query pagination
async function paginated () {
  BTN_CONTAINER.forEach(element => {
    element.addEventListener('click', async e => {
      try {
        if (e.target.classList.contains('b1')) {
          GET_loader(loading_1, false)
          return await FetchData('?page=1')
        }
        if (e.target.classList.contains('b2')) {
          GET_loader(loading_1, false)
          return await FetchData('?page=2')
        }
        if (e.target.classList.contains('b3')) {
          GET_loader(loading_1, false)
          return await FetchData('?page=3')
        }
        if (e.target.classList.contains('b4')) {
          GET_loader(loading_1, false)
          return await FetchData('?page=4')
        }
        if (e.target.classList.contains('b5')) {
          GET_loader(loading_1, false)
          return await FetchData('?page=5')
        }
        if (e.target.classList.contains('b6')) {
          GET_loader(loading_1, false)
          return await FetchData('?page=6')
        }
        if (e.target.classList.contains('b7')) {
          GET_loader(loading_1, false)
          return await FetchData('-all')
        }
      } catch (e) {
        updateElementText(e.message, '#error_box')
      }
    })
  })
  FetchData('?page=1')
}
paginated()
const handleSubmit = async e => {
  e.preventDefault()
  let question_text = textArea.value
  if (!question_text || question_text == '') return
  sendButton.innerText = 'Processing...'
  try {
    await postFetch(question_text)
    sendButton.innerText = 'Submit'

    form.reset()
  } catch (e) {
    updateElementText(e.message, '#error_box')
  }
}
async function postFetch (question) {
  if (!question || question == '' || question.length <= 1)
    return updateElementText(
      'Oops, you fogot to type your message.',
      '#error_box'
    )
  handlerMainLoader(false)
  localStorage.removeItem('question')
  localStorage.removeItem('response')
  localStorage.setItem('question', JSON.stringify(question))
  let options = {
    method: 'post',
    url: '/raybags/v1/wizard/ask-me',
    data: { data: question },
    headers: {
      'Content-Type': 'application/json',
      Authorisation: await getToken()
    }
  }
  //=============remove LOADER===========
  try {
    const response = await axios(options)
    localStorage.setItem('response', JSON.stringify(response))
    const QN = await JSON.parse(localStorage.getItem('question'))
    const { data } = await JSON.parse(localStorage.getItem('response'))
    if (data.status === 'Success') handlerMainLoader(true)
    //  typingEffect(data.response)

    leftContainer.insertAdjacentHTML('afterbegin', RESPONSE_HTML(data.response))
    leftContainer.insertAdjacentHTML('afterbegin', QUESTION_HTML(QN))
    updateElementText(data.status, '#error_box')
    await FetchData('?page=1')
  } catch (e) {
    const { message, status: statusText } = await e.response.data
    const { status } = await e.response
    if (status == 500 && statusText == 'failed') {
      updateElementText(
        `State: ${statusText}, Code: ${status} Details: ${message}`,
        '#error_box'
      )
    }
  }
}
async function FetchData (query) {
  try {
    if (query == undefined) query == '?page=1'
    const OPTIONS = {
      method: 'get',
      url: `/raybags/v1/wizard/data${query}`,
      headers: { Authorisation: await getToken() }
    }
    const response = await axios(OPTIONS)
    let responseData = await response.data.data
    if (!responseData.length)
      return updateElementText('Oops nothing found!', '#error_box')
    responseData
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .forEach(item => {
        const { createdAt, question, response, _id } = item
        rightCont.insertAdjacentHTML(
          'afterbegin',
          DB_RES_HTML(response, _id, createdAt)
        )
        rightCont.insertAdjacentHTML(
          'afterbegin',
          DB_QN_HTML(question, _id, createdAt)
        )
        outRightContainer.scrollTo(0, 0)
        GET_loader(loading_1, true)
      })
  } catch (e) {
    updateElementText(e.message, '#error_box')
  }
}
// bring in data
async function loadLocal () {
  try {
    const QN = JSON.parse(localStorage.getItem('question'))
    let item = localStorage.getItem('response')
    if (!item) return
    const { data } = JSON.parse(item)

    leftContainer.insertAdjacentHTML('afterbegin', RESPONSE_HTML(data.response))
    leftContainer.insertAdjacentHTML('afterbegin', QUESTION_HTML(QN))
    GET_loader(loading_1, false)
  } catch (e) {
    updateElementText(e.message, '#error_box')
  }
}
loadLocal()
function updateElementText (message, element_tag) {
  let element = document.querySelector(`${element_tag}`)
  if (!message || !element) return
  let timeoutId

  typingEffect('#error_box', message)
  document.addEventListener('click', clearInnerText)
  document.addEventListener('keydown', clearInnerText)
  timeoutId = setTimeout(clearInnerText, 5000)

  function clearInnerText () {
    element.innerText = ''
    document.removeEventListener('click', clearInnerText)
    document.removeEventListener('keydown', clearInnerText)
    clearTimeout(timeoutId)
  }
}
//typing handler with elemnet
async function typingEffect (element, message, typingSpeed = 4) {
  let ELEMENT = document.querySelector(`${element}`)
  let index = 0
  function type () {
    if (index < message.length) {
      ELEMENT.innerHTML += message.charAt(index)
      index++
      setTimeout(type, typingSpeed)
    }
  }
  type()
}
// token handler
async function getToken () {
  // Get the current timestamp
  const now = Date.now()

  // Check if a token is already stored in local storage
  const storedToken = localStorage.getItem('token')
  const storedTimestamp = localStorage.getItem('timestamp')

  // If a token is stored and less than 24 hours have elapsed since the last request
  if (storedToken && storedTimestamp && now - storedTimestamp < 86400000) {
    return storedToken
  }

  // If no token is stored or 24 hours have elapsed
  const response = await axios.post('/raybags/v1/wizard/auth')
  const token = response.data.token

  // Save the token and the current timestamp to local storage
  localStorage.setItem('token', token)
  localStorage.setItem('timestamp', now)

  return token
}
document.addEventListener('click', async e => {
  let id = e.target.dataset.id
  let itemToRemove = e.target

  if (itemToRemove.classList.contains('flash')) {
    itemToRemove.classList.remove('flash')
  }
  itemToRemove.classList.add('flash')
  try {
    const OPTIONS = {
      method: 'get',
      url: `/raybags/v1/wizard/data-all`,
      headers: { Authorisation: await getToken() }
    }

    const response = await axios(OPTIONS)
    if (!response.data.data.length)
      return updateElementText('Oops nothing found!', '#error_box')
    response.data.data.forEach(item => {
      const { createdAt, question, response, _id, updatedAt } = item
      if (id === _id) {
        document.body.insertAdjacentHTML(
          'afterbegin',
          dbItem(_id, question, response, createdAt, updatedAt)
        )
        document.addEventListener('click', function (event) {
          try {
            let classes = [
              'card',
              'card-body',
              'card-text',
              'card-footer',
              'card-header',
              'link-danger'
            ]
            let hasClass = classes.some(className =>
              event.target.classList.contains(className)
            )
            if (!hasClass) {
              itemToRemove.classList.remove('flash')
              let targetItm2 = document.getElementById('single_item')
              targetItm2 && targetItm2.remove()
            }
          } catch (e) {
            console.log(e.message)
          }
        })
        document.addEventListener('keydown', function (event) {
          try {
            if (event.key === 'Escape') {
              itemToRemove.classList.remove('flash')
              let targetItm1 = document.getElementById('single_item')
              targetItm1 && targetItm1.remove()
            }
          } catch (e) {
            console.log(e.message)
          }
        })
        let current_element = document.querySelector(`#single_item`)
        document
          .querySelector('#del_BTN')
          .addEventListener('click', async e => {
            updateElementText('processing request...', '#error_box')
            try {
              current_element.remove()
              // ================================
              // ================================
              setTimeout(() => {
                let to_remove_main = itemToRemove
                let to_remove1 = itemToRemove.nextElementSibling
                let to_remove2 = itemToRemove.previousSibling

                to_remove_main.remove()

                if (to_remove_main.dataset.id == to_remove1.dataset.id) {
                  to_remove1.remove()
                } else if (to_remove_main.dataset.id == to_remove2.dataset.id) {
                  to_remove2.remove()
                }
              }, 500)

              let options = {
                method: 'delete',
                url: `/raybags/v1/wizard/delete-item/${_id}`,
                headers: {
                  Authorization: await getToken()
                }
              }

              const response = await axios(options)
              if (response.data.message)
                return updateElementText(response.data.message, '#error_box')
              await FetchData('-all')
            } catch (e) {
              return updateElementText(e.message, '#error_box')
            }
          })
      }
    })
  } catch (e) {
    console.log(e.message)
  }
})
;(async () => {
  const input = document.getElementById('seachhhh')
  const searchBtn = document.getElementById('searchBTN')
  const searchFORM = document.getElementById('search_form')

  const OPTIONS = {
    method: 'get',
    url: '/raybags/v1/wizard/data-all',
    headers: { Authorisation: await getToken() }
  }

  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      fetchData()
      searchFORM.reset()
    }
  })

  searchBtn.addEventListener('click', event => {
    fetchData()
    searchFORM.reset()
  })

  async function fetchData () {
    if (!input.value || input.value == '') return
    try {
      // TODO..........
      const response = await axios(OPTIONS)
      const { totalPages, totalCount, data } = response.data
      const filteredData = data.filter(
        item =>
          item.question.toLowerCase().includes(input.value.toLowerCase()) ||
          item.response.toLowerCase().includes(input.value.toLowerCase())
      )
      console.log(filteredData)
      // TODO..........
    } catch (error) {
      console.error(error)
    }
  }
})()

// paginateButtons()

// async function paginateButtons () {
//   const itemsPerPage = 10
//   let currentPage = 1

//   const options = {
//     method: 'get',
//     url: '/raybags/v1/wizard/data-all',
//     headers: { Authorization: await getToken() }
//   }

//   const response = await axios(options)
//   const totalItems = response.data.data.totalCount

//   // Create and append the buttons to the container
//   const buttonContainer = document.getElementById('BTN1')
//   for (let i = 1; i <= 6; i++) {
//     const button = document.createElement('button')
//     button.type = 'button'
//     button.classList.add('btn', 'btn-outline-success', 'btn-lg', `b${i}`)
//     button.innerText = i
//     buttonContainer.appendChild(button)
//   }
//   // ============================
//   const buttons = document.querySelectorAll('#BTN1 > button')
//   const nextButton = document.querySelector('#nextBTN')

//   function updateButtons () {
//     for (let i = 0; i < buttons.length; i++) {
//       const currentButtonIndex = (currentPage - 1) * itemsPerPage + i
//       if (currentButtonIndex < totalItems) {
//         buttons[i].innerText = `Item ${currentButtonIndex + 1}`
//       } else {
//         buttons[i].style.display = 'none'
//       }
//     }
//   }

//   function handleNextButtonClick () {
//     currentPage++
//     updateButtons()
//     if (currentPage * itemsPerPage >= totalItems) {
//       nextButton.style.display = 'none'
//     }
//   }

//   function handlePaginationButtonClick (index) {
//     currentPage = Math.floor(index / itemsPerPage) + 1
//     updateButtons()
//     if (currentPage * itemsPerPage >= totalItems) {
//       nextButton.style.display = 'none'
//     } else {
//       nextButton.style.display = 'block'
//     }
//   }

//   updateButtons()
//   nextButton.addEventListener('click', handleNextButtonClick)
//   for (let i = 0; i < buttons.length; i++) {
//     buttons[i].addEventListener('click', () => handlePaginationButtonClick(i))
//   }
// }

// bg for pagination buttons
outRightContainer.addEventListener('scroll', function () {
  let container = document.querySelector('#BTN1')
  let currentScroll = this.scrollTop
  if (currentScroll < lastScroll) {
    container.classList.remove('_ANIME_')
  } else {
    container.classList.add('_ANIME_')
  }
  lastScroll = currentScroll
})
function handlerMainLoader (isStuffDone) {
  const mainLoaderRing = document.querySelector('#main-page-loader')
  mainLoaderRing.classList.remove('hide')
  if (isStuffDone) {
    mainLoaderRing.classList.add('hide')
  } else {
    mainLoaderRing.classList.remove('hide')
  }
}
window.addEventListener('DOMContentLoaded', event => {
  handlerMainLoader(true)
})
form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', async e => {
  if (e.keyCode === 13) {
    handleSubmit(e)
  }
})
authButton.addEventListener('click', async () => {
  ;['token, timestamp'].forEach(key => {
    localStorage.removeItem(key)
  })
  location.reload()
})
sendButton.addEventListener('click', handleSubmit)
