
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



var justStupidCounter;  // Variable for loop counter in callback-function
justStupidCounter = 0; 



//-------------------------------------------------------------



var cityArray = []
var addressArray = []
var countryArray = []
var latitudeArray = []
var longitudeArray = []

var duplicateCount = []



//-------------------------------------------------------------

var pee = 1;

function receiveOutput(evt){

  // pitäskö tähän laittaa joku looppi?
    outputxml = evt.data;
    outputxml.toString();
    
    // First let's split the data for per packets
    var packet = outputxml.split(/\n/)
  
      // Print packets line by line
      for (var i=0;i<packet.length-1;i++) {

        var row = body.insertRow(i);
        //row.setAttribute("class", "success")


        var pDetails = packet[i].split(",") // Split every packet separately

        // pDetails[0] == Frame number
        // pDetails[1] == Source ip
        // pDetails[2] == Destination ip     

          frameCell = row.insertCell(0)
          frameCell.setAttribute("id", "frameCell" + justStupidCounter )
          frameCell.innerHTML = pDetails[0]
          

          sourceCell = row.insertCell(1)
          sourceCell.setAttribute("id", "sourceCell" + justStupidCounter )
          if ( pDetails[1] == "" ) {
            sourceCell.innerHTML ="null"
          } else 
          sourceCell.innerHTML = pDetails[1]

          destinationCell = row.insertCell(2)
          destinationCell.setAttribute("id", "destinationCell" + justStupidCounter )
          if ( pDetails[2] == "") {
            destinationCell.innerHTML = "null"
          } else
          destinationCell.innerHTML = pDetails[2]

          locationCell = row.insertCell(3)
          locationCell.setAttribute("id", "locationCell" + justStupidCounter )
          locationCell.innerHTML = "F-f-f-fetching...."
          console.log("locationCell" + justStupidCounter)


          latitudeCell = row.insertCell(4)
          latitudeCell.setAttribute("id", "latitudeCell" + justStupidCounter )
          latitudeCell.innerHTML = "disabled"

          longitudeCell = row.insertCell(5)
          longitudeCell.setAttribute("id", "longitudeCell" + justStupidCounter )
          longitudeCell.innerHTML = "disabled"


        body.appendChild(row)
        table.appendChild(body)


          var freegeoip ="http://freegeoip.net/json/"
          var url = freegeoip + pDetails[2]

          // Credit for this function to Roberto Decurnex
          // http://robertodecurnex.github.io/J50Npi/
          var data = {};
          callback = function(geodata) {

            // Store locationdata in different arrays

            // if geodata ip on jo in array
            // then dont push anything
            // else push kaikki
            if (addressArray.indexOf(geodata.ip) != "-1") {
              duplicateCount.push(1)
              console.log("Hey, i think we have a duplicate! " + duplicateCount.length)
              
            } else
            addressArray.push(geodata.ip)
            countryArray.push(geodata.country_name)  
            latitudeArray.push(geodata.latitude)
            longitudeArray.push(geodata.longitude)
            
          }
          J50Npi.getJSON(url, data, callback);

          justStupidCounter++ // Kasvaa oikein, per paketti
        
    }

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

    if (addressArray[e] == "Reserved") {
 
      var locationCell = document.getElementById(temp1).innerHTML = "<a href='http://en.wikipedia.org/wiki/Reserved_IP_addresses' target='_blank'>Reserved address</a>"
   
    } else {

        var locationCell = document.getElementById(temp1).innerHTML =  addressArray[e] + " | " + cityArray[e] + ", " + countryArray[e]
        var latitudeCell = document.getElementById(temp2).innerHTML = latitudeArray[e]
        var longitudeCell = document.getElementById(temp3).innerHTML = longitudeArray[e]

        var destIP = document.getElementById(temp4).innerHTML
        console.log(destIP)

  }

    if (destIP == addressArray[e]) {
      successCount.push(1)


    } else 
      failureCount.push(1)

  }
}



/*****************************************************************************/
/*
var justStupidCounter;  // Variable for loop counter in callback-function
justStupidCounter = 0;  

function GetCellValues() {

    var freegeoip = "http://freegeoip.net/json/";

    //for (var r = 1, n = table.rows.length; r < n;r++) {

        //for (var c = 2, m = 3; c < m; c++) {

          for (var i=0; i<=packetAmount-1; i++) {

            var paamaara = "destinationCell" + i
            var value = document.getElementById(paamaara).innerHTML
            var url = freegeoip + value

            // http://robertodecurnex.github.io/J50Npi/
            var data = {};

              callback = function(geodata){

                  var lokaatio = "destinationCell" + justStupidCounter
                  var destIP = document.getElementById(lokaatio).innerHTML

                  if (destIP != geodata.ip) {
                    //console.log("IP:t eivät ole samat " + destIP + " : " + geodata.ip )
                    // Hmmm, jonkinlainen hakualgoritmi pitäisi saada
                    // 
                  } 
                  else  {

                    //console.log("IP Match! : " + destIP + ":" + geodata.ip)

                    if (geodata.country_name == "Reserved") {
                      var location = "locationCell" + justStupidCounter
                      var locationCell = document.getElementById(location).innerHTML = "<a href='http://en.wikipedia.org/wiki/Reserved_IP_addresses' target='_blank'>Reserved address</a>"
                    } else {

                        if (geodata.city == "") {
                          var location = "locationCell" + justStupidCounter
                          var locationCell = document.getElementById(location).innerHTML = geodata.country_name

                        } else {

                          var location = "locationCell" + justStupidCounter
                          var locationCell = document.getElementById(location).innerHTML = geodata.ip + " | " + geodata.city + ", " + geodata.country_name

                          var latitude = "latitudeCell" + justStupidCounter
                          var latitudeCell = document.getElementById(latitude).innerHTML = geodata.latitude

                          var longitude = "longitudeCell" + justStupidCounter
                          var longitudeCell = document.getElementById(longitude).innerHTML = geodata.longitude
                        }
                    }

                  }

            justStupidCounter++

              }
           J50Npi.getJSON(url, data, callback);
    }
          console.log("Sniff output printed to table, exiting.")
}


*/
