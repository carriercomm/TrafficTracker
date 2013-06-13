
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
  console.log("Init käynnistyi")
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


var packetAmount = 200;
var ipAddress = '10.20.214.180'


// Changeable values end---------------------------------------------------




function sendCommand() {

  var outputCommand = document.getElementById("outputCommand");
  
  commandBase = "tshark -l -i en1 -n -T fields -E separator=, -e frame.number -e ip.src -e ip.dst ";

  var temp1 = "-c " + packetAmount; // Temp value, because we need this variable to create tabl
  var temp2 = " src host " + ipAddress  
  command = commandBase + /*temp1 + */temp2
  websocket.send(command);

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

var emptyPackets = []

function receiveOutput(evt){

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

        if ( pDetails[1] != "") {

          // Filter duplicates from the destination array
          if (destinationArray.indexOf(pDetails[2]) != "-1" ) {

            //console.log("Duplicate destination number " + duplicateCount.length + " detected (" + pDetails[2] + ")")
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

                  // Table gets confused if the result from freegeopip
                  // is 404 - How do you filter that?

                  addressArray.push(geodata.ip)
                  cityArray.push(geodata.city)
                  countryArray.push(geodata.country_name)  
                  latitudeArray.push(geodata.latitude)
                  longitudeArray.push(geodata.longitude)
                  
                }
                J50Npi.getJSON(url, data, callback);

                justStupidCounter++
                locations();
                
                addMarkers();

              // END location fetching
            } else {
              console.log("Null value detected, send to /dev/null")
              emptyPackets.push(1)
            }


          
      }


} // end receiveOutput




//---------------------------------------------------------------------------


function locations() {


  for (e=0;e<=addressArray.length; e++) {

    var temp1 = "locationCell" + e
    var temp2 = "latitudeCell" + e
    var temp3 = "longitudeCell" + e
    var temp4 = "destinationCell" + e

    if (countryArray[e] == "Reserved") {
 
      document.getElementById(temp1).innerHTML = "<a href='http://en.wikipedia.org/wiki/Reserved_IP_addresses' target='_blank'>Reserved address</a>"
 
       } else {

        if (cityArray[e] == "" ) {
          var locationCell = document.getElementById(temp1.innerHTML = countryArray[e])
        } else {

        var locationCell = document.getElementById(temp1).innerHTML = cityArray[e] + ", " + countryArray[e]
        var latitudeCell = document.getElementById(temp2).innerHTML = latitudeArray[e]
        var longitudeCell = document.getElementById(temp3).innerHTML = longitudeArray[e]

        var destIP = document.getElementById(temp4).innerHTML
      }

       }

      }
}

