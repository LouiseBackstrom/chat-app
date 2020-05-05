const socket = io()

window.addEventListener('load', () => {
  setupEventListeners()
})

function setupEventListeners() {
  // To Lobby on submit
  const joinLobby = document.querySelector('form.nic-name')
  joinLobby.addEventListener('submit', onJoinLobby)

  // Join room on submit
  const joinRoom = document.querySelector('form.join')
  joinRoom.addEventListener('submit', onJoinRoom)

  // Send messages on submit
  const messageChat = document.querySelector('.chat form')
  messageChat.addEventListener('submit', onSendMessage)

  // Leave chat on submit
  const leaveChat = document.querySelector('.chat-leave')
  leaveChat.addEventListener('submit', onLeaveRoom)

  // Socket io events
  socket.on('join success', joinChatRoom)
  socket.on('new_message', onReceivedMessage)
  socket.on('rooms', onGetRooms)
  socket.on('password', joinChatRoom)
  socket.on('wrong password', () => alert("Fel lösenord"))
}

// Enter nic and go to Lobby
function onJoinLobby(event) {
  event.preventDefault()
  const [nameInput] = document.querySelectorAll('.join-lobby input')
  const message = document.querySelector('.welcome-lobby')
  const name = nameInput.value
  const welcome = "Welcome to the Lobby "
  const h2 = document.createElement('h2')
  
  document.querySelector('.join-lobby').classList.add('hidden')
  document.querySelector('.aside').classList.remove('hidden')
  document.querySelector('.join-room').classList.remove('hidden')

  h2.innerText = `${welcome} ${name}!`
  message.appendChild(h2)
 
  socket.emit('rooms', { name })
}

// Create room
function onJoinRoom(event) {
  event.preventDefault()
  const [nameInput] = document.querySelectorAll('.join-lobby input')
  const [roomInput] = document.querySelectorAll('.join input')
  const [passwordInput] = document.querySelectorAll('.password')
  const room = roomInput.value
  const name = nameInput.value
  const password = passwordInput.value

  socket.emit('join room', { name, room, password })
}

// Leave Chat
function onLeaveRoom(event) {
  event.preventDefault()
  location.reload()
  socket.emit('leave room')
}

// Send messages in the room
function onSendMessage(event) {
  event.preventDefault()
  const input = document.querySelector('.chat form input')
  socket.emit('new_message', input.value)
  input.value = ''
}

// Receive messages un the room
function onReceivedMessage({ name, message }) {
  const ul = document.querySelector('.chat ul')
  const li = document.createElement('li')
  li.innerText = `${name}: ${message}`
  ul.append(li)
}

// Remove hidden from chatroom
function joinChatRoom(data) {
  console.log(data)
  document.querySelector('.join-room').classList.add('hidden')
  document.querySelector('.chat').classList.remove('hidden')
}

// Get all rooms
function onGetRooms(rooms) {
  //console.log(rooms)
  const ul = document.querySelector('aside ul')
  const liElements = rooms.map((room) => {
    const li = document.createElement('li')
    li.innerText = room
    return li
  })
  ul.innerText = ''
  ul.append(...liElements)
}

// Password
function usePassword() {
  let checkBox = document.querySelector('#checkbox')
  let input = document.querySelector('#password')
  if (checkBox.checked == true) {
    input.classList.remove('hidden')
  } else {
    input.classList.add('hidden')
  }
}
