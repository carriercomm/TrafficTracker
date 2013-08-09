
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
  scrollWheelZoom: false,
  dragging: false,
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
  console.log("Websocket open, waiting for traffic....")
  sendCommand()
} // end onOpen

function onClose(evt){
  closeSocket()
} // end onClose;

function onError(evt){
  window.alert("Error establishing WebSocket-connection to server" + evt.data)
} // end onError

//-------------------------------------------------------------

// Command to be sent to the server

var startTime

// Before you start, make sure that you change this ip
// according to your networks ip-address
var hostIP = "10.20.47.13"

// Change according to your systems interface
// in what you want to listen. 
var hostInterface = "eth0"

// Spell to run tshark as a normal user in
// Ubuntu/Debian
// sudo setcap cap_net_raw=+ep /usr/bin/dumpcap

function sendCommand() {

  var outputCommand = document.getElementById("outputCommand")
  commandFields = "-n -T fields -E separator=, -e frame.number -e ip.src -e ip.dst "
  // Capture HTTP GET Requests: http://wiki.wireshark.org/CaptureFilters
  commandExtra = "src host " + hostIP + " and port 80 and tcp[((tcp[12:1] & 0xf0) >> 2):4] = 0x47455420"
  commandBase = "tshark -l -i eth0 -n -T fields -E separator=, -e frame.number -e ip.src -e ip.dst "

  command = "tshark -l -i " + hostInterface + " " + commandFields + commandExtra
  startTime = new Date();
  document.getElementById("startTime").textContent = "Time initialized: " + startTime

//tshark -i en1 -T fields -E separator=, -e frame.number -e ip.src -e ip.dst src host 192.169.11.32 'tcp port 80 and (((ip[2:2] - ((ip[0]&0xf)<<2)) - ((tcp[12]&0xf0)>>2)) != 0)' -R 'http.request.method == "GET" || http.request.method == "HEAD"'

  websocket.send(command);
}

//-------------------------------------------------------------

var table = document.getElementById('outputTable');
var body = document.createElement('tbody');

var cityArray = []         // IP-Api: Array for fetched cities
var addressArray = []      // IP-Api: Array for query addressess (geodata.query)
var countryArray = []      // IP-Api: Countries
var ispArray = []          // IP-API: ISP's
var longitudeArray = []    // IP-Api: Longitudes for markers
var latitudeArray = []     // IP-Api: Latitudes for markers
var locationArray = []     // IP-Api: Locations: City, Country
var reserveArray = []      // IP-Api: Reserve DNS

var destinationArray = []
var duplicateCount = []
var failArray = []

var ip = []                 // 
var occurrences = []

var cityOccurrence = []     // IP-Api: Counter for city occurrences
var countryOccurrence = []  // IP-Api: Counter for country occurrences
var ispOccurrence = []      // IP-Api: Counter for ISP occurrences
var reserveOccurrence = []  // IP-Api: Counter for Reserve DNS occurrences

var markerCounter = []
var markerList = []

var reservedCounter = []
var privateCounter = []

var yy = 0

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

          var pDetails = packet[i].split(",")

          document.getElementById('tableStatus').innerHTML = "<div class='alert alert-info'> <i class='icon-spinner icon-spin icon-large'></i> <strong>Heads up! </strong> This table is still being updated (" + pDetails[0] + ") Host ip: " + hostIP + "</div>"// + packetAmount + ") </div>"
          document.getElementById("packageCount").textContent = pDetails[0]

          // pDetails[0] == Frame number
          // pDetails[1] == Source ip
          // pDetails[2] == Destination ip

            if ( pDetails[1] != "") {
               // Filter null packets
                         
              if ( pDetails[1] != hostIP) {
                // This is here to detect changes in host ip (aka. source ip)
                window.alert("Alert! shark shows that your host ip is different from the one that you have given, and you might be sniffin someone elses network traffic. WebSocket closed.")
                closeSocket();
                console.log("Alert! " + pDetails[1] + " != " + hostIP + " , connection closed")
              }

              if ( destinationArray.indexOf(pDetails[2]) != -1 ) {
                
                // Duplicate
                occurrences[ip.indexOf(pDetails[2])]++

              } // END

              else {

                ip.push(pDetails[2])
                occurrences.push(1)

                // Function for adding acquired data and variables
                // to arrays
                // dst == destination
                function addToArray(dstIP, dstCity, dstCountry, dstISP, dstReverse, dstLat, dstLon) {

                  console.log("addToArray kutsuttu arvoilla: " + dstIP + " | " + dstCity + " | " + dstCountry + " | " + dstISP + " | " + dstLat + "," + dstLon)

                  addressArray.push(dstIP)

                  //----------City detection and handling---------------------

                  if ( cityArray.indexOf(dstCity) == "-1") {
                    // If not duplicate, then add this city to the cityArray

                    if ( dstCity == "" ) {
                      // Those packages with city unknown

                      if (cityArray.indexOf("Unknown") == "-1") {
                        cityArray.push("Unknown")
                        cityOccurrence.push(1)
                      } else {

                        cityOccurrence[cityArray.indexOf("Unknown")]++
                      } 

                    } else {
                      // Packages with known city               
                      cityArray.push(dstCity)
                      cityOccurrence.push(1)

                    }
                  } else {
                    cityOccurrence[cityArray.indexOf(dstCity)]++
                 }

                  // ---------END City------------------------------------

                  //----------Country detection and handling------------------

                    if ( countryArray.indexOf(dstCountry) == "-1") {
                      // If not duplicate, then add this country to the countryArray
                      countryArray.push(dstCountry)
                      countryOccurrence.push(1)
                    } else {
                      countryOccurrence[countryArray.indexOf(dstCountry)]++
                    }

                  // ---------END Country------------------------------------

                  //----------ISP detection and handling---------------------

                  if ( ispArray.indexOf(dstISP) == "-1") {

                    if (dstISP == "" ) {
                        // Unknown ISP

                      if (ispArray.indexOf("Unknown") == "-1") {
                        ispArray.push("Unknown")
                        ispOccurrence.push(1)
                      } else {
                        ispOccurrence[ispArray.indexOf("Unknown")]++
                      }

                    } else {
                      ispArray.push(dstISP)
                      ispOccurrence.push(1)
                    }
                  } else {
                      ispOccurrence[ispArray.indexOf(dstISP)]++
                    }
          

                  // ---------END ISP--------------------------------------

                  //----------RESERVE DNS -----------------------------------------

                  if ( reserveArray.indexOf(dstReverse) == "-1") {

                    if ( dstReverse == "" ) {
                      // Unknown reserve DNS

                      if ( reserveArray.indexOf("Unknown") == "-1") {
                        reserveArray.push("Unknown")
                        reserveOccurrence.push(1)
                      } else {
                        reserveOccurrence[reserveArray.indexOf("Unknown")]++
                      }

                    } else {
                      // Known reserve DNS
                      reserveArray.push(dstReverse)
                      reserveOccurrence.push(1)
                    }
                  } else {
                    reserveOccurrence[reserveArray.indexOf(dstReverse)]++
                  }

                  // ---------END RESERVE DNS--------------------------------------

                  // Latitudes and longitudes for markers
                  latitudeArray.push(dstLat)
                  longitudeArray.push(dstLon)

                }
              
                // Function for adding new row to the sniffing-table
                function addNewRow(destinationIP, locationData, ispData, reverseData, callback) {
                  var row = body.insertRow(-1)

                  lineNroCell = row.insertCell(0)
                  duplicateCell = row.insertCell(1)
                  duplicateCell.setAttribute("id", "duplicateCell" + yy)
                  destinationCell = row.insertCell(2)
                  locationCell = row.insertCell(3)
                  ispCell = row.insertCell(4)
                  reverseCell = row.insertCell(5)
                  
                  lineNroCell.textContent = yy             
                  duplicateCell.innerHTML = "---"
                  destinationCell.textContent =  destinationIP
                  locationCell.textContent = locationData
                  ispCell.textContent =  ispData 
                  reverseCell.textContent =  reverseData 

                  body.appendChild(row)
                  table.appendChild(body)

                  callback(destinationIP + "|" + locationData)
                  yy++
                }

                destinationArray.push(pDetails[2])

                // Location service provided by IP-Api
                var ipApi = "http://ip-api.com/json/"
                var url = ipApi + pDetails[2]

                // // Credit for this function to Roberto Decurnex
                // // http://robertodecurnex.github.io/J50Npi/
                var data = {};
                J50Npi.getJSON(url, data, function(geodata) {

                  if ( geodata.status == "fail") {
                    if ( geodata.message == "reserved range" ) {
                      reservedCounter.push("1")
                    }
                    if ( geodata.message == "private range" ) {
                      privateCounter.push("1")
                    }
                  } else

                  if ( geodata.city == "" ) {
                    var nameMarker = "Unknown, " + geodata.country
                  } else {
                    var nameMarker = geodata.city + ", " + geodata.country
                  }
                  markerList.push(nameMarker)
 
                  locationArray.push(geodata.city + ", " + geodata.country)

                  // Adding a new marker to the map
                  L.marker([geodata.lat, geodata.lon], { bounceOnAdd: true, bounceOnAddDuration: 500, bounceOnAddHeight: 200 }).addTo(map)
                  markerCounter.push(1)

                  addToArray(geodata.query, geodata.city, geodata.country, geodata.isp, geodata.reverse, geodata.lat, geodata.lon, function(result) {
                  });

                  addNewRow(geodata.query, nameMarker, geodata.isp, geodata.reverse, function(result) {
                  });    
                
                }); // END callback

              } // END else

            } // END null-detection

            else {
              // Null value
              emptyPackets.push(1)
              console.log("null detected")
            }      

      } // END for-loop

      createLogFile()

} // END receiveOutput

//-------------------------------------------------------------------------

function closeSocket() {
  websocket.close()
  console.log("Disconnected")
  document.getElementById('tableStatus').innerHTML = "<div class='alert alert-error'> <i class='icon-asterisk'></i> <strong>State </strong> Connection to server closed. See Logfile for details.</div>"
  createLogFile()
  
}

//-------------------------------------------------------------------------

function createLogFile() {

  //console.log("Logging-function called")
  //printDuplicates()

  // Addressess
  document.getElementById("nullCount").textContent = emptyPackets.length
  document.getElementById("addressLog").textContent = addressArray.length
  document.getElementById("reservedLog").textContent = reservedCounter.length
  document.getElementById("privateLog").textContent = privateCounter.length

  // Markers and locations
  document.getElementById("markerCount").textContent = markerCounter.length
  document.getElementById("cityLog").textContent = cityArray.length
  document.getElementById("countryLog").textContent = countryArray.length
  document.getElementById("ispLog").textContent = ispArray.length

}

function printDuplicates() {
    for (var i=0; i<=yy;i++) {
      var temp = "duplicateCell" + i
      document.getElementById(temp).textContent = occurrences[i]
    }
}


//-------------------------------------------------------------------------
// Here are the functions that print the hit-tables

function printHits() {
  printHitsPerCountry()
  printHitsPerAddress()
  printHitsPerISP()
  printHitsPerCity()
  printHitsPerReserve()
}

function printHitsPerCountry() {

  var countryBody = document.getElementById('countryOccurrenceTable')

  for (var i=0; i<=countryArray.length-1;i++) {
    var row = countryBody.insertRow(-1)
    countryCell = row.insertCell(0)
    hitsPerCountryCell = row.insertCell(1)
    countryCell.textContent = countryArray[i]
    hitsPerCountryCell.textContent = countryOccurrence[i]

    countryBody.appendChild(row)
  }                  
}

function printHitsPerAddress() {

  var addressBody = document.getElementById('addressOccurrenceTable')

  for (var i=0; i<=ip.length-1; i++) {
    var row = addressBody.insertRow(-1)
    addressCell = row.insertCell(0)
    hitsPerAddressCell = row.insertCell(1)
    addressCell.textContent = ip[i]
    hitsPerAddressCell.textContent = occurrences[i]

    addressBody.appendChild(row)
  }
}

function printHitsPerISP() {

  var ispBody = document.getElementById('ispOccurrenceTable')

  for (var i=0; i<= ispArray.length-1; i++) {
    var row = ispBody.insertRow(-1)
    ispCell = row.insertCell(0)
    hitsPerISPCell = row.insertCell(1)
    ispCell.textContent = ispArray[i]
    hitsPerISPCell.textContent = ispOccurrence[i]

    ispBody.appendChild(row)

  }
}

function printHitsPerCity() {

  var cityBody = document.getElementById('cityOccurrenceTable')

  for (var i=0; i<= cityArray.length-1; i++) {
    var row = cityBody.insertRow(-1)
    cityCell = row.insertCell(0)
    hitsPerCityCell = row.insertCell(1)
    cityCell.textContent = cityArray[i]
    hitsPerCityCell.textContent = cityOccurrence[i]

    cityBody.appendChild(row)

  }
}

function printHitsPerReserve() {

  var reserveBody = document.getElementById('DNSOccurrenceTable')

  for (var i=0; i<= reserveArray.length-1; i++) {
    var row = reserveBody.insertRow(-1)
    reserveCell = row.insertCell(0)
    hitsPerReserveCell = row.insertCell(1)
    reserveCell.textContent = reserveArray[i]
    hitsPerReserveCell.textContent = reserveOccurrence[i]

    reserveBody.appendChild(row)

  }
}

