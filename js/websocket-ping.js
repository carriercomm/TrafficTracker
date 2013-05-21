var connection = new WebSocket('ws://localhost:8080', ['soap', 'xmpp']);
var outputPing;

function init() {
	output = document.getElementById("output");
	pingServer();
}

function pingServer() {
	ping = new pingServer(connection);
}
// When the connection is open, send some data to the server
connection.onopen = function () {
  connection.send('Ping'); // Send the message 'Ping' to the server
};

// Log errors
connection.onerror = function (error) {
  console.log('WebSocket Error ' + error);
};

// Log messages from the server
connection.onmessage = function (e) {
  console.log('Server: ' + e.data);
};