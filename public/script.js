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
const modelButton = document.querySelector('#read_more')
let lastScroll = 0
const loading_1 = document.getElementById('__db_loader')

GET_loader(loading_1, false)
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
    <div data-id="${id}" class="init-question-response shadow-lg p-2 mb-1 bg-transparent rounded">
      <p class="init-question" style="position:relative;">
      <img src="./images/face_1.png" style="width:40px;height:40px;position:absolute;bottom:0;right:0;border-radius:50%;padding:.2rem; border:2px solid transparent" alt="">
        ${QB}<br>
        <span class="link fs-6" style="opacity:0">${id}</span>
      </p>
      <p class="init-response text-white">
      <img src="./images/bot.webp" style="width:40px;height:40px;position:absolute;bottom:0;right:0;border-radius:50%;padding:.2rem; border:2px solid transparent;" alt="">
        ${RESPONSE}<br>
        <span class="link" style="opacity:.5">${id}</span>
      </p>
    </div>  `
}
function DB_QN_RES_HTML (question, response, id, created_at, addClass = false) {
  const div = document.createElement('div')
  div.dataset.id = id
  div.classList.add(
    'db-question-response',
    'shadow-lg',
    'p-2',
    'mb-1',
    'bg-transparent',
    'rounded'
  )
  const questionParagraph = document.createElement('p')
  questionParagraph.classList.add('db-question', 'qustion')
  questionParagraph.dataset.id = id
  questionParagraph.innerHTML = `${question}<br>
    <span class="link fs-6" style="opacity:0">${id}</span>
    <span class="link float-end fs-6" style="opacity:.5">${created_at}</span>`
  div.appendChild(questionParagraph)

  const responseParagraph = document.createElement('p')
  responseParagraph.classList.add('db-response', 'response')
  responseParagraph.dataset.id = id
  responseParagraph.innerHTML = `${response}<br>
    <span class="link" style="opacity:0;" data-id="${id}">${id}</span>
    <span class="link float-end" style="opacity:.5">${created_at}</span>`
  div.appendChild(responseParagraph)

  if (addClass) {
    div.classList.add('rsearched_item')
  }

  return div.outerHTML
}
function dbItem (item_id, quetion, response, createdAt, updatedAt) {
  return `
    <div id="single_item" data-id="${item_id}"  class="card bg-transparent">
        <div class="card-header d-flex  justify-content-between">
            <p data-itemid="timestamp" class="link-success">${item_id}</p>
            <a id="del_BTN" href="#" class="btn btn-danger">DELETE ITEM</a>
            <span class="DB_Carocel_loader"></span>
        </div>
        <div class="card-body">
          <p id="qn-item" data-qn="db-qn" class="card-text">Question: ${quetion}</p>
          <p id="ans-item" data-res="db-res" class="card-text pb-2">Response: ${response}</p>
        </div>
        <div class="d-flex justify-content-between card-footer fixed-bottom" style="z-index:10;backdrop-filter:blur(20px);">
          <p data-time="db-createdAt" class="created-tm">Created: ${createdAt}</p>
          <p data-time="db-modifiedAt" class="floadt-end updated-tm">Updated: ${updatedAt}</p>
        </div>
        <div data-buttons="carocel-btn-container" class="container-fluid d-flex  justify-content-between align-items-center single-carocel-btn" style="position:fixed;bottom:45%;left:50%;height:2rem;transform:translate(-50%, -50%);z-index:.01;">
          <a data-check="pre_v" id="prev-btn" style="z-index:1000;font-size:4rem;cursor:pointer;" class="text-white float-start prev">&#60;</a>
          <a data-check="nex_v" id="next-btn" style="z-index:1000;font-size:4rem;cursor:pointer;" class="text-white float-end next">&#62;</a>
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
      showNotification('Not found', 'Nothing found in database', '#nav_barrr')
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
        showNotification(
          'End of the road',
          `This is the last page: ${currentPage}`,
          '#nav_barrr'
        )
      }
    })
    // Add click event listener to "previous" button
    previousButton.addEventListener('click', async () => {
      let element = document.querySelector('#nav_barrr')
      currentPage -= 1
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
      const endIndex = startIndex + ITEMS_PER_PAGE
      const dataToDisplay = responseData.slice(startIndex, endIndex)
      // Update UI with data for current page
      displayData(dataToDisplay)
      // Update pagination buttons based on current page and total number of items
      updatePaginationButtons()
      if (element) return Empty_Element('#nav_barrr')
    })
    // Update pagination buttons based on current page and total number of items
    function updatePaginationButtons () {
      const maxPage = Math.ceil(totalItems / ITEMS_PER_PAGE)
      previousButton.classList.toggle('disabled', currentPage === 1)
      nextButton.classList.toggle('disabled', currentPage === maxPage)
      previousButton.classList.toggle(
        'disabled',
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
            'bg-transparent',
            'text-white',
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
      // run oberser
      runObserver('.db-question-response')
    }
    // Hide "previous" button on initial page
    previousButton.classList.add('disabled')
    // Show/hide pagination buttons based on total number of items
    if (totalItems <= ITEMS_PER_PAGE) {
      nextButton.classList.add('disabled')
    } else {
      nextButton.classList.remove('disabled')
    }
    // Update pagination buttons based on initial state
    updatePaginationButtons()
  } catch (e) {
    if ((e.name = 'AxiosError')) {
      localStorage.removeItem('question')
      localStorage.removeItem('response')
      leftContainer.innerHTML = ''
      showNotification('Database empty!', 'Lets save some stuff!', '#nav_barrr')
      return
    }
  }
}
fetchDataAndPaginate(previousButton, nextButton)

const handleSubmit = async e => {
  try {
    e.preventDefault()
    let question_text = textArea.value
    if (!question_text)
      return showNotification(
        'Oops missing input!',
        `You forgot to type your question.`,
        '#nav_barrr'
      )

    sendButton.innerText = 'Processing...'
    await postFetch(question_text)
    sendButton.innerText = 'submit question'
    form.reset()
  } catch (e) {
    console.log('An error occurred:', e.message)
    showNotification(
      'Error',
      `Something went wrong:\n ${e.message} `,
      '#nav_barrr'
    )
  }
}
async function postFetch (question) {
  if (!question || question == '')
    return showNotification(
      'Error!',
      `Payload can't be empty message.`,
      '#nav_barrr'
    )

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

    showNotification('Status:', data.status, '#nav_barrr')
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
      showNotification('Unauthorized!', 'You must authenticate!', '#nav_barrr')
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
      return showNotification(
        'Warning, nothing found!',
        'Please try again letter',
        '#nav_barrr'
      )
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
    runObserver('.db-question-response')
  } catch (e) {
    console.warn(e.message)
    showNotification('Error', `Something went wrong:\n ${e} `, '#nav_barrr')
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
    showNotification('Error', `Something went wrong:\n ${e} `, '#nav_barrr')
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
    showNotification(
      'Success',
      `Authenticated for the next ${24 - (new Date().getHours() % 24)} hrs`,
      '#nav_barrr'
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
    if (token)
      showNotification(
        'Authorised ✅',
        'Authentication Succesful',
        '#nav_barrr'
      )
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
    return showNotification(
      `Warning! Not authenticated.`,
      'You can click the button bellow on your right!',
      '#nav_barrr'
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
      return showNotification(
        'Error',
        'Something went wrong. Try again later.',
        '#nav_barrr'
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
              'next',
              'created-tm',
              'updated-tm'
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
            showNotification(
              'Error',
              `Something went wrong:\n ${e} `,
              '#nav_barrr'
            )
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
            showNotification(
              'Error',
              `Something went wrong:\n ${e.message} `,
              '#nav_barrr'
            )
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
                showNotification(`Item deleted!`, 'Success', '#nav_barrr')
                GET_loader(loading_1, true)
              } else {
                showNotification(
                  'Warning',
                  `Oops Operation failed!`,
                  '#nav_barrr'
                )
                document.body.insertAdjacentHTML('afterbegin', messageHTML)
              }
            } catch (e) {
              showNotification(
                'Error',
                `Something went wrong:\n ${e.message} `,
                '#nav_barrr'
              )
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
// Search database
async function searchDatabase (e) {
  e.preventDefault()
  let inputValue = searchInput.value.trim()

  if (!inputValue) {
    let itemFromDB = document
      .querySelector('.db-question-response')
      ?.classList.contains('rsearched_item')
    if (itemFromDB) FetchData('?page=1')
    showNotification('Error', 'Input required!', '#nav_barrr')
    return
  }

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
    return showNotification('Warning.', 'Nothing found!', '#nav_barrr')
  }

  let count = 0
  rightCont.innerHTML = ''

  responseData.forEach(item => {
    const { createdAt, question, response, _id } = item
    const questionMatch = question
      .toLowerCase()
      .includes(inputValue.toLowerCase())
    const responseMatch = response
      .toLowerCase()
      .includes(inputValue.toLowerCase())

    if (!inputValue || questionMatch || responseMatch) {
      // replace matching words with underlined words
      const underlinedQuestion = question.replace(
        new RegExp(inputValue, 'gi'),
        '<u>$&</u>'
      )
      const underlinedResponse = response.replace(
        new RegExp(inputValue, 'gi'),
        '<u>$&</u>'
      )

      rightCont.insertAdjacentHTML(
        'afterbegin',
        DB_QN_RES_HTML(
          underlinedQuestion,
          underlinedResponse,
          _id,
          formatDate(createdAt),
          true
        )
      )
      outRightContainer.scrollTo(0, 0)
      GET_loader(loading_1, true)
      count++
    }
    // run oberser
    runObserver('.db-question-response')
  })

  if (count <= 0) {
    showNotification(
      'Error',
      `I couldn't find what you were looking for!`,
      '#nav_barrr'
    )
  } else {
    showNotification('Success', `${count} found!`, '#nav_barrr')
  }
}
// logger
async function showNotification (title, body, anchorrr) {
  // remove previous notification element, if it exists
  const prevNotificationDiv = document.querySelector('#notifications')
  if (prevNotificationDiv) {
    prevNotificationDiv.remove()
  }
  const notificationsDiv = document.createElement('div')
  notificationsDiv.id = 'notifications'

  // Add different classes based on the title text
  if (
    title.includes('Success') ||
    title.includes('End of') ||
    title.includes('Authorised') ||
    title.includes('Item deleted')
  ) {
    notificationsDiv.classList.add('alert', 'alert-success')
  } else if (
    title.includes('Warning') ||
    title.includes('Not found') ||
    title.includes('Oops')
  ) {
    notificationsDiv.classList.add('alert', 'alert-warning')
  } else if (title.includes('Error') || title.includes('Unauthorized')) {
    notificationsDiv.classList.add('alert', 'alert-danger')
  } else if (title.includes('Database empty') || title.includes('Status')) {
    notificationsDiv.classList.add('alert', 'alert-info')
  } else {
    notificationsDiv.classList.add('alert', 'alert-secondary')
  }

  notificationsDiv.classList.add(
    'alert-dismissible',
    'fade',
    'show',
    'shadow-lg',
    'rounded',
    'pl-1'
  )
  notificationsDiv.style.cssText = 'width:fit-content;backdrop-filter:blur(3px)'
  const titleElement = document.createElement('h6')
  titleElement.classList.add('alert-heading')
  titleElement.classList.add('lead')
  titleElement.textContent = title
  titleElement.style.cssText = 'font-size: 18px;'

  const bodyElement = document.createElement('p')
  bodyElement.classList.add('alert-body')
  bodyElement.textContent = body
  bodyElement.style.cssText = 'font-size: 15px;'

  const buttonElement = document.createElement('button')
  buttonElement.type = 'button'
  buttonElement.style.cssText =
    'font-size:13px;color:red;width:20px;height:20px;border-radius:50%;padding:.3rem;'
  buttonElement.classList.add('btn-close', 'float-end')
  buttonElement.setAttribute('data-bs-dismiss', 'alert')
  buttonElement.setAttribute('aria-label', 'Close')

  notificationsDiv.append(
    titleElement,
    bodyElement,
    // timestampElement,
    buttonElement
  )
  const container = document.querySelector(`${anchorrr}`)
  container.appendChild(notificationsDiv)

  // remove notification element after 5 seconds
  setTimeout(() => {
    notificationsDiv.classList.remove('show')
    notificationsDiv.classList.add('fade', 'upwards')
    setTimeout(() => {
      notificationsDiv.remove()
    }, 1000) // wait for the animation to complete before removing the element
  }, 5000)

  return notificationsDiv
}
//typing handler with elemnet
async function typingEffect (element, message, typingSpeed = 4) {
  let ELEMENT = document.querySelector(`${element}`)
  ELEMENT.innerHTML = ''
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
searchBtn.addEventListener('click', function (event) {
  event.preventDefault()
  searchDatabase(event)
})
searchFORM.addEventListener('submit', function (event) {
  event.preventDefault()
  searchDatabase(event)
})
// bg for pagination buttons
outRightContainer.addEventListener('scroll', function () {
  let container_buttons = document.querySelectorAll('.pagina__nating')
  let currentScroll = this.scrollTop
  if (currentScroll > lastScroll) {
    container_buttons.forEach(btn => {
      btn.classList.toggle('change_btn_color', true)
    })
  } else {
    container_buttons.forEach(btn => {
      btn.classList.toggle('change_btn_color', false)
    })
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
    CarucelPrevButton.classList.add('disabled')
  }
  CarucelNextButton.addEventListener('click', async () => {
    if (currentItemIndex < responseData.length - 1) {
      currentItemIndex++
      await handleNextPrevUI(responseData[currentItemIndex])
      // Enable prev button when moving away from first item
      if (currentItemIndex === 1) {
        CarucelPrevButton.classList.remove('disabled')
      }
      // Hide next button when showing last item
      if (currentItemIndex === responseData.length - 1) {
        CarucelNextButton.classList.add('disabled')
      }
    }
  })
  CarucelPrevButton.addEventListener('click', async () => {
    if (currentItemIndex > 0) {
      currentItemIndex--
      await handleNextPrevUI(responseData[currentItemIndex])
      // Enable next button when moving away from last item
      if (currentItemIndex === responseData.length - 2) {
        CarucelNextButton.classList.remove('disabled')
      }
      // Hide prev button when showing first item
      if (currentItemIndex === 0) {
        CarucelPrevButton.classList.add('disabled')
      }
    }
  })
}
async function handleNextPrevUI (item) {
  const nextItemLoader = document.querySelector('.DB_Carocel_loader')
  if (!item || item == undefined) return
  nextItemLoader.style.display = 'block'
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
  setTimeout(() => (nextItemLoader.style.display = 'none'), 500)
}
// Documentation Model
function showModal () {
  const modal = document.createElement('div')
  modal.style.scrollBehavior = 'smooth'
  modal.classList.add('modal', 'fade', 'bg-transparent', 'text-white')
  modal.id = 'staticBackdrop'
  modal.setAttribute('data-bs-backdrop', 'static')
  modal.setAttribute('data-bs-keyboard', 'false')
  modal.setAttribute('tabindex', '-1')
  modal.setAttribute('aria-labelledby', 'staticBackdropLabel')
  modal.setAttribute('aria-hidden', 'true')

  const modalDialog = document.createElement('div')
  modalDialog.classList.add(
    'modal-dialog',
    'modal-dialog-scrollable',
    'bg-transparent'
  )
  const modalContent = document.createElement('div')
  modalContent.classList.add('modal-content', 'bg-transparent', 'dialog-styles')
  const modalHeader = document.createElement('div')
  modalHeader.classList.add('modal-header')
  const modalTitle = document.createElement('h5')
  modalTitle.classList.add('modal-title', 'text-center')
  modalTitle.id = 'staticBackdropLabel'
  modalTitle.innerText = 'HOW TO USE THIS APPLICATION'
  const closeButton = document.createElement('button')
  closeButton.classList.add('btn-close')
  closeButton.setAttribute('data-bs-dismiss', 'modal')
  closeButton.setAttribute('aria-label', 'Close')
  closeButton.style.cssText = 'background-color:white !important;'
  const modalBody = document.createElement('div')
  modalBody.classList.add('modal-body')
  modalBody.innerHTML = `<ul class="lead bg-transparent">
  <li>The wizard tracker API is a simple API interface that allows you to ask GPT-5 questions and get a response locally in your dev-environment. It is powered by Express.js and uses custom functions that define routes for an Express.js server.</li><br />
  <li>The API has several endpoints that can be accessed using different HTTP methods. The first endpoint is /api/auth which is a POST request used to generate a JSON web token (JWT) using the authorization header of the request. The second endpoint is /raybags/v1/wizard/ask-me which is a POST request that validates a JWT using the authorization header, calls the GPT_5 function with the question from the request body, saves the result to the GPT_RESPONSE model in MongoDB, and returns the response. The third endpoint is /raybags/v1/wizard/data which is a GET request used to retrieve paginated results from the GPT_RESPONSE model. This endpoint can also retrieve all the results or a single item based on its ID. The fourth endpoint is /raybags/v1/wizard/delete-item/:id which is a DELETE request used to delete a single item from the GPT_RESPONSE model</li> <br />
  <li>To use the API, you need to clone the repository and install the dependencies using npm install. After that, start the server using npm start and test the endpoints using a tool like Postman or curl.</li> <br />
  <li>The MY-WIZARD API is built with Express.js, Node.js, Jest, and Mongoose. It also comes with a Dockerfile, so you can easily build a Docker image and run the container.</li> <br />
  </ul>
  <h5>Step-by-step guide:</h5>
  <ol>
  <li><code>Clone the repository using git clone https://github.com/raybags-web-dev/my-wizard-chat-gpt.git</code></li>
  <li><code>Install the dependencies using npm install and 
  Start the server using npm start</code></li>
  <li><code>The server is now running on http://localhost:4200/</code></li>
  <li>To generate a JWT token, send a POST request to <code>http://localhost:4200/api/auth </code> with an Authorization header that contains your desired username and password in the format of username:password. The API will return a JWT token in the response body</li>
  <li>To ask a question to the GPT-5 model, send a POST request to <code>http://localhost:4200/raybags/v1/wizard/ask-me</code> with the JWT token in the Authorization header and the question in the request body as JSON. The API will return a response containing the answer generated by the GPT-5 model.</li>
  <li>To get paginated results from the historical data, send a GET request to <code>http://localhost:4200/raybags/v1/wizard/data?page=<page-number></code>. Replace <page-number> with the page number you want to retrieve.</li>
  <li>To get all the historical data, send a GET request to <code>http://localhost:4200/raybags/v1/wizard/data-all</code></li>
  <li>To get a specific item from the historical data, send a <code>GET</code> request to <code>http://localhost:4200/raybags/v1/wizard/item/<id></code>. Replace <id> with the ID of the item you want to retrieve.</li>
  <li>To delete a specific item from the historical data, send a DELETE request to <code>http://localhost:4200/raybags/v1/wizard/delete-item/<id></code>. Replace <code><id></code>with the ID of the item you want to delete.</li>
  <li>That's it! You can use a tool like Postman or cURL to test the API endpoints.</li>
  </ol>`
  const modalFooter = document.createElement('div')
  modalFooter.classList.add('modal-footer', 'bg-trasparent', 'text-white')
  const closeButton2 = document.createElement('button')
  closeButton2.classList.add(
    'btn',
    'btn-transparent',
    'text-white',
    'border',
    'border-secondary'
  )
  closeButton2.setAttribute('data-bs-dismiss', 'modal')
  closeButton2.style.cssText = 'opacity:.7'
  closeButton2.innerText = 'Understood'
  // add components to the modal
  modalHeader.appendChild(modalTitle)
  modalHeader.appendChild(closeButton)
  modalFooter.appendChild(closeButton2)
  modalContent.appendChild(modalHeader)
  modalContent.appendChild(modalBody)
  modalContent.appendChild(modalFooter)
  modalDialog.appendChild(modalContent)
  modal.appendChild(modalDialog)
  document.body.appendChild(modal)
}
showModal()
// visited
function checkVisited () {
  if (localStorage.getItem('visited') === null) {
    let main_containerrr = document.querySelector('#main-container')
    main_containerrr.style.display = 'none'

    const loginFormContainer = document.createElement('div')
    loginFormContainer.id = 'login_page'
    loginFormContainer.className = 'container'
    loginFormContainer.classList.add('bg-transparent', 'text-white')

    loginFormContainer.innerHTML = `
    <h4 class="text-center text-white" style="color:white !important; opacity:unset;">Login Required</h4>
    <form>
      <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Email address</label>
          <input type="email" class="form-control" id="exampleInputEmail1" autocomplete="off" aria-describedby="emailHelp" required>
          <div id="emailHelp" class="form-text text-muted text-white">We'll never share your email with anyone else.</div>
      </div>
      <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Password</label>
          <input type="password" class="form-control" autocomplete="off" id="exampleInputPassword1" required>
      </div>
      <div class="mb-3 form-check delete_me">
          <input type="checkbox" class="form-check-input" autocomplete="off" id="exampleCheck1">
          <label class="form-check-label text-muted" for="exampleCheck1">Purge my credentials after this session</label>
      </div>
      <div  class="d-grid gap-2">
          <button id="loginFORM" class="btn text-white visitor_login" type="submit" disabled>Login</button>
      </div>
    </form>`

    const emailInput = loginFormContainer.querySelector('#exampleInputEmail1')
    const passwordInput = loginFormContainer.querySelector(
      '#exampleInputPassword1'
    )
    const submitButton = loginFormContainer.querySelector('#loginFORM')

    const validateInputs = () => {
      if (emailInput.checkValidity() && passwordInput.checkValidity()) {
        submitButton.removeAttribute('disabled')
      } else {
        submitButton.setAttribute('disabled', true)
      }
    }

    emailInput.addEventListener('input', validateInputs)
    passwordInput.addEventListener('input', validateInputs)

    loginFormContainer.querySelector('form').addEventListener('submit', e => {
      e.preventDefault()
      const email = emailInput.value
      const password = passwordInput.value
      localStorage.setItem('userEmail', email)
      localStorage.setItem('userPassword', password)
      loginFormContainer.remove()
      handlerMainLoader(false)

      setTimeout(async () => {
        localStorage.setItem('visited', true)
        handlerMainLoader(true)
        showNotification('Success', `Login Successful`, '#nav_barrr')
        main_containerrr.style.display = 'block'
      }, 2500)

      setTimeout(async () => {
        document.getElementById('read_more').click()
      }, 8000)
    })
    document.body.appendChild(loginFormContainer)
  } else {
    console.log('Welcome back!')
  }
}
checkVisited()
// obserer
function animateItems (items) {
  // main container to be observed
  let main__container = document.querySelector('right-container')
  if (items.length == null || !items.length) return
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle('showItem', entry.isIntersecting)
        // if (entry.isIntersecting) observer.unobserve(entry.target)
      })
    },
    { root: main__container, threshold: 0.3, rootMargin: '-50px' }
  )
  items.forEach(item => {
    observer.observe(item)
  })
}
async function runObserver (anchor) {
  try {
    let items = document.querySelectorAll(`${anchor}`)
    await animateItems(items)
  } catch (e) {
    console.log(e.message)
  }
}
window.addEventListener('DOMContentLoaded', event => {
  handlerMainLoader(true)
})
form.addEventListener('submit', handleSubmit)
sendButton.addEventListener('click', handleSubmit)
authButton.addEventListener('click', getToken)
