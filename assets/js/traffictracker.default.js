
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


L.marker([48.85, 2.35], { boolean bounceOnAdd, object bounceOnAddOptions, function bounceOnAddCallback }).addTo(map);


    // L.marker([51.5, -0.09]).addTo(map)
    //   .bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

    // L.circle([51.508, -0.11], 500, {
    //   color: 'red',
    //   fillColor: '#f03',
    //   fillOpacity: 0.5
    // }).addTo(map).bindPopup("I am a circle.");

    // L.polygon([
    //   [51.509, -0.08],
    //   [51.503, -0.06],
    //   [51.51, -0.047]
    // ]).addTo(map).bindPopup("I am a polygon.");


    var popup = L.popup();

    function onMapClick(e) {
      popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
    }

    map.on('click', onMapClick);



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

function sendCommand() {

  var outputCommand = document.getElementById("outputCommand");
  
  commandBase = "tshark -l -i en1 -n -T fields -E separator=, -e frame.number -e ip.src -e ip.dst ";
  command = commandBase + "-c 1000 src host 10.20.49.46"

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
              ispCell = row.insertCell(4)
              


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

              // Cell for location
              locationCell.setAttribute("id", "locationCell" + justStupidCounter )
              locationCell.innerHTML = "------------"
              

              // Cell for isp
              ispCell.setAttribute("id", "ispCell" + justStupidCounter )
              ispCell.innerHTML = "------------"

              // Location service provided by IP-Api
              var ipApi = "http://ip-api.com/json/"
              var url = ipApi + pDetails[2]

              // // Credit for this function to Roberto Decurnex
              // // http://robertodecurnex.github.io/J50Npi/
              var data = {};
              callback = function(geodata) {

                if ( geodata.status != "fail") {

                  console.log("QUERY : " + geodata.query + " Result: " + geodata.city + ", " + geodata.country)

                  if (geodata.city == "" ) {

                     cityArray.push("Unknown")

                  } else {

                     cityArray.push(geodata.city)
                     countryArray.push(geodata.country)

                  }

                  cityArray.push(geodata.city)
                  addressArray.push(geodata.query)
                  countryArray.push(geodata.country)
                  ispArray.push(geodata.isp)
                  latitudeArray.push(geodata.lat)
                  longitudeArray.push(geodata.lon)


               } else {

                  // geodata.status has fail
                  switch ( geodata.message ) {

                    case "private range":
                        //window.alert("privaatti!")
                        break;

                    case "reserved range":
                        //window.alert("reserved")
                        break;
                  }

                }
              
                  
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


var markerCounter = []
var markerList = []


function locations() {

  for (var e=0;e<addressArray.length; e++) {

    var temp1 = "locationCell" + e
    var temp2 = "ispCell" + e

    if (countryArray[e] == "Reserved") {
      document.getElementById(temp1).innerHTML = "<a href='http://en.wikipedia.org/wiki/Reserved_IP_addresses' target='_blank'>Reserved address </a> <i class='icon-external-link'></i>" 
    } 

    if (countryArray[e] == "Private") {
      document.getElementById(temp1).innerHTML = "<a href='https://en.wikipedia.org/wiki/Private_network' target='_blank'>Private address </a> <i class='icon-external-link'></i>"
    }

    if (countryArray[e] == "Error") {
      document.getElementById(temp1).innerHTML = "Error"

    }
    else {

      if (cityArray[e] == "" ) {

        var locationCell = document.getElementById(temp1).innerHTML = countryArray[e]

      } else {

        var locationCell = document.getElementById(temp1).innerHTML = addressArray[e] + " | " + cityArray[e] + ", " + countryArray[e]
        var ispCell = document.getElementById(temp2).innerHTML = ispArray[e]

        var lon = longitudeArray[e]
        var lat = latitudeArray[e]

        var nameMarker = cityArray[e] + ", " + countryArray[e]

        if ( markerList.indexOf(nameMarker) != "-1" ) {

           // Filter duplicate markers

        } else {

          L.marker([lat, lon]).addTo(map)
          
          // // Logging
          console.log("New Marker placed on the map : " + nameMarker + "(" + lon + "," + lat + ")" )
          markerCounter.push(1); 
          markerList.push(nameMarker);
        }

        

      }

    }

  }

  document.getElementById(temp2).innerHTML = "-----"

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



