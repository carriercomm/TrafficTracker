/*****************************************************************************/
// Initialize a websocket connection to server

var websocket;

function connect() {
  //open socket
  if ("WebSocket" in window){
    websocket = new WebSocket("ws://127.0.0.1:8080/", "echo-protocol");
  
    //attach event handlers
    websocket.onopen = onOpen;
    websocket.onclose = onClose;

    websocket.onmessage = receiveOutput;
    websocket.onerror = onError;
    } 
    else {
      alert("WebSockets not supported on your browser.");
    } // end if
} // end connect



/*****************************************************************************/
// Server status


var serverStatus; // Variable for server status (Connected/Disconnected/Error)

function init(){
  serverStatus = document.getElementById("serverStatus");
  serverStatus.innerHTML = "<p class='text-info'>NOT CONNECTED</p>";
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



/*****************************************************************************/
// Send server a command a receive output

var outputCommand; // Variable for command sent to server

function sendCommand() {

  outputCommand = document.getElementById("outputCommand");

  command = "tshark -n -T fields -E separator=, -E quote=d -e frame.number -e ip.src -e ip.dst -c 3 -i en1 src net 10.20.210.225";
  //command = "ping -c 6 google.fi";
  //command = "tshark -n -T psml -c 3 -i en1 src net 10.20.210.225"; // XML
  websocket.send(command);

  outputCommand.innerHTML += "<p class='text-info'>Command sent: " + command + "</p>";

}

function receiveOutput(evt){
    //called on receival of message
    outputCommand.innerHTML += "<p class = 'text-success'>" + evt.data + "</p>";

    outputxml = evt.data;

    //outputxml.toString();

    JSON.stringify(outputxml);

  

    outputCommand.innerHTML += "<p class = 'text-error'>" + outputxml + "</p>";



    var splitted = outputxml.split("\n");
    //var trimmed = str.replace(/^\s+|\s+$/g, '') ;
    //var sliced = splitted.slice(1,splitted.length)


    outputCommand.innerHTML += "<p class = 'text-info'>Splitted: " + splitted + "</p>";
    //outputCommand.innerHTML += "<p class = 'text-info'>Sliced: " + sliced + "</p>";


} // end onMessage















