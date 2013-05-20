var connection = new WebSocket('ws://html5rocks.websocket.org/echo', ['soap', 'xmpp']);
var output;

function init() {
	output = document.getElementById("output");
	pingServer();
}

function pingServer() {
	ping = new pingServer(connection);
}
// When the connection is open, send some data to the server
connection.onopen = function () {
  connection.send('Ping -c 3 google.fi'); // Send the message 'Ping' to the server
};

// Log errors
connection.onerror = function (error) {
  console.log('WebSocket Error ' + error);
};

// Log messages from the server
connection.onmessage = function (e) {
  console.log('Server: ' + e.data);
};