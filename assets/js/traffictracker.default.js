
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

var packetAmount = 200
var startTime

// Before you start, make sure that you change this ip
// according to your networks ip-address
var hostIP = "192.168.11.32"

function sendCommand() {

  var outputCommand = document.getElementById("outputCommand");
  
  commandBase = "tshark -l -i en1 -n -T fields -E separator=, -e frame.number -e ip.src -e ip.dst ";
  var temp1 = "-c " + packetAmount
  command = commandBase + temp1 + " src host " + hostIP
  startTime = new Date()
  document.getElementById("startTime").innerHTML = "Time initialized: " + startTime


  websocket.send(command);
}

//-------------------------------------------------------------

var table = document.getElementById('outputTable');
var body = document.createElement('tbody');

var cityArray = []        // Array where cities are stored (ip-api)
var addressArray = []     // Array where ip-adrressess are stored (ip-api)
var countryArray = []     // Countries (ip-api)
var ispArray = []         // ISP:s (ip-api)
var longitudeArray = []   // Longitudes (ip-api)
var latitudeArray = []    // Longitudes (ip-api)
var locationArray = []    // Locations = City, Country (ip-api)

var destinationArray = []
var duplicateCount = []
var failArray = []

var ip = []
var occurrences = []

var countryOccurrence = []

var markerCounter = []
var markerList = []

var reservedCounter = []
var privateCounter = []

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

        // Close the connection after 40 addressess in addressArray
        if ( addressArray.length <= 400 ) {

          var pDetails = packet[i].split(",")

          document.getElementById('tableStatus').innerHTML = "<div class='alert alert-info'> <i class='icon-spinner icon-spin icon-large'></i> <strong>Heads up! </strong> This table is still being updated (" + pDetails[0] + "/) Host ip: " + hostIP + "</div>"// + packetAmount + ") </div>"
          document.getElementById("packageCount").innerHTML = "Number of packets sent: " + pDetails[0]

          if ( pDetails[0] >= packetAmount ) {
            closeSocket()
          }

          // pDetails[0] == Frame number
          // pDetails[1] == Source ip
          // pDetails[2] == Destination ip

            if ( pDetails[1] != "") {
               // Filter null packets
                         
              if ( pDetails[1] != hostIP) {
                // This is here to detect changes in host ip (aka. source ip)
                window.alert("Alert! shark shows that your host ip is different from the one that you have given. WebSocket closed.")
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
              
                function addNewRow(lineNmbr, packetNmbr, destinationIP, locationData, ispData, reverseData, callback) {
                  //console.log("addNewRow (" + packetNmbr + "," + destinationIP + "," + locationData + "," + ispData + "," + reverseData + ")")
                  var row = body.insertRow(-1)

                  lineNroCell = row.insertCell(0)
                  lineNroCell.textContent = lineNmbr

                  frameCell = row.insertCell(1)
                  frameCell.textContent =  packetNmbr 

                  destinationCell = row.insertCell(2)
                  destinationCell.textContent =  destinationIP 

                  locationCell = row.insertCell(3)
                  locationCell.textContent =  locationData 

                  ispCell = row.insertCell(4)
                  ispCell.textContent =  ispData 

                  reverseCell = row.insertCell(5)
                  reverseCell.textContent =  reverseData 

                  body.appendChild(row)
                  table.appendChild(body)

                  callback(destinationIP + "|" + locationData)
                }

                destinationArray.push(pDetails[2])

                // Location service provided by IP-Api
                var ipApi = "http://ip-api.com/json/"
                var url = ipApi + pDetails[2]

                // // Credit for this function to Roberto Decurnex
                // // http://robertodecurnex.github.io/J50Npi/
                var data = {};
                J50Npi.getJSON(url, data, function(geodata) {

                  if ( geodata.status != "success") {
                    switch ( geodata.message ) {
                      case "reserved range":
                          locationArray.push("Reserved address")
                          reservedCounter.push("1")
                          break;
                      case "private range":
                          locationArray.push("Private address")
                          privateCounter.push("1")
                          break;
                      case "invalid query":
                          console.log("Invalid address!")
                          break;
                      default:
                          console.log("Ei pitäisi tapahtua : " + geodata.query)
                          break;
                    }
                  }

                    if ( geodata.city == "" ) {
                      // Those packages with city unknown
                      cityArray.push("Unknown")

                    } else {
  		                // Packages with known city               
                      cityArray.push(geodata.city)
                    }

                    if ( countryArray.indexOf(geodata.country) == "-1") {
                      // If not duplicate, then add this country to the countryArray
                      countryArray.push(geodata.country)
                    }

                    countryOccurrence[countryArray.indexOf(geodata.country)]++
                    addressArray.push(geodata.query)
                    locationArray.push(geodata.city + ", " + geodata.country)
                    
                    ispArray.push(geodata.isp)
                    latitudeArray.push(geodata.lat)
                    longitudeArray.push(geodata.lon)

                    // Adding a new marker to the map
                    L.marker([geodata.lat, geodata.lon], { bounceOnAdd: true, bounceOnAddDuration: 500, bounceOnAddHeight: 200 }).addTo(map)
                    markerCounter.push(1)

                    if ( geodata.city == "" ) {
                      var nameMarker = "Unknown, " + geodata.country
                    } else {
                      var nameMarker = geodata.city + ", " + geodata.country
                    }
                    markerList.push(nameMarker)

                  addNewRow(locationArray.length, pDetails[0], geodata.query, nameMarker, geodata.isp, geodata.reverse, function(result) {
                  //console.log("callback kutsuttu: " + result)
                  });    
                
                }); // END callback

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

} // END receiveOutput

//-------------------------------------------------------------------------

function closeSocket() {
  websocket.close()
  console.log("Disconnected")
  var endTime = new Date()

  document.getElementById("finishTime").innerHTML = "Time finished: " + endTime
  document.getElementById('tableStatus').innerHTML = "<div class='alert alert-error'> <i class='icon-asterisk'></i> <strong>State </strong> Connection to server closed. See Logfile for details.</div>"
  createLogFile()
}

//-------------------------------------------------------------------------

function createLogFile() {


  // Time

  // Addressess
  document.getElementById("nullCount").innerHTML = "Null packets encountered: " + emptyPackets.length
  document.getElementById("addressLog").innerHTML = "Addressess detected: " + addressArray.length
  document.getElementById("reservedLog").textContent = "Reserved addressess detected : " + reservedCounter.length
  document.getElementById("privateLog").textContent = "Private addresses detected : " + privateCounter.length

  // Markers and locations
  document.getElementById("markerCount").innerHTML = "Numbers of markers added to the map:" + markerCounter.length
  document.getElementById("cityLog").innerHTML = "Number of cities detected: " + cityArray.length
  document.getElementById("countryLog").innerHTML = "Number of countries detected: " + countryArray.length
  document.getElementById("ispLog").innerHTML = "Number of ISP:s detected: " + ispArray.length

  // Counter and occu


  for (var i=0; i<=ip.length;i++) {
    document.getElementById("addressDetails").innerHTML += "<br>" + i + " &thinsp; " + ip[i] + " &thinsp; " + occurrences[i]
  }

}
