let socket = new WebSocket('ws://localhost:8080');
const NAME = prompt('What is your name?', 'user');
const MSG_AREA = document.getElementById('messages');
const INPUT = document.getElementById('msg');
const SEND = document.getElementById('send');
const MSG_TYPES = {
  MESSAGE: 'message',
  JOIN: 'join'
};

socket.onopen = function () {
  console.log(`[open] ${NAME} joined the chat!`);

  const type = MSG_TYPES.JOIN;
  socket.send(
    JSON.stringify({
      senderName: NAME,
      type
    })
  );
};

socket.onmessage = function (event) {
  const { senderName, message, time, type } = JSON.parse(event.data);

  if (type === MSG_TYPES.MESSAGE) {
    const divMessage = document.createElement('div');
    divMessage.classList.add('messages__message');
    divMessage.classList.add('messages__others');
    const messageHead = document.createElement('h4');
    const messageBody = document.createElement('p');
    const messageTime = document.createElement('span');
    messageHead.classList.add('messages__message-head');
    messageBody.classList.add('messages__message-body');
    messageTime.classList.add('messages__message-time');
    messageHead.innerText = `${senderName} `;
    messageTime.innerText = time;
    messageHead.append(messageTime);
    messageBody.innerText = message;
    divMessage.append(messageHead, messageBody);
    MSG_AREA.append(divMessage);
  }
  if (type === MSG_TYPES.JOIN) {
    console.log(`[open] ${senderName} joined the chat!`);
  }
};

socket.onclose = function (event) {
  if (event.wasClean) {
    console.log(`[close] ${NAME} left the chat`);
  } else {
    console.log(`[close] ${NAME} crashed off the chat !!`);
  }
};

socket.onerror = function (error) {
  console.log(`[error] ${error.message}`);
};

const handleSend = function () {
  const message = INPUT.value;
  const date = new Date();
  const time = date.toLocaleTimeString('en-US');
  const type = MSG_TYPES.MESSAGE;
  INPUT.value = '';
  INPUT.focus();

  const divMessage = document.createElement('div');
  divMessage.classList.add('messages__message');
  divMessage.classList.add('messages__yours');
  const messageHead = document.createElement('h4');
  const messageBody = document.createElement('p');
  const messageTime = document.createElement('span');
  messageHead.classList.add('messages__message-head');
  messageBody.classList.add('messages__message-body');
  messageTime.classList.add('messages__message-time');
  messageHead.innerText = `${NAME} `;
  messageTime.innerText = time;
  messageHead.append(messageTime);
  messageBody.innerText = message;
  divMessage.append(messageHead, messageBody);
  MSG_AREA.append(divMessage);

  socket.send(
    JSON.stringify({
      senderName: NAME,
      message,
      time,
      type
    })
  );
};

window.onload = function () {
  SEND.addEventListener('click', handleSend);
};
