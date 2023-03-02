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
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  return `${year}-${month}-${day},${hours}:${minutes}`
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
        <span class="link" style="opacity:0;" data-id="${id}">${id}</span>
        <span class="link float-end" style="opacity:.5">${created_at}</span>
      </p>
    </div>`
}
function dbItem (item_id, quetion, response, createdAt, updatedAt) {
  return `
    <div id="single_item" data-id="${item_id}"  class="card">
        <div class="card-header d-flex  justify-content-between" style="padding: 1.1rem 4.5rem 1.1rem 4.5rem !important;">
            <p data-itemid="timestamp" class="link-success">${item_id}</p>
            <a id="del_BTN" href="#" class="btn btn-danger">DELETE ITEM</a>
            <span class="DB_Carocel_loader"></span>
        </div>
        <div class="card-body" style="padding: 0 4.5rem 0 4.5rem !important;">
          <p data-qn="db-qn" class="card-text" style="overflow-y: auto !important; max-height:50%;">Question: ${quetion}</p>
          <hr>
          <p data-res="db-res" class="card-text pb-2"  style="overflow-y: auto !important;">Response: ${response}</p>
        </div>
        <div class="d-flex justify-content-between card-footer" style="padding: 1.1rem 4.5rem 1.1rem 4.5rem !important;">
          <p data-time="db-createdAt">Created: ${createdAt}</p>
          <p data-time="db-modifiedAt" class="floadt-end">Updated: ${updatedAt}</p>
        </div>
        <div data-buttons="carocel-btn-container" class="container-fluid d-flex  justify-content-between align-items-center single-carocel-btn" 
              style="position:fixed;bottom:45%;left:50%;height:2rem;transform:translate(-50%, -50%);z-index:.05;">
          <a data-check="pre_v" id="prev-btn" style="z-index:1000;font-size:4rem;cursor:pointer;" class="text-black float-start prev">&#60;</a>
          <a data-check="nex_v" id="next-btn" style="z-index:1000;font-size:4rem;cursor:pointer;" class="text-black float-end next">&#62;</a>
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
            <span class="link" style="opacity:0;">${_id}</span>
            <span class="link float-end" style="opacity:.5">${formatDate(
              createdAt
            )}</span>
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
    const QNtimestamp = Date.now()
    localStorage.setItem('response', JSON.stringify(response))
    localStorage.setItem('QNtimestamp', JSON.stringify(QNtimestamp))

    const QN = await JSON.parse(localStorage.getItem('question'))
    const time_stamp = await JSON.parse(localStorage.getItem('QNtimestamp'))
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
  let auth_btn = document.getElementById('access_btn')
  auth_btn.textContent = 'AUTHENTICATE'
  const storedToken = localStorage.getItem('token')
  const storedTimestamp = localStorage.getItem('timestamp')
  // If a token is stored and less than 24 hours have elapsed since the last request
  if (
    storedToken &&
    storedTimestamp &&
    Date.now() - storedTimestamp < 86400000
  ) {
    updateElementText(
      ' Authenticated for the next ' +
        (24 - (new Date().getHours() % 24)) +
        'hrs',
      '#error_box'
    )
    auth_btn.innerText = 'AUTHENTICATED'

    return storedToken
  }
  // If no token is stored or 24 hours have elapsed
  handlerMainLoader(false)
  auth_btn.innerText = 'PROCESSING...'
  setTimeout(async () => {
    const response = await axios.post('/raybags/v1/wizard/auth')
    const token = response.data.token
    if (token) updateElementText('Authentication Succesful', '#error_box')
    // Save the token and the current timestamp to local storage
    localStorage.setItem('token', token)
    localStorage.setItem('timestamp', Date.now())
    auth_btn.innerText = 'SUCCESS ✅'
    handlerMainLoader(true)
    return token
  }, 1000)
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
    const DBresponse = await axios(OPTIONS)
    if (!DBresponse.data.data.length)
      return updateElementText(
        'something went wrong. Please try again later.',
        '#error_box'
      )
    DBresponse.data.data.forEach(item => {
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
        handleNextPrev(DBresponse.data.data)

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
// handle delete
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
async function handleNextPrev () {
  const myToken = localStorage.getItem('token')
  const options = {
    method: 'get',
    headers: { Authorization: myToken }
  }
  const CarucelNextButton = await document.getElementById('next-btn')
  const CarucelPrevButton = await document.getElementById('prev-btn')
  let currentITEM = document.querySelector('#single_item').dataset.id
  options.url = `/raybags/v1/wizard/data-all`
  let response = await axios(options)
  let responseData = await response.data.data
  let currentItemIndex = responseData.findIndex(
    item => item._id === currentITEM
  )
  handleNextPrevUI(responseData[currentItemIndex])
  // Disable prev button when showing first item
  if (currentItemIndex === 0) {
    CarucelPrevButton.disabled = true
  }
  CarucelNextButton.addEventListener('click', async () => {
    if (currentItemIndex < responseData.length - 1) {
      currentItemIndex++
      await handleNextPrevUI(responseData[currentItemIndex])
      // Enable prev button when moving away from first item
      if (currentItemIndex === 1) {
        CarucelPrevButton.disabled = false
      }
      // Hide next button when showing last item
      if (currentItemIndex === responseData.length - 1) {
        CarucelNextButton.style.display = 'none'
      }
    }
  })
  CarucelPrevButton.addEventListener('click', async () => {
    if (currentItemIndex > 0) {
      currentItemIndex--
      await handleNextPrevUI(responseData[currentItemIndex])
      // Enable next button when moving away from last item
      if (currentItemIndex === responseData.length - 2) {
        CarucelNextButton.style.display = 'block'
      }
      // Hide prev button when showing first item
      if (currentItemIndex === 0) {
        CarucelPrevButton.disabled = true
      }
    }
  })
}
async function handleNextPrevUI (item) {
  if (!item || item == undefined) return
  document.querySelector('.DB_Carocel_loader').style.display = 'block'
  setTimeout(async () => {
    const { createdAt, updatedAt, question, response, _id } = await item
    const container = document.getElementById('single_item')
    const DB_IDD = document.querySelector('[data-itemid="timestamp"]')
    const DB_QNN = document.querySelector('[data-qn="db-qn"]')
    const DB_RESS = document.querySelector('[data-res="db-res"]')
    const DB_MDTIME = document.querySelector('[data-time="db-modifiedAt"]')
    const DB_CTIME = document.querySelector('[data-time="db-createdAt"]')

    container.setAttribute('data-id', `${_id}`)
    DB_IDD.textContent = _id
    DB_QNN.textContent = `Question: ${question}`
    DB_RESS.textContent = `Response: ${response}`
    DB_MDTIME.textContent = `Updated: ${formatDate(updatedAt)}`
    DB_CTIME.textContent = `Created: ${formatDate(createdAt)}`
    document.querySelector('.DB_Carocel_loader').style.display = 'none'
  }, 500)
}
window.addEventListener('DOMContentLoaded', event => {
  handlerMainLoader(true)
})
form.addEventListener('submit', handleSubmit)
sendButton.addEventListener('click', handleSubmit)
authButton.addEventListener('click', getToken)
