const socket = io()

window.addEventListener('load', () => {
  setupEventListeners()
})

function setupEventListeners() {
  // Join on submit
  const joinChat = document.querySelector('form.join')
  joinChat.addEventListener('submit', onJoinRoom)

  // Send message on submit
  const messageChat = document.querySelector('.chat form')
  messageChat.addEventListener('submit', onSendMessage)

  // Leave chat on submit
  const leaveChat = document.querySelector('.chatleave')
  leaveChat.addEventListener('submit', onLeaveRoom)

  // Socket io events
  socket.on('join success', joinChatRoom)
  socket.on('new_message', onReceivedMessage)
  socket.on('disconnect', leaveChatRoom)
  socket.on('rooms', onGetRooms)
}

function onJoinRoom(event) {
  event.preventDefault()
  const [nameInput, roomInput, passwordInput] = document.querySelectorAll(
    '.join input'
  )

  const name = nameInput.value
  const room = roomInput.value
  const password = passwordInput.value

  socket.emit('join room', { name, room, password })
}

function onLeaveRoom(event) {
  event.preventDefault()
  socket.emit('disconnect')
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
  document.querySelector('.join').classList.add('hidden')
  document.querySelector('.chat').classList.remove('hidden')
}

function leaveChatRoom(data) {
  console.log(data)
  document.querySelector('.chat').classList.add('hidden')
  document.querySelector('.join').classList.remove('hidden')
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
