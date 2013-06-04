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
var packetAmount = 20;

function sendCommand() {

  outputCommand = document.getElementById("outputCommand");
  
  commandBase = "tshark -i en1 -n -T fields -E separator=, -e frame.number -e ip.src -e ip.dst ";

  //var packetAmount = document.getElementById("amountOfPackets").value
  var temp1 = "-c " + packetAmount; // Temp value, because we need this variable to create tabl
  //ipAddress = " src host " + document.getElementById("ipInput").value
  ipAddress = " src host 10.20.214.53"
  command = commandBase + temp1 + ipAddress;
  websocket.send(command);
  createRows();
}



/*****************************************************************************/
// Table elements
var table = document.getElementById('outputTable');
var body = document.createElement('tbody')


var frameCell         // Frame number
var sourceCell        // Source IP
var destinationCell   // Destination IP

function createRows() {

  for(var r=0; r<=packetAmount; r++) {

  var row = body.insertRow(r);

    frameCell = row.insertCell(0)
    frameCell.setAttribute("id", "frameCell" + r )
    frameCell.innerHTML = r

    sourceCell = row.insertCell(1)
    sourceCell.setAttribute("id", "sourceCell" + r )
    sourceCell.innerHTML = "null"

    destinationCell = row.insertCell(2)
    destinationCell.setAttribute("id", "destinationCell" + r )
    destinationCell.innerHTML = "null"

    locationCell = row.insertCell(3)
    locationCell.setAttribute("id", "locationCell" + r )
    locationCell.innerHTML = "null"

    latitudeCell = row.insertCell(4)
    latitudeCell.setAttribute("id", "latitudeCell" + r )
    latitudeCell.innerHTML = "null"

    longitudeCell = row.insertCell(5)
    longitudeCell.setAttribute("id", "longitudeCell" + r )
    longitudeCell.innerHTML = "null"

    body.appendChild(row)
  }

  table.appendChild(body)

}





/*****************************************************************************/

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

    console.log("Values fetched, getting cell values")

    GetCellValues()




} // end onMessage





/*****************************************************************************/

var justStupidCounter;  // Variable for loop counter in callback-function
justStupidCounter = 0;  

function GetCellValues() {

    var freegeoip = "http://freegeoip.net/json/";

    //for (var r = 1, n = table.rows.length; r < n;r++) {

        //for (var c = 2, m = 3; c < m; c++) {

          for (var i=0; i<=packetAmount; i++) {

            var paamaara = "destinationCell" + i
            var value = document.getElementById(paamaara).innerHTML
            console.log("Value : " + value)
            console.log(" i: " + i)
            var url = freegeoip + value
            // console.log("Funktion ulkopuolella justStupidCounter: " + justStupidCounter)

            // http://robertodecurnex.github.io/J50Npi/
            var data = {};
              callback = function(geodata){

                  // console.log("Funktion sisällä i :" + i )
                  // console.log("Funktion sisällä justStupidCounter: " + justStupidCounter)

                  var lokaatio = "destinationCell" + justStupidCounter
                  

                  var location = "locationCell" + justStupidCounter
                  var locationCell = document.getElementById(location).innerHTML = geodata.ip + " : " + geodata.city + ", " + geodata.country_name

                  var latitude = "latitudeCell" + justStupidCounter
                  var latitudeCell = document.getElementById(latitude).innerHTML = "Laskuri : " + justStupidCounter

                  var longitude = "longitudeCell" + justStupidCounter
                  var longitudeCell = document.getElementById(longitude).innerHTML = geodata.longitude

                  justStupidCounter++

              }
           J50Npi.getJSON(url, data, callback);
    }
          console.log("Location values done, calling for GMaps")
}


