const CONTAINER = document.querySelector('#main-container')
const form = document.querySelector('.submit_form')
const textArea = document.querySelector('#my_input')
const sendButton = document.querySelector('#submit_button')
const authButton = document.querySelector('#access_btn')
const leftContainer = document.querySelector('.inner_left_container')
const rightCont = document.querySelector('.inner_right_container')
const outRightContainer = document.querySelector('.right-container')
const mainLoaderRing = document.querySelector('#main-page-loader')

const searchInput = document.getElementById('seachhhh')
const searchBtn = document.getElementById('searchBTN')
const searchFORM = document.getElementById('search_form')

const previousButton = document.querySelector('.get-previous')
const nextButton = document.querySelector('.get-next')
let lastScroll = 0

exports = { CONTAINER }
const loading_1 = document.getElementById('__db_loader')
GET_loader(loading_1, true)

function Empty_Element (anchor) {
  let element = document.querySelector(anchor)
  return (element.innerHTML = '')
}
function GET_loader (element, isFinished) {
  if (!isFinished) return element.classList.add('con_loader')
  setTimeout(() => element.classList.remove('con_loader'), 200)
}
function formatDate (timestamp) {
  const date = new Date(timestamp)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return date
    .toLocaleDateString('en-US', options)
    .replace(',', '')
    .replace(/\s+/g, '-')
    .replace(/\s/g, '')
}
function QA_HTML (QB, RESPONSE, id) {
  return `
    <div data-id="${id}" class="init-question-response shadow-lg p-2 mb-1 bg-body rounded">
      <p class="init-question" style="position:relative;">
      <img src="./images/face_1.png" style="width:40px;height:40px;position:absolute;bottom:0;right:0;border-radius:50%;padding:.2rem; border:2px solid transparent;box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;" alt="">

        ${QB}<br>
        <span class="link fs-6" style="opacity:0">${id}</span>
      </p>
      <p class="init-response">
      <img src="./images/bot.webp" style="width:40px;height:40px;position:absolute;bottom:0;right:0;border-radius:50%;padding:.2rem; border:2px solid transparent;box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;" alt="">
        ${RESPONSE}<br>
        <span class="link" style="opacity:.5">${id}</span>
      </p>
    </div>  `
}
function DB_QN_RES_HTML (question, response, id, created_at) {
  return `
    <div data-id="${id}" class="db-question-response shadow-lg p-2 mb-1 bg-body rounded">
      <p class="db-question qustion" data-id="${id}">
        ${question}<br>
        <span class="link fs-6" style="opacity:0">${id}</span>
        <span class="link float-end fs-6" style="opacity:.5">${created_at}</span>
      </p>
      <p class="db-response response" data-id="${id}">
        ${response}<br>
        <span class="link" style="opacity:.5" data-id="${id}">${id}</span>
        <span class="link float-end" style="opacity:.5">${created_at}</span>
      </p>
    </div>`
}

function dbItem (item_id, quetion, response, createdAt, updatedAt) {
  return `
    <div id="single_item" data-id="${item_id}"  class="card">
        <div class="card-header d-flex  justify-content-between" style="padding: 1.1rem 4.5rem 1.1rem 4.5rem !important;">
            <p class="link-success">${item_id}</p>
            <a id="del_BTN" href="#" class="btn btn-danger">DELETE ITEM</a>
        </div>
        <div class="card-body" style="padding: 0 4.5rem 0 4.5rem !important;">
          <p data-qn="db-qn" class="card-text" style="overflow-y: auto !important; max-height:40%;">Question:&nbsp;${quetion}</p>
          <hr>
          <p data-res="db-res" class="card-text pb-2"  style="overflow-y: auto !important; max-height:40% !important;">Response:&nbsp;${response}</p>
        </div>
        <div class="d-flex justify-content-between card-footer" style="padding: 1.1rem 4.5rem 1.1rem 4.5rem !important;">
          <p data-time="db-createdAt">Created:&nbsp;${createdAt}</p>
          <p data-time="db-modifiedAt" class="floadt-end">Updated:&nbsp;${updatedAt}</p>
        </div>
        <div data-buttons="carocel-btn-container" class="container-fluid d-flex  justify-content-between align-items-center single-carocel-btn" 
              style="position:fixed;bottom:45%;left:50%;height:2rem;transform:translate(-50%, -50%);z-index:.05;">
          <span data-check="pre_v" id="prev-btn" style="z-index:1000;font-size:4rem;cursor:pointer;" class="text-black float-start prev">&#60;</span>
          <span data-check="nex_v" id="next-btn" style="z-index:1000;font-size:4rem;cursor:pointer;" class="text-black float-end next">&#62;</span>
        </div>
    </div>
    `
}
// Query pagination
async function fetchDataAndPaginate (previousButton, nextButton) {
  GET_loader(loading_1, false)
  try {
    let myToken = localStorage.getItem('token')
    const ITEMS_PER_PAGE = 10
    let currentPage = 1
    let totalItems = 0
    let responseData = []
    // Make initial API call to get total number of items
    const OPTIONS = {
      method: 'get',
      url: `/raybags/v1/wizard/data-all`,
      headers: { Authorization: myToken }
    }
    const response = await axios(OPTIONS)
    // if (response.data) return
    responseData = await response.data.data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
    totalItems = responseData.length
    if (totalItems === 0) {
      updateElementText('Nothing found in database', '#error_box')
    }
    // Display the initial data for the first page
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const dataToDisplay = responseData.slice(startIndex, endIndex)
    displayData(dataToDisplay)

    // Add click event listener to "next" button
    nextButton.addEventListener('click', async () => {
      currentPage += 1
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
      const endIndex = startIndex + ITEMS_PER_PAGE
      const dataToDisplay = responseData.slice(startIndex, endIndex)
      // Update UI with data for current page
      displayData(dataToDisplay)
      // Update pagination buttons based on current page and total number of items
      updatePaginationButtons()
      // Alert user if last page has been reached
      if (currentPage === Math.ceil(totalItems / ITEMS_PER_PAGE)) {
        updateElementText(
          ` This is the last page: ${currentPage}`,
          '#error_box'
        )
      }
    })
    // Add click event listener to "previous" button
    previousButton.addEventListener('click', async () => {
      let element = document.querySelector('#error_box')
      currentPage -= 1
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
      const endIndex = startIndex + ITEMS_PER_PAGE
      const dataToDisplay = responseData.slice(startIndex, endIndex)
      // Update UI with data for current page
      displayData(dataToDisplay)
      // Update pagination buttons based on current page and total number of items
      updatePaginationButtons()
      if (element) return Empty_Element('#error_box')
    })
    // Update pagination buttons based on current page and total number of items
    function updatePaginationButtons () {
      const maxPage = Math.ceil(totalItems / ITEMS_PER_PAGE)
      previousButton.classList.toggle('hide', currentPage === 1)
      nextButton.classList.toggle('hide', currentPage === maxPage)
      previousButton.classList.toggle(
        'hide_partial',
        currentPage === 1 || totalItems <= ITEMS_PER_PAGE
      )
    }
    function displayData (data) {
      if (!data) return
      rightCont.innerHTML = ''
      data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .forEach(item => {
          const { createdAt, question, response, _id } = item
          const dbQuestionResponseElement = document.createElement('div')
          dbQuestionResponseElement.dataset.id = _id
          dbQuestionResponseElement.classList.add(
            'db-question-response',
            'shadow-lg',
            'p-2',
            'mb-1',
            'bg-body',
            'rounded'
          )
          dbQuestionResponseElement.innerHTML = `
            <p class="question" data-id="${_id}">${question}</p>
            <p class="response" data-id="${_id}">${response}</p>
            <span class="link" style="opacity:.5">${_id}</span>
            <span class="link float-end" style="opacity:.5">${createdAt}</span>
          `

          rightCont.insertAdjacentElement(
            'afterbegin',
            dbQuestionResponseElement
          )
          outRightContainer.scrollTo(0, 0)
          GET_loader(loading_1, true)
        })
    }

    // Hide "previous" button on initial page
    previousButton.classList.add('hide')
    // Show/hide pagination buttons based on total number of items
    if (totalItems <= ITEMS_PER_PAGE) {
      nextButton.classList.add('hide')
    } else {
      nextButton.classList.remove('hide')
    }
    // Update pagination buttons based on initial state
    updatePaginationButtons()
  } catch (e) {
    if ((e.name = 'AxiosError')) {
      localStorage.removeItem('question')
      localStorage.removeItem('response')
      leftContainer.innerHTML = ''
      updateElementText('Database empty!', '#error_box')
      return
    }
  }
}
fetchDataAndPaginate(previousButton, nextButton)

const handleSubmit = async e => {
  try {
    e.preventDefault()
    let question_text = textArea.value
    if (!question_text || question_text == '') return
    sendButton.innerText = 'Processing...'
    await postFetch(question_text)
    sendButton.innerText = 'Submit'
    form.reset()
  } catch (e) {
    console.log('An error occurred:', e.message)
  }
}
textArea.addEventListener('keyup', async e => {
  try {
    if (e.key === 'Enter') handleSubmit(e)
  } catch (error) {
    console.info(`Error: ${error.message}`)
  }
})

async function postFetch (question) {
  if (!question || question == '' || question.length <= 1)
    return updateElementText(`Payload can't be empty message.`, '#error_box')

  handlerMainLoader(false)
  let myToken = localStorage.getItem('token')
  localStorage.removeItem('question')
  localStorage.removeItem('response')
  localStorage.setItem('question', JSON.stringify(question))
  let options = {
    method: 'post',
    url: '/raybags/v1/wizard/ask-me',
    data: { data: question },
    headers: {
      'Content-Type': 'application/json',
      Authorisation: myToken
    }
  }
  try {
    const response = await axios(options)
    const timestamp = Date.now()
    localStorage.setItem('response', JSON.stringify(response))
    localStorage.setItem('timestamp', JSON.stringify(timestamp))

    const QN = await JSON.parse(localStorage.getItem('question'))
    const time_stamp = await JSON.parse(localStorage.getItem('timestamp'))
    const { data } = await JSON.parse(localStorage.getItem('response'))

    if (data.status === 'Success') handlerMainLoader(true)

    leftContainer.insertAdjacentHTML(
      'afterbegin',
      QA_HTML((data.quetion && data.question) || QN, data.response, time_stamp)
    )

    updateElementText(data.status, '#error_box')
    await FetchData('?page=1')
  } catch (e) {
    const { message, status: statusText } = await e.response.data
    const { status } = await e.response
    if (status == 500 && statusText == 'failed') {
      if (!authButton.classList.contains('flashBTN')) {
        authButton.classList.add('flashBTN')
        setTimeout(() => authButton.classList.remove('flashBTN'), 1200)
      }
      handlerMainLoader(true)
      updateElementText(`You must authenticate!`, '#error_box')
    }
  }
}
async function FetchData (query) {
  try {
    if (query == undefined) query == '?page=1'
    let myToken = localStorage.getItem('token')
    const OPTIONS = {
      method: 'get',
      url: `/raybags/v1/wizard/data${query}`,
      headers: { Authorisation: myToken }
    }
    const response = await axios(OPTIONS)
    let responseData = await response.data.data
    if (!responseData.length) {
      outRightContainer.classList.toggle('hide')
      return updateElementText('Nothing found!', '#error_box')
    }

    responseData
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .forEach(item => {
        const { createdAt, question, response, _id } = item
        rightCont.insertAdjacentHTML(
          'afterbegin',
          DB_QN_RES_HTML(question, response, _id, formatDate(createdAt))
        )
        outRightContainer.scrollTo(0, 0)
        GET_loader(loading_1, true)
      })
  } catch (e) {
    console.warn(e.message)
  }
}

// bring in data
async function loadLocal () {
  try {
    const QN = JSON.parse(localStorage.getItem('question'))
    let item = localStorage.getItem('response')
    let timestamp = localStorage.getItem('timestamp')

    if (!item) return
    const { data } = JSON.parse(item)

    leftContainer.insertAdjacentHTML(
      'afterbegin',
      QA_HTML(QN, data.response, timestamp)
    )

    GET_loader(loading_1, false)
  } catch (e) {
    console.log(e.message)
  }
}
loadLocal()

// token handler
async function getToken () {
  const storedToken = localStorage.getItem('token')
  const storedTimestamp = localStorage.getItem('timestamp')
  // If a token is stored and less than 24 hours have elapsed since the last request
  if (storedToken && storedTimestamp && Date.now() - storedTimestamp < 86400000)
    return storedToken
  // If no token is stored or 24 hours have elapsed
  const response = await axios.post('/raybags/v1/wizard/auth')
  const token = response.data.token
  if (token) updateElementText('Authentication Succesful', '#error_box')
  // Save the token and the current timestamp to local storage
  localStorage.setItem('token', token)
  localStorage.setItem('timestamp', Date.now())
  return token
}
// delete item from db handler
async function deleteDBItem (e) {
  let id = e.target.dataset.id
  let itemToRemove = e.target
  let myToken = localStorage.getItem('token')

  if (!myToken) {
    GET_loader(loading_1, true)
    return updateElementText(
      ` Not authorized. Please authenticate`,
      '#error_box'
    )
  }
  const OPTIONS = {
    method: 'get',
    url: `/raybags/v1/wizard/data-all`,
    headers: { Authorization: myToken }
  }
  try {
    const response = await axios(OPTIONS)
    if (!response.data.data.length)
      return updateElementText(
        'something went wrong. Please try again later.',
        '#error_box'
      )
    response.data.data.forEach(item => {
      const { createdAt, question, response, _id, updatedAt } = item

      if (id == _id) {
        const messageHTML = dbItem(
          _id,
          question,
          response,
          formatDate(createdAt),
          formatDate(updatedAt)
        )
        document.body.insertAdjacentHTML('afterbegin', messageHTML)
        document.addEventListener('click', function (event) {
          try {
            let classes = [
              'card',
              'card-body',
              'card-text',
              'card-footer',
              'card-header',
              'link-danger',
              'single-carocel-btn',
              'prev',
              'next'
            ]
            let hasClass = classes.some(className =>
              event.target.classList.contains(className)
            )

            if (!hasClass) {
              let targetItm2 = document.getElementById('single_item')
              targetItm2 && targetItm2.remove()
            }
          } catch (e) {
            console.log(e.message)
          }
        })
        document.addEventListener('keydown', function (event) {
          let itemContainer = document.getElementById('single_item')
          try {
            if (event.key === 'Escape')
              return itemContainer && itemContainer.remove()
          } catch (e) {
            console.log(e.message)
          }
        })
        // deleting item
        document
          .querySelector('#del_BTN')
          .addEventListener('click', async e => {
            try {
              document.querySelector(`#single_item`).remove()

              let options = {
                method: 'delete',
                url: `/raybags/v1/wizard/delete-item/${_id}`,
                headers: {
                  Authorization: myToken
                }
              }
              const response = await axios(options)
              GET_loader(loading_1, false)
              if (response.status === 200) {
                setTimeout(() => itemToRemove.parentNode.remove(), 600)
                updateElementText(`Item deleted!`, '#error_box')
                GET_loader(loading_1, true)
              } else {
                updateElementText(`Oops Operation failed!`, '#error_box')
                document.body.insertAdjacentHTML('afterbegin', messageHTML)
              }
            } catch (e) {
              console.log(e.message)
            }
          })
      }
    })
  } catch (e) {
    console.warn(e.message)
  }
}
rightCont.addEventListener('click', deleteDBItem)

async function searchDatabase (e) {
  e.preventDefault()
  let inputValue = searchInput.value.trim()
  if (!inputValue) return
  let myToken = localStorage.getItem('token')
  const OPTIONS = {
    method: 'get',
    url: '/raybags/v1/wizard/data-all',
    headers: { Authorization: myToken }
  }
  const response = await axios(OPTIONS)
  const responseData = response.data.data
  if (!responseData.length) {
    outRightContainer.classList.toggle('hide')
    return updateElementText('Oops nothing found!', '#error_box')
  }
  let count = 0
  rightCont.innerHTML = '' // clear existing elements in container
  responseData
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .forEach(item => {
      const { createdAt, question, response, _id } = item
      const questionMatch = question
        .toLowerCase()
        .includes(inputValue.toLowerCase())
      const responseMatch = response
        .toLowerCase()
        .includes(inputValue.toLowerCase())

      if (!inputValue || questionMatch || responseMatch) {
        rightCont.insertAdjacentHTML(
          'afterbegin',
          DB_QN_RES_HTML(question, response, _id, formatDate(createdAt))
        )
        outRightContainer.scrollTo(0, 0)
        GET_loader(loading_1, true)
        count++
      }
    })
  if (count <= 0) {
    updateElementText(
      `I couldn't find what you were looking for!`,
      '#error_box'
    )
  } else {
    updateElementText(`${count} found!`, '#error_box')
  }
  // add event listener for input change
  searchInput.addEventListener('input', function () {
    inputValue = this.value.trim()
    rightCont.innerHTML = '' // clear existing elements in container
    responseData
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .forEach(item => {
        const { createdAt, question, response, _id } = item
        const questionMatch = question
          .toLowerCase()
          .includes(inputValue.toLowerCase())
        const responseMatch = response
          .toLowerCase()
          .includes(inputValue.toLowerCase())
        if (!inputValue || questionMatch || responseMatch) {
          rightCont.insertAdjacentHTML(
            'afterbegin',
            DB_QN_RES_HTML(question, response, _id, formatDate(createdAt))
          )
          outRightContainer.scrollTo(0, 0)
          GET_loader(loading_1, true)
        }
      })
    // if input value is empty, reload all data
    if (!inputValue || inputValue.length <= 0) {
      FetchData('-all')
    }
  })
}
// logger
function updateElementText (message, element_tag) {
  let element = document.querySelector(`${element_tag}`)
  if (!message || !element) return
  let timeoutId

  if (document.querySelector('#error_box').innerText !== '') {
    clearInnerText()
  }
  typingEffect('#error_box', message)
  document.addEventListener('click', clearInnerText)
  document.addEventListener('keydown', clearInnerText)
  timeoutId = setTimeout(clearInnerText, 4000)

  function clearInnerText () {
    document.querySelector('#error_box').innerText = ''
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
searchBtn.addEventListener('click', function (e) {
  searchDatabase(e)
})
searchFORM.addEventListener('submit', function (e) {
  searchDatabase(e)
})
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
// Add event listener for form submission
form.addEventListener('submit', handleSubmit)
sendButton.addEventListener('click', handleSubmit)
// authenticate
authButton.addEventListener('click', getToken)
// handle submit
