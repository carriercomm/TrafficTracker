/*****************************************************************************/

var websocket;


/*****************************************************************************/


function connect() {
  //open socket
  if ("WebSocket" in window){
    websocket = new WebSocket("ws://127.0.0.1:8080/", "echo-protocol");
    serverStatus.innerHTML = "Websocket.js : connecting..." ;
  
    //attach event handlers
    websocket.onopen = onOpen;
    websocket.onclose = onClose;

    websocket.onmessage = onMessage;
    websocket.onerror = onError;
    } 
    else {
      alert("WebSockets not supported on your browser.");
    } // end if
} // end connect



/*****************************************************************************/



var serverStatus; // Variable for server status (Connected/Disconnected/Error)

function init(){
  serverStatus = document.getElementById("serverStatus");
  connect();
} // end init

function onOpen(evt){
  //called as soon as a connection is opened
  serverStatus.innerHTML = "<p class='text-success'>CONNECTED TO SERVER</p>";
} // end onOpen

function onClose(evt){
  //called when connection is severed
  serverStatus.innerHTML = "<p class = 'text-error'>DISCONNECTED</p>";
} // end onClose;

function onError(evt){
  //called on error
  serverStatus.innerHTML += "<p class='error'>ERROR: " + evt.data + "</p>";
} // end onError




/***********************SEND SYSTEM CALL TO NODE.JS**********************************************/


var outputCommand;

function sendCommand() {

  outputCommand = document.getElementById("outputCommand");

  command = "uptime";
  websocket.send(command);

  outputCommand.innerHTML += "<p class='text-info'>Command sent: " + command + "</p>";


  var pre = document.createElement("p");
  pre.style.wordWrap = "break-word"; 
  pre.innerHTML = command; output.appendChild(pre);

  outputCommand.innerHTML += "<p class='text-success'>RESPONSE: " + evt.data+ "</p>"; 
  websocket.close(); 

}
/*
function sendMessage(){
  //get message from text field
  //txtMessage = document.getElementById("txtMessage");
  //message = txtMessage.value
  message = "Test message";
  websocket.send(message);
  serverStatus.innerHTML += "<p>MESSAGE SENT: " + message + "</p>";
  sendCommand();
  lineSpace();
} // end sendMessage */