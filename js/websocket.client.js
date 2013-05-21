    window.addEventListener("load", function(event) {
      //New websocket to 127.0.0.1:8080 using dummy-protocol
      //var WebSocketClient = require('websocket').client;
      socket = new WebSocket('ws://localhost:8080', "dummy-protocol");
      //Eventlistener for socket open 
      socket.addEventListener("open", function(event) {
          //You now have a connection. start your stuff.
          socket.send('Hello');
      });
      //Eventlistener for incoming messages.
      socket.addEventListener("message", function(event) {
         //Message from server. handle it!!!!
         alert('We got message: '+event.data);
      });
    });  