
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
} // end init

function onOpen(evt){
  sendCommand()
} // end onOpen

function onClose(evt){

} // end onClose;

function onError(evt){
  window.alert("Error establishing WebSocket-connection to server" + evt.data)
} // end onError



//Changeable values-------------------------------------------------------------


var packetAmount = 100;
var ipAddress = '10.20.204.213'


// Changeable values end---------------------------------------------------




function sendCommand() {

  var outputCommand = document.getElementById("outputCommand");
  
  commandBase = "tshark -l -i en1 -n -T fields -E separator=, -e frame.number -e ip.src -e ip.dst ";

  var temp1 = "-c " + packetAmount; // Temp value, because we need this variable to create tabl
  var temp2 = "src host " + ipAddress
  command = commandBase + temp2

  websocket.send(command);
}

//-------------------------------------------------------------

var table = document.getElementById('outputTable');
var body = document.createElement('tbody');

var cityArray = []
var addressArray = []
var countryArray = []
var latitudeArray = []
var longitudeArray = []

var destinationArray = []
var duplicateCount = []
var justStupidCounter; 
justStupidCounter = 1; 

var ip = []
var occurrences = []

//-------------------------------------------------------------

var emptyPackets = []

function receiveOutput(evt) {

    document.getElementById('tableStatus').innerHTML = "<div class='alert alert-info'> <i class='icon-spinner icon-spin icon-large'></i> <strong>Heads up! </strong> This table is still being updated </div>";

    // evt.data is the data received from server
    outputxml = evt.data;
    outputxml.toString();

    
    // split data per packet
    var packet = outputxml.split(/\n/)
  
      // Print packets line by line
      for (var i=0;i<packet.length-1;i++) {

        var pDetails = packet[i].split(",") 


        // pDetails[0] == Frame number
        // pDetails[1] == Source ip
        // pDetails[2] == Destination ip

        if ( pDetails[0] >= 1000 ) {

          // Atleast for the development process the amount of packages have been limited to
          // 1000 packets. Just for the buffers sake

          closeSocket()
        }

          if ( pDetails[1] != "") {
            // Filter null packets

            if ( destinationArray.indexOf(pDetails[2]) != -1 ) {
              // Duplicate
              occurrences[ip.indexOf(pDetails[2])]++

           } else {

              ip.push(pDetails[2])
              occurrences.push(1)
            

              var row = body.insertRow(-1)

              frameCell = row.insertCell(0)
              sourceCell = row.insertCell(1)
              destinationCell = row.insertCell(2)
              locationCell = row.insertCell(3)
              latitudeCell = row.insertCell(4)
              longitudeCell = row.insertCell(5)


              //Cell for packet number
              frameCell.setAttribute("id", "frameCell" + justStupidCounter )
              frameCell.innerHTML = pDetails[0]

              // Cell for source IP
              sourceCell.setAttribute("id", "sourceCell" + justStupidCounter )
              sourceCell.innerHTML = pDetails[1]

              // Cell for destination IP
              destinationCell.setAttribute("id", "destinationCell" + justStupidCounter )
              destinationCell.innerHTML = pDetails[2]
              destinationArray.push(pDetails[2])

              // Cells for location information

                // Cell for location
                locationCell.setAttribute("id", "locationCell" + justStupidCounter )
                locationCell.innerHTML = "------------"
                

                // Cell for latitude
                latitudeCell.setAttribute("id", "latitudeCell" + justStupidCounter )
                latitudeCell.innerHTML = "------------"
                

                // Cell for longitude
                longitudeCell.setAttribute("id", "longitudeCell" + justStupidCounter )
                longitudeCell.innerHTML = "------------"
                
              // END for location information

              // Fetch location information based on destination IP

                 var freegeoip ="http://freegeoip.net/json/"
                 var url = freegeoip + pDetails[2]


                // Credit for this function to Roberto Decurnex
                // http://robertodecurnex.github.io/J50Npi/
                var data = {};
                callback = function(geodata) {

                  // Table gets confused if the result from freegeopip
                  // is 404 - How do you filter that?

                  addressArray.push(geodata.ip)

                  if (geodata.city == "" ) {
                    cityArray.push("Unknown") 
                  }
                  else { 
                    cityArray.push(geodata.city) 
                  }

                  countryArray.push(geodata.country_name)
                  latitudeArray.push(geodata.latitude)
                  longitudeArray.push(geodata.longitude)
                  
                } // END callback

                J50Npi.getJSON(url, data, callback);

                justStupidCounter++

              body.appendChild(row)
              table.appendChild(body)
              locations()

              } // END else

          } // END null-detection
          else {
            // Null value
            emptyPackets.push(1)
          }

          

      } // END for-loop


} // END receiveOutput



//---------------------------------------------------------------------------


function locations() {

  for (var e=1;e<addressArray.length; e++) {

    var temp1 = "locationCell" + e
    var temp2 = "latitudeCell" + e
    var temp3 = "longitudeCell" + e
    var temp4 = "destinationCell" + e

    if (countryArray[e] == "Reserved") {
 
      document.getElementById(temp1).innerHTML = "<a href='http://en.wikipedia.org/wiki/Reserved_IP_addresses' target='_blank'>Reserved address </a> <i class='icon-external-link'></i>"
      document.getElementById(temp2).innerHTML = "-----"
      document.getElementById(temp3).innerHTML = "-----"
 
    } else {

      if (cityArray[e] == "" ) {

        var locationCell = document.getElementById(temp1).innerHTML = countryArray[e]

      } else {

        var locationCell = document.getElementById(temp1).innerHTML = addressArray[e] + " | " + cityArray[e] + ", " + countryArray[e]
        var latitudeCell = document.getElementById(temp2).innerHTML = latitudeArray[e]
        var longitudeCell = document.getElementById(temp3).innerHTML = longitudeArray[e]

      }
      addMarkers()

    }

  }
} // END Locations


//-------------------------------------------------------------------------

function closeSocket() {
  websocket.close();
  document.getElementById('tableStatus').innerHTML = "<div class='alert alert-error'> <i class='icon-asterisk'></i> <strong>State </strong> Connection to server closed </div>";

}

//-------------------------------------------------------------------------
function createLogFile() {
  console.log("createLogFile-function called")
}


