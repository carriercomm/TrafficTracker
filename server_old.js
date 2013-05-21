
var http = require('http');
var fs=require('fs')

//Create HTTP-server
var server = http.createServer(function(request, response) {
			response.writeHead(200);
		    response.write(fs.readFileSync('./websocketDummy/client.html'))
		    response.end();
});

//Set server to listen port 8080
server.listen(8080, function(err) {
		console.log('Server listening port '+'8080')
});

//Require node-websocket server implementation
var WebSocketServer = require('websocket').server;

//Create new websocket-server object and connect it to http-server
wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

//Eventlistener for wsServer request
wsServer.on('request', function(request) {
	//We create connections for requests using protocol dummy-protocol
    connection = request.accept('dummy-protocol', request.origin);
    //Eventlistener for connection message
    connection.on('message', function(message) {
    	//You got message. Handle it!!!
    	console.log('we got message'+message)
    	connection.sendUTF('Hello world')
	})
})
//Eventlistener for wsServer close
wsServer.on('close',function(){
	console.log('Connection closed.')
})



