
//-------------------------------------------------------------------------
//
// This file is a default javascript-file, made for TrafficTracker in 2013.
// File contains basicly all the functionalitities required by the webapp.
// 
// Contact: iuuso @ IRC (Ircnet, Freenode, Quakenet)
//
//-------------------------------------------------------------------------


//-------------------------------------------------------------------------

// Map initialization

var map = L.map('map').setView([51.505, -0.09], 2);

L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
  maxZoom: 18,
  minZoom: 2,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
}).addTo(map);


//---------------------------------------------------------------------------

// Websocket initialization

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

//-------------------------------------------------------------

// Command to be sent to the server

var packetAmount = 50

function sendCommand() {

  var outputCommand = document.getElementById("outputCommand");
  
  commandBase = "tshark -l -i en1 -n -T fields -E separator=, -e frame.number -e ip.src -e ip.dst ";
  var temp1 = "-c " + packetAmount
  command = commandBase + temp1 + " src host 10.20.211.143"

  websocket.send(command);
}

//-------------------------------------------------------------

var table = document.getElementById('outputTable');
var body = document.createElement('tbody');

var cityArray = []
var addressArray = []
var countryArray = []
var ispArray = []
var longitudeArray = []
var latitudeArray = []
var ispArray = []

var destinationArray = []
var duplicateCount = []
var justStupidCounter; 
justStupidCounter = 0; 
var failArray = []

var ip = []
var occurrences = []

var markerCounter = []
var markerList = []


//-------------------------------------------------------------

var emptyPackets = []

function receiveOutput(evt) {

    document.getElementById('tableStatus').innerHTML = "<div class='alert alert-info'> <i class='icon-spinner icon-spin icon-large'></i> <strong>Heads up! </strong> This table is still being updated </div>"

    // evt.data is the data received from server
    outputxml = evt.data;
    outputxml.toString();

    
    // split data per packet
    var packet = outputxml.split(/\n/)

      // Print packets line by line
      for (var i=0;i<packet.length-1;i++) {

        if ( packet[i] == "") {
          console.log("Taisi tulla tyhjä rivi")
        } else {

        var pDetails = packet[i].split(",") 

        // pDetails[0] == Frame number
        // pDetails[1] == Source ip
        // pDetails[2] == Destination ip

          if ( pDetails[1] != "") {
          //   // Filter null packets

            if ( destinationArray.indexOf(pDetails[2]) != -1 ) {
              // Duplicate
              //occurrences[ip.indexOf(pDetails[2])]++

            } // END

            else {

              ip.push(pDetails[2])
              occurrences.push(1)
            
              var row = body.insertRow(-1)
              row.setAttribute("class","warning")

              frameCell = row.insertCell(0)
              sourceCell = row.insertCell(1)
              destinationCell = row.insertCell(2)
              locationCell = row.insertCell(3)
              ispCell = row.insertCell(4)       

              //Cell for packet number
              frameCell.setAttribute("id", "frameCell" + justStupidCounter )
              frameCell.innerHTML = pDetails[0]

              // Cell for source IP
              sourceCell.setAttribute("id", "sourceCell" + justStupidCounter )
              sourceCell.innerHTML = pDetails[1]

              // Cell for destination IP
              destinationCell.setAttribute("id", "destinationCell" + justStupidCounter )
              destinationCell.innerHTML = "<a href='http://ip-api.com/json/" + pDetails[2] + "' target='_blank'>" + pDetails[2] + "</a>"
              destinationArray.push(pDetails[2])

              // Cell for location
              locationCell.setAttribute("id", "locationCell" + justStupidCounter )
              locationCell.innerHTML = "null"
              
              // Cell for isp
              ispCell.setAttribute("id", "ispCell" + justStupidCounter )
              ispCell.innerHTML = "null"

              // Location service provided by IP-Api
              var ipApi = "http://ip-api.com/json/"
              var url = ipApi + pDetails[2]

              // // Credit for this function to Roberto Decurnex
              // // http://robertodecurnex.github.io/J50Npi/
              var data = {};
              J50Npi.getJSON(url, data, function(geodata) {

                if ( geodata.status != "fail") {

                  // Filter those packages with "fail-status"

                  if (geodata.city == "" ) {

                    // Those packages with city unknown

                    locationCell.innerHTML = "<i>Unknown</i>, " + geodata.country
                    row.setAttribute("class","success")
                    ispCell.innerHTML = geodata.isp

                    cityArray.push("Unknown")
                    countryArray.push(geodata.country)
                    addressArray.push(geodata.query)
                    countryArray.push(geodata.country)
                    ispArray.push(geodata.isp)
                    latitudeArray.push(geodata.lat)
                    longitudeArray.push(geodata.lon)

                  } else {

		                // Packages with known city

                    locationCell.innerHTML = geodata.city + ", " + geodata.country
                    row.setAttribute("class","success")
                    ispCell.innerHTML = geodata.isp

                    cityArray.push(geodata.city)
                    countryArray.push(geodata.country)
                    addressArray.push(geodata.query)
                    countryArray.push(geodata.country)
                    ispArray.push(geodata.isp)
                    latitudeArray.push(geodata.lat)
                    longitudeArray.push(geodata.lon)
                  }

                // Adding a new marker to the map
                L.marker([geodata.lat, geodata.lon], { bounceOnAdd: true, bounceOnAddDuration: 500, bounceOnAddHeight: 200 }).addTo(map)
                markerCounter.push(1)
                var nameMarker = geodata.city + ", " + geodata.country
                markerList.push(nameMarker)

                console.log("New Marker: " + nameMarker + " (" + markerCounter.length + ")")


               } else {

                  failArray.push(1)

                  row.setAttribute("class","info")

                  // geodata.status has fail
                  switch ( geodata.message ) {

                    case "private range":
                        locationCell.innerHTML = "<a href='http://en.wikipedia.org/wiki/Reserved_IP_addresses' target='_blank'>Reserved address </a> <i class='icon-external-link'></i>"
                        ispCell.innerHTML = "--------"
                        countryArray.push("Private")
                        break;

                    case "reserved range":
                        locationCell.innerHTML = "<a href='https://en.wikipedia.org/wiki/Private_network' target='_blank'>Private address </a> <i class='icon-external-link'></i>" 
                        ispCell.innerHTML = "--------"
                        countryArray.push("Reserved")
                        break;

                    case "invalid query":
                        window.alert("Error: ip-api.com returned invalid query for address " + pDetails[2])
                        break;
                  }

                }
              
              }); // END callback

              body.appendChild(row)
              table.appendChild(body)

            } // END else

          } // END null-detection

          else {
            // Null value
            emptyPackets.push(1)
            console.log("null detected")
          } 

          // } while( pDetails[0] <= packetAmount ) {
          //   closeSocket();

          // }
}
      } // END for-loop

justStupidCounter++



} // END receiveOutput

//-------------------------------------------------------------------------

function closeSocket() {
  websocket.close();
  console.log("Disconnected")
  document.getElementById('tableStatus').innerHTML = "<div class='alert alert-error'> <i class='icon-asterisk'></i> <strong>State </strong> Connection to server closed </div>";

}

//-------------------------------------------------------------------------

function createLogFile() {
  console.log("createLogFile-function called")
}



