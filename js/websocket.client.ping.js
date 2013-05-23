var outputLocal;
var websocket;

  function init(){
    outputLocal = document.getElementById("outputLocal");
    connect();
  } // end init

  function connect(){
    //open socket
    if ("WebSocket" in window){
      websocket = new WebSocket("ws://127.0.0.1:8080/", "echo-protocol");
      //note this server does nothing but echo what was passed
      //use a more elaborate server for more interesting behavior
  
      outputLocal.innerHTML = "connecting..." ;
  
      //attach event handlers
      websocket.onopen = onOpen;
      websocket.onclose = onClose;
      websocket.onmessage = onMessage;
      websocket.onerror = onError;
    } else {
      alert("WebSockets not supported on your browser.");
    } // end if
  } // end connect

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
  } // end sendMessage