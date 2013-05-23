var sys = require("sys");
var http = require("http");
var path = require("path");
var url = require("url");
var filesys = require("fs");
var execSync = require("execSync");

// Create dynamic http-server
var server = http.createServer(function(request,response){
	console.log(new Date() + ' Received request for ' + request.url);
	var my_path = url.parse(request.url).pathname;
	var full_path = path.join(process.cwd(),my_path);

	path.exists(full_path,function(exists){
		if(!exists){
			response.writeHeader(404, {"Content-Type": "text/plain"});  
			response.write("404 Not Found\n");  
			response.end();
		}
		else{
			filesys.readFile(full_path, "binary", function(err, file) {  
			     if(err) {  
			         response.writeHeader(500, {"Content-Type": "text/plain"});  
			         response.write(err + "\n");  
			         response.end();  
			   
			     }  
				 else{
					response.writeHeader(200);  
			        response.write(file, "binary");  
			        response.end();
				}
					 
			});
		}
	});
})	

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
    connection = request.accept("echo-protocol", request.origin)
    console.log((new Date()) + ' Connection accepted. ');

    //Eventlistener for connection message
    connection.on('message', function(message) {

    	//Checking the type of message and acting accordingly
    	if (message.type == 'utf8') {
    		console.log('Received message: ' + message.utf8Data);
    		connection.sendUTF(message.utf8Data);
    	}
    	else if (message.type === 'binary') {
        	console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    	
	})
})
//Eventlistener for wsServer close
wsServer.on('close',function(){
	console.log('Server: Connection closed.')
})
