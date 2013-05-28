/*****************************************************************************/
// Initialize a websocket connection to server
var websocket;
var outputxml;

var sampleString = "'1','10.20.215.17','130.231.241.29' '2','10.20.215.17','239.255.255.250' '3','10.20.215.17','224.0.0.251'";
var patt= new RegExp(sampleString);

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

  command = "tshark -n -T fields -E separator=, -e frame.number -e ip.src -e ip.dst -c 1 -i en1 src host 10.20.215.17";
  websocket.send(command);

  outputCommand.innerHTML += "<p class='text-info'>Command sent: " + command + "</p>";

}

function receiveOutput(evt){
    //called on receival of message

    // Table creation

    var table = document.getElementById("outputTable");
    var body = document.createElement('tbody');

    outputxml = evt.data;
    outputxml.toString();
    
    // First let's split the data for per packets
    var packet = outputxml.split(/\n/)

      // Print packets line by line
      for (var i=0;i<packet.length-1;i++) {
        var pDetails = packet[i].split(",") // Split every packet separately

        // pDetails[0] == Frame number
        // pDetails[1] == Source ip
        // pDetails[2] == Destination ip

        // Create row for the table
        var row = document.createElement("tr");

          // Create cell for packet number
          var numberCell = document.createElement("th");
          var numberCelltext = document.createTextNode(pDetails[0]);
          numberCell.appendChild(numberCelltext);

          // Create cell for the source ip
          var sourceCell = document.createElement("th");
          var sourceCelltext = document.createTextNode(pDetails[1]);
          sourceCell.appendChild(sourceCelltext);

          // Create sell for the destination ip
          var destinationCell = document.createElement("th");
          var destinationCelltext = document.createTextNode(pDetails[2]);
          destinationCell.appendChild(destinationCelltext);

          // Cell for location (unfinished)
          var locationCell = document.createElement("th");
          var geoplugin = "http://www.geoplugin.net/json.gp?ip=";
          window.alert(geoplugin);

          var track = geoplugin + pDetails[2];
          window.alert(track);

          var script = document.createElement('script');
          script.type= ' text/javascript';
          script.src = track;
          document.getElementsByTagName("body")[0].appendChild(script);
          window.alert(script);

          // Tässä vaiheessa on oikea toteutus ja tuloksena on JSON
          // Miten tilaat jsonista oikean tiedon?
          // Onko kysely suoritetty?

          

          var locationCelltext = document.createTextNode(track);
          locationCell.appendChild(locationCelltext);


        row.appendChild(numberCell);
        row.appendChild(sourceCell);
        row.appendChild(destinationCell);
        row.appendChild(locationCell);

        body.appendChild(row);

      }

    table.appendChild(body);

} // end onMessage











