/*****************************************************************************/
// Initialize a websocket connection to server

var websocket;
var outputxml;

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
  //serverStatus = document.getElementById("serverStatus");
  //serverStatus.innerHTML = "<p class='text-info'>NOT CONNECTED</p>";
} // end init

function onOpen(evt){
  //called as soon as a connection is opened
  sendCommand()
} // end onOpen

function onClose(evt){
  //called when connection is severed
  //serverStatus.innerHTML = "<p class = 'text-error'>DISCONNECTED</p>";
} // end onClose;

function onError(evt){
  window.alert("Error establishing WebSocket-connection to server" + evt.data)
} // end onError



/*****************************************************************************/
// Sending server a command

var outputCommand; // Variable for command sent to server
//var packetAmount = document.getElementById("amountOfPackets").value
//var packetAmount = 20;

function sendCommand() {

  outputCommand = document.getElementById("outputCommand");
  
  commandBase = "tshark -i en1 -n -T fields -E separator=, -e frame.number -e ip.src -e ip.dst ";

  var packetAmount = document.getElementById("amountOfPackets").value
  var temp1 = "-c 50"// + packetAmount; // Temp value, because we need this variable to create tabl
  //ipAddress = " src host " + document.getElementById("ipInput").value
  ipAddress = " src host 10.20.216.77"
  command = commandBase + temp1 + ipAddress;
  websocket.send(command);
}

var table = document.getElementById('outputTable');
var body = document.createElement('tbody')
//var row = document.createElement("tr");

function receiveOutput(evt){

    outputxml = evt.data;
    outputxml.toString();

    //var row = document.createElement("tr");
    
    // First let's split the data for per packets
    var packet = outputxml.split(/\n/)
  

      // Print packets line by line
      for (var i=0;i<packet.length-1;i++) {

        var pDetails = packet[i].split(",") // Split every packet separately

        // pDetails[0] == Frame number
        // pDetails[1] == Source ip
        // pDetails[2] == Destination ip

        // Create row for the table

        var newRow = body.insertRow(i);

        // Frame number
        var newCell0 = newRow.insertCell(0)      
        newCell0.innerHTML = pDetails[0];

        // Source ip
        var newCell1 = newRow.insertCell(1)
        newCell1.innerHTML = pDetails[1]

        // Destination ip
        var newCell2 = newRow.insertCell(2)
        newCell2.innerHTML = pDetails[2]

        
    }

    // Attach row to body
    body.appendChild(newRow)
    table.appendChild(body) 

    console.log("Values fetched, getting cell values")

    GetCellValues()




} // end onMessage

var locationTable = document.getElementById("locTable")
var locationBody = document.createElement("tbody")

function GetCellValues() {

    var freegeoip = "http://freegeoip.net/json/";
    var newRow = document.createElement("tr");

    for (var r = 1, n = table.rows.length; r < n;r++) {

        for (var c = 2, m = 3; c < m; c++) {

            var value = table.rows[r].cells[c].innerHTML
            var url = freegeoip + table.rows[r].cells[c].innerHTML;

            // http://robertodecurnex.github.io/J50Npi/
            var data = {};
              callback = function(geodata){
                    var newRow = locationBody.insertRow(-1);
                    
                    var destinationCell = newRow.insertCell(0)
                    var locationCell = newRow.insertCell(1)
                    var latitudeCell = newRow.insertCell(2)
                    var longitudeCell = newRow.insertCell(3)

                    destinationCell.innerHTML = geodata.ip                    
                    locationCell.innerHTML = geodata.city + ", " + geodata.country_name
                    latitudeCell.innerHTML = geodata.latitude
                    longitudeCell.innerHTML = geodata.longitude

              }
           J50Npi.getJSON(url, data, callback);
        }
  }
  locationBody.appendChild(newRow)
  locationTable.appendChild(locationBody)
console.log("Location values done, calling for GMaps")
}


