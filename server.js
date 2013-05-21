
var http = require('http');
var fs=require('fs');
var url = require('url');
var path = require('path');
var sys = require('sys');

//Create HTTP-server
var server = http.createServer(function(request, response) {
            console.log((new Date()) + ' Received request for ' + request.url + ' url');

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



