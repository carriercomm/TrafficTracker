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
  ipAddress = " src host 10.20.214.53"
  command = commandBase + temp1 + ipAddress;
  websocket.send(command);
  createRows();
}

// Table elements
var table = document.getElementById('outputTable');
var body = document.createElement('tbody')


var frameCell         // Frame number
var sourceCell        // Source IP
var destinationCell   // Destination IP

function createRows() {

  for(var r=0; r<50; r++) {

  var row = body.insertRow(r);

    frameCell = row.insertCell(0)
    frameCell.setAttribute("id", "frameCell" + r )
    frameCell.innerHTML = "null"

    sourceCell = row.insertCell(1)
    sourceCell.setAttribute("id", "sourceCell" + r )
    sourceCell.innerHTML = "null"

    destinationCell = row.insertCell(2)
    destinationCell.setAttribute("id", "destinationCell" + r)
    destinationCell.innerHTML = "null"

    locationCell = row.insertCell(3)
    locationCell.setAttribute("id", "locationCell" + r)
    locationCell.innerHTML = "null"

    body.appendChild(row)
  }

  table.appendChild(body)

}

function receiveOutput(evt){

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

        // var keijo = pDetails[2].indexOf("130.231.241.29")

        //   if (keijo == '-1') {
        //     console.log("Keijo ei löytänyt samaa IP-osoitetta")
        //   } else
        //     console.log("Keijo löysi saman IP-osoitteen : " + keijo )        

        var frame = "frameCell" + i    
        var frameCell = document.getElementById(frame).innerHTML = pDetails[0]

        var source = "sourceCell" + i
        var frameCell = document.getElementById(source).innerHTML = pDetails[1]

        var destination = "destinationCell" + i
        var destinationCell = document.getElementById(destination).innerHTML = pDetails[2]
        
    }

    // Attach row to body
    //body.appendChild(newRow)
    //table.appendChild(body) 

    console.log("Values fetched, getting cell values")

    GetCellValues()




} // end onMessage

var locationTable = document.getElementById("locTable")
var locationBody = document.createElement("tbody")
var kalle;  // Variable for loop counter in callback-function
kalle = 0;  

function GetCellValues() {

    var freegeoip = "http://freegeoip.net/json/";
    //var newRow = document.createElement("tr");

    for (var r = 1, n = table.rows.length; r < n;r++) {

        for (var c = 2, m = 3; c < m; c++) {

            var value = table.rows[r].cells[c].innerHTML
            var url = freegeoip + table.rows[r].cells[c].innerHTML;

            // http://robertodecurnex.github.io/J50Npi/
            var data = {};
              callback = function(geodata){

                  kalle++
                  console.log("Muuttuja Kalle : " + kalle)


                    var location = "locationCell" + kalle
                    var locationCell = document.getElementById(location).innerHTML = geodata.country_name


              }
           J50Npi.getJSON(url, data, callback);
        }
  }
  //locationBody.appendChild(newRow)
  //locationTable.appendChild(locationBody)
console.log("Location values done, calling for GMaps")
}


