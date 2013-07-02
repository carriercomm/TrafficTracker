
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

var map = L.map('map').setView([42.55308, -4.277351], 2);

L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
  maxZoom: 18,
  minZoom: 2,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
}).addTo(map);

var fullScreen = new L.Control.FullScreen(); 
map.addControl(fullScreen);


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

var packetAmount = 1000
var startTime

function sendCommand() {

  var outputCommand = document.getElementById("outputCommand");
  
  commandBase = "tshark -l -i en1 -n -T fields -E separator=, -e frame.number -e ip.src -e ip.dst ";
  var temp1 = "-c " + packetAmount
  command = commandBase + temp1 + " src host 192.168.11.32"
  startTime = new Date()
  document.getElementById("startTime").innerHTML = "Time initialized: " + startTime


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
var locationArray = []

var destinationArray = []
var duplicateCount = []
var justStupidCounter; 
justStupidCounter = 0; 
var failArray = []

var ip = []
var occurrences = []

var countryOccurrence = []

var markerCounter = []
var markerList = []



//-------------------------------------------------------------

var emptyPackets = []

function receiveOutput(evt) {

    // evt.data is the data received from server
    output = evt.data;
    output.toString();
    
    // split data per packet
    var packet = output.split(/\n/)

      // Print packets line by line
      for (var i=0;i<packet.length-1;i++) {
  
        if ( addressArray.length <= 40 ) {
          // Close the connection after x amount of addressess
          // in addressArray

          var pDetails = packet[i].split(",")

          if ( pDetails[0].value != "0") {

            theRest()

          }


          document.getElementById('tableStatus').innerHTML = "<div class='alert alert-info'> <i class='icon-spinner icon-spin icon-large'></i> <strong>Heads up! </strong> This table is still being updated (" + pDetails[0] + "/" + packetAmount + ") </div>"

          document.getElementById("packageCount").innerHTML = "Number of packets sent: " + pDetails[0]


          if ( pDetails[0] >= packetAmount ) {
            closeSocket()
          }

          // pDetails[0] == Frame number
          // pDetails[1] == Source ip
          // pDetails[2] == Destination ip

            if ( pDetails[1] != "") {

               // Filter null packets

              if ( destinationArray.indexOf(pDetails[2]) != -1 ) {
                
                // Duplicate
                occurrences[ip.indexOf(pDetails[2])]++

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
                destinationCell.innerHTML = pDetails[2]
                destinationArray.push(pDetails[2])

                // Cell for location
                locationCell.setAttribute("id", "locationCell" + justStupidCounter )
                //console.log("locationCell created with id " + locationCell.id)
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
                      cityArray.push("Unknown")

                    } else {

  		                // Packages with known city
                      locationCell.innerHTML = geodata.city + ", " + geodata.country                  
                      cityArray.push(geodata.city)
                    }

                  ispCell.innerHTML = geodata.isp
                  row.setAttribute("class","")

                  if ( countryArray.indexOf(geodata.country) == "-1") {

                    // If not duplicate, then add this country to the countryArray
                    countryArray.push(geodata.country)

                  }

                  countryOccurrence[countryArray.indexOf(geodata.country)]++

                  addressArray.push(geodata.query)
                  destinationCell.innerHTML = "<strong>" + geodata.query + "</strong>"
                  locationArray.push(geodata.city + ", " + geodata.country)

                  ispArray.push(geodata.isp)
                  latitudeArray.push(geodata.lat)
                  longitudeArray.push(geodata.lon)

                  // Adding a new marker to the map
                  L.marker([geodata.lat, geodata.lon], { bounceOnAdd: true, bounceOnAddDuration: 500, bounceOnAddHeight: 200 }).addTo(map)
                  markerCounter.push(1)
                  var nameMarker = geodata.city + ", " + geodata.country
                  markerList.push(nameMarker)


                 } else {

                    failArray.push(1)
                    row.setAttribute("class","info")

                    // geodata.status has fail
                    switch ( geodata.message ) {

                      case "private range":
                          locationCell.innerHTML = "<a href='http://en.wikipedia.org/wiki/Reserved_IP_addresses' target='_blank'>Reserved address </a> <i class='icon-external-link'></i>"
                          ispCell.innerHTML = "--------"
                          //countryArray.push("Private")
                          break;

                      case "reserved range":
                          locationCell.innerHTML = "<a href='https://en.wikipedia.org/wiki/Private_network' target='_blank'>Private address </a> <i class='icon-external-link'></i>" 
                          ispCell.innerHTML = "--------"
                          //countryArray.push("Reserved")
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

           } else {
            console.log("Over xxx addressess collected, quitting")
            closeSocket()
           }
           

      } // END for-loop


justStupidCounter++

} // END receiveOutput

//-------------------------------------------------------------------------

var endTime

function closeSocket() {
  websocket.close()
  console.log("Disconnected")
  createLogFile()
  endTime = new Date()
  document.getElementById('tableStatus').innerHTML = "<div class='alert alert-error'> <i class='icon-asterisk'></i> <strong>State </strong> Connection to server closed. See Logfile for details.</div>"
}

//-------------------------------------------------------------------------

function createLogFile() {


  // Time
  document.getElementById("finishTime").innerHTML = "Time finished: " + endTime

  // Addressess
  document.getElementById("nullCount").innerHTML = "Null packets encountered: " + emptyPackets.length
  document.getElementById("addressLog").innerHTML = "Addrressess detected: " + addressArray.length

  // Markers and locations
  document.getElementById("markerCount").innerHTML = "Markers added: " + markerCounter.length
  document.getElementById("cityLog").innerHTML = "Cities detected: " + cityArray.length
  //document.getElementById("countryLog").innerHTML = "Countries detected: " + countryArray.length
  document.getElementById("ispLog").innerHTML = "ISP:s detected: " + ispArray.length


  for (var i=0; i<=ip.length;i++) {
    document.getElementById("addressDetails").innerHTML += "<br>" + i + " &thinsp; " + ip[i] + " &thinsp; " + occurrences[i]
  }

}

 function theRest() {

 var rowLength = table.rows.length

 for (var i = 0; i < rowLength ; i++) {

  var oCells = table.rows.item(i).cells
 
  var cellLength = oCells.length
  
     for ( var j = 1; j < cellLength; j++ ) {

      var cellVal = oCells.item(j).innerHTML

      if ( cellVal == "null") {

        // 1. Etsi destination cellistä ip
        var locationVall = oCells.item(2).innerHTML
        //console.log(locationVall) // <- IP-osoitteet

        if ( locationArray.indexOF(locationVall) == "-1") {
          var locationSijainti = locationArray[addressArray.indexOf(locationVall)]


        }
        
        var locationSijainti = locationArray[addressArray.indexOf(locationVall)]
        //console.log(locationSijainti)

        if ( locationArray[addressArray.indexOf(locationVall)] == "-1") {

        var keijo = oCells.item(j).innerHTML = locationSijainti

      } else {
        var keijo = oCells.item(j).innerHTML = "hasta la vista"
      }

        // 2. ip.indexOf sijainti
        // 3. location.indexOf sijainti
        // 4. print & profit
          
      }

    } 

  }

}
