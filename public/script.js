const socket = io()

window.addEventListener('load', () => {
  setupEventListeners()
})

function setupEventListeners() {
  // Join submit handler
  const joinForm = document.querySelector('form.join.ui')
  joinForm.addEventListener('submit', onJoinRoom)

  // Send message submit handler
  const messageForm = document.querySelector('.chat.ui form')
  messageForm.addEventListener('submit', onSendMessage)

  const leaveForm = document.querySelector('.chat.ui form')
  leaveForm.addEventListener('submit', onLeaveRoom)

  // Socket io events
  socket.on('join successful', loadChatUI)
  socket.on('new_message', onMessageReceived)
  socket.on('leave successful', leaveChatUI)
}

function onJoinRoom(event) {
  event.preventDefault()
  const [nameInput, roomInput] = document.querySelectorAll('.join.ui input')

  const name = nameInput.value
  const room = roomInput.value

  socket.emit('join room', { name, room })
  const h2 = document.querySelector('h2')
  const li = document.createElement('li')
  li.classList.add('room-text')
  li.innerText = `${room}`
  h2.appendChild(li)
}

function onLeaveRoom(event) {
   event.preventDefault()
  
}

function onSendMessage(event) {
  event.preventDefault()
  const input = document.querySelector('.chat.ui form input')
  socket.emit('new_message', input.value)
  input.value = ''
}

function loadChatUI(data) {
  console.log(data)
  document.querySelector('.join.ui').classList.add('hidden')
  document.querySelector('.chat.ui').classList.remove('hidden')
}

function leaveChatUI(data) {
  console.log(data)
  document.querySelector('.chat.ui').classList.add('hidden')
  document.querySelector('.join.ui').classList.remove('hidden')
}

function onMessageReceived({ name, message }) {
  const ul = document.querySelector('ul')
  const li = document.createElement('li')
  li.innerText = `${name}: ${message}`
  ul.append(li)
}

//buttons and inputs
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
	})
