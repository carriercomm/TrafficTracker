var outputLocal;

function init(){
  outputLocal = document.getElementById("outputLocal");
  
  // Connect to the WebSocket using connect()-function (js/websocket.js)
  connect();
} // end init

function onOpen(evt){
  //called as soon as a connection is opened
  outputLocal.innerHTML = "<p>CONNECTED TO SERVER</p>";

  // Send message with static value
  sendMessage();
} // end onOpen

function onClose(evt){
  //called when connection is severed
  outputLocal.innerHTML += "<p>DISCONNECTED</p>";
} // end onClose;

function onMessage(evt){
  //called on receipt of message
  outputLocal.innerHTML += "<p class = 'response'>RESPONSE: " + evt.data + "</p>";
} // end onMessage

function onError(evt){
  //called on error
  outputLocal.innerHTML += "<p class = 'error'>ERROR: " + evt.data + "</p>";
} // end onError

function sendMessage(){
  //get message from text field
  //txtMessage = document.getElementById("txtMessage");
  //message = txtMessage.value
  message = "Test message";
  websocket.send(message);
  outputLocal.innerHTML += "<p>MESSAGE SENT: " + message + "</p>";
  sendCommand();
  lineSpace();
} // end sendMessage


