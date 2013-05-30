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
  sendCommand();
} // end onOpen

function onClose(evt){
  //called when connection is severed
  //serverStatus.innerHTML = "<p class = 'text-error'>DISCONNECTED</p>";
} // end onClose;

function onError(evt){
  window.alert("Error establishing WebSocket-connection to server" + evt.data)
} // end onError



/*****************************************************************************/
// Send server a command a receive output

var outputCommand; // Variable for command sent to server

function sendCommand() {

  outputCommand = document.getElementById("outputCommand");

  commandBase = "tshark -n -T fields -E separator=, -e frame.number -e ip.src -e ip.dst -c 3 -i en1 src host ";
  ipAddress = "10.20.45.124"
  command = commandBase + ipAddress;
  websocket.send(command);
  outputCommand.innerHTML += "<p class='text-info'>Command sent: " + command + "</p>";

}

var table = document.getElementById('outputTable');
var body = document.createElement('tbody');

function receiveOutput(evt){

    // Table creation
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

        // Create row for the table
        var row = document.createElement("tr");


          // Create cell for packet number
          var numberCell = document.createElement("th");
          var numberCelltext = document.createTextNode(pDetails[0]);
          numberCell.appendChild(numberCelltext);

          // Create cell for the source ip
          var sourceCell = document.createElement("th");
          var sourceCelltext = document.createTextNode(pDetails[1]);
          sourceCell.appendChild(sourceCelltext);

          // Create sell for the destination ip
          var destinationCell = document.createElement("th");
          var destinationCelltext = document.createTextNode(pDetails[2]);
          destinationCell.appendChild(destinationCelltext);


          // Cell for City, Country
          var locationCell = document.createElement("th")
          locationCell.setAttribute("id", "locCell")
          var locationCelltext = document.createTextNode("Fetching . . .");
          locationCell.appendChild(locationCelltext);

          // Cell for latitude
          var latitudeCell = document.createElement("th")
          latitudeCell.setAttribute("id", "latCell")
          var latitudeCelltext = document.createTextNode("Fetching . . .")
          latitudeCell.appendChild(latitudeCelltext);

          //Cell for longitude
          var longitudeCell = document.createElement("th")
          longitudeCell.setAttribute("id", "lonCell")
          var longitudeCelltext = document.createTextNode("Fetching . . .")
          longitudeCell.appendChild(longitudeCelltext)


        // Attach cells to row
        row.appendChild(numberCell);
        row.appendChild(sourceCell);
        row.appendChild(destinationCell);
        row.appendChild(locationCell);
        row.appendChild(latitudeCell);
        row.appendChild(longitudeCell);

        
         // Attach row to body
        body.appendChild(row);  
    }
    table.appendChild(body)

    GetCellValues()

} // end onMessage



function GetCellValues() {

    //window.alert("Funktio käynnistyi")

    var freegeoip = "http://freegeoip.net/json/";

    for (var r = 1, n = table.rows.length; r < n;r++) {

        for (var c = 2, m = table.rows[r].cells.length; c < m; c++) {

            //alert(table.rows[r].cells[c].innerHTML);
            var url = freegeoip + table.rows[r].cells[c].innerHTML;

            // http://robertodecurnex.github.io/J50Npi/
            var data = {};
            callback = function(geodata){
                      var newRow = body.insertRow(-1);
                      var newCell0 = newRow.insertCell(0)
                      newCell0.innerHTML ='Fetching...'
                      var newCell1 = newRow.insertCell(1)
                      newCell1.innerHTML = geodata.country_name
                      //var location = document.getElementById('locCell').innerHTML += geodata.country_name
                      var latitude = document.getElementById('latCell').innerHTML = geodata.latitude
                      var longitude = document.getElementById('lonCell').innerHTML = geodata.longitude
            }
           J50Npi.getJSON(url, data, callback);


        }
    }
}


