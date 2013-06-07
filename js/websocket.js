
//---------------------------------------------------------------------------
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



//---------------------------------------------------------------------------
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



//---------------------------------------------------------------------------
// Sending server a command

var outputCommand; // Variable for command sent to server
//var packetAmount = document.getElementById("amountOfPackets").value


//Changeable values-------------------------------------------------------------


var packetAmount = 50
var ipAddress = '10.20.200.151'


// Changeable values end---------------------------------------------------




function sendCommand() {

  outputCommand = document.getElementById("outputCommand");
  
  commandBase = "tshark -l -i en1 -n -T fields -E separator=, -e frame.number -e ip.src -e ip.dst ";

  //var packetAmount = document.getElementById("amountOfPackets").value
  var temp1 = "-c " + packetAmount; // Temp value, because we need this variable to create tabl
  //ipAddress = " src host " + document.getElementById("ipInput").value
  var temp2 = " src host " + ipAddress  
  command = commandBase + temp1 + temp2
  websocket.send(command);
  //createRows();
}



//-------------------------------------------------------------



var table = document.getElementById('outputTable');
var body = document.createElement('tbody')




//-------------------------------------------------------------


var cityArray = []
var addressArray = []
var countryArray = []
var latitudeArray = []
var longitudeArray = []

var destinationArray = []
var duplicateCount = []
var justStupidCounter; 
justStupidCounter = 0; 


//-------------------------------------------------------------


function receiveOutput(evt){

  console.log("justStupidCounter : " + justStupidCounter)

    // evt.data is the data received from server
    outputxml = evt.data;
    outputxml.toString();
    
    // split data per packet
    var packet = outputxml.split(/\n/)
  
      // Print packets line by line
      for (var i=0;i<packet.length-1;i++) {

        var row = body.insertRow(i);

        var pDetails = packet[i].split(",") 



        // pDetails[0] == Frame number
        // pDetails[1] == Source ip
        // pDetails[2] == Destination ip  



        // Filter duplicates from the destination array
        if (destinationArray.indexOf(pDetails[2]) != "-1" ) {

          console.log("Burn the Duplicate! Counter : " + duplicateCount.length)
          duplicateCount.push(1)

        }  else

              // Cell for packet number
              frameCell = row.insertCell(0)
              frameCell.setAttribute("id", "frameCell" + justStupidCounter )
              frameCell.innerHTML = pDetails[0]

              // Cell for source IP
              sourceCell = row.insertCell(1)
              sourceCell.setAttribute("id", "sourceCell" + justStupidCounter )
              if ( pDetails[1] == "" ) {
                sourceCell.innerHTML ="null"
              } else 
              sourceCell.innerHTML = pDetails[1]

              // Cell for destination IP
              destinationCell = row.insertCell(2)
              destinationCell.setAttribute("id", "destinationCell" + justStupidCounter )
              if ( pDetails[2] == "") {
                destinationCell.innerHTML = "null"
              } else
              destinationCell.innerHTML = pDetails[2]

              destinationArray.push(pDetails[2])



              // Cells for location information

                // Cell for location
                locationCell = row.insertCell(3)
                locationCell.setAttribute("id", "locationCell" + justStupidCounter )
                locationCell.innerHTML = "F-f-f-fetching...."

                // Cell for latitude
                latitudeCell = row.insertCell(4)
                latitudeCell.setAttribute("id", "latitudeCell" + justStupidCounter )
                latitudeCell.innerHTML = "disabled"

                // Cell for longitude
                longitudeCell = row.insertCell(5)
                longitudeCell.setAttribute("id", "longitudeCell" + justStupidCounter )
                longitudeCell.innerHTML = "disabled"

              // END for location information



            body.appendChild(row)
            table.appendChild(body)



            // Fetch location information based on destination IP

              var freegeoip ="http://freegeoip.net/json/"
              var url = freegeoip + pDetails[2]

              // Credit for this function to Roberto Decurnex
              // http://robertodecurnex.github.io/J50Npi/
              var data = {};
              callback = function(geodata) {

                addressArray.push(geodata.ip)
                cityArray.push(geodata.city)
                countryArray.push(geodata.country_name)  
                latitudeArray.push(geodata.latitude)
                longitudeArray.push(geodata.longitude)
                
              }
              J50Npi.getJSON(url, data, callback);

              justStupidCounter++

            // END location fetching
        
    }

    locations()

} // end receiveOutput




//---------------------------------------------------------------------------

var successCount = []
var failureCount = []

function locations() {


  for (e=0;e<=addressArray.length-1; e++) {

    var temp1 = "locationCell" + e
    var temp2 = "latitudeCell" + e
    var temp3 = "longitudeCell" + e
    var temp4 = "destinationCell" + e 

    if (countryArray[e] == "Reserved") {
 
      var locationCell = document.getElementById(temp1).innerHTML = "<a href='http://en.wikipedia.org/wiki/Reserved_IP_addresses' target='_blank'>Reserved address</a>"

   
    } else {

        var locationCell = document.getElementById(temp1).innerHTML =  addressArray[e] + " | " + cityArray[e] + ", " + countryArray[e]
        var latitudeCell = document.getElementById(temp2).innerHTML = latitudeArray[e]
        var longitudeCell = document.getElementById(temp3).innerHTML = longitudeArray[e]

        var destIP = document.getElementById(temp4).innerHTML

  }

    if (destIP == addressArray[e]) {
      successCount.push(1)


    } else 
      failureCount.push(1)

  }
}

