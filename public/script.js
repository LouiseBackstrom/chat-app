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

  // Send message on submit
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
}

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

function onJoinRoom(event) {
  event.preventDefault()
  const [nameInput] = document.querySelectorAll('.join-lobby input')
  const [roomInput,passwordInput] = document.querySelectorAll('.join input')
  const room = roomInput.value
  const name = nameInput.value
  const password = passwordInput.value

  socket.emit('join room', { name, room, password })
}

function onLeaveRoom(event) {
  event.preventDefault()
  location.reload()
}

function onSendMessage(event) {
  event.preventDefault()
  const input = document.querySelector('.chat form input')
  socket.emit('new_message', input.value)
  input.value = ''
}

function onReceivedMessage({ name, message }) {
  const ul = document.querySelector('.chat ul')
  const li = document.createElement('li')
  li.innerText = `${name}: ${message}`
  ul.append(li)
}

function joinChatRoom(data) {
  console.log(data)
  document.querySelector('.join-room').classList.add('hidden')
  document.querySelector('.chat').classList.remove('hidden')
}

function onGetRooms(rooms) {
  console.log(rooms)
  const ul = document.querySelector('aside ul')
  const liElements = rooms.map((room) => {
    const li = document.createElement('li')
    li.innerText = room
    return li
  })
  ul.innerText = ''
  ul.append(...liElements)
}

/*//buttons and inputs
var message = $("#message")
var name = $("#name")
var send_message = $("#send_message")
var chatroom = $("#chatroom")
var feedback = $("#feedback")

	//Emit message
	send_message.click(function(){
		socket.emit('new_message', {message : message.val()})
	})

	//Listen on new_message
	socket.on("new_message", (data) => {
		feedback.html('');
		message.val('');
		chatroom.append("<p class='message'>" + data.name + ": " + data.message + "</p>")
	})

	//Emit typing
	message.bind("keypress", () => {
		socket.emit('typing')
	})

	//Listen on typing
	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.name + " is typing a message..." + "</i></p>")
	})*/
function usePassword() {
  let checkBox = document.querySelector('#checkbox')
  let input = document.querySelector('#password')
  if (checkBox.checked == true) {
    input.classList.remove('hidden')
  } else {
    input.classList.add('hidden')
  }
}
