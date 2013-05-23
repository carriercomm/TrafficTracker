var outputCommand;

function sendCommand() {

  command = "ifconfig";
  websocket.send(command);
  lineSpace();
  document.write(outputCommand);

}