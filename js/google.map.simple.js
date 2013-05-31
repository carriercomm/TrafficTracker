var map;

var oulu = new google.maps.LatLng(65.0167, 25.4667);
var trondheim = new google.maps.LatLng(63.4167, 10.4167);

var locationArray = [oulu,trondheim];
var locationNameArray = ['Oulu','Trondheim'];

function initialize() {
  var mapOptions = {
    zoom: 3,
    center: new google.maps.LatLng(0,0),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
}

var coord;
for (coord in locationArray) {
  new google.maps.Marker( {
    position: locationArray[coord],
    title: locationNameArray[coord]
  });
}

google.maps.event.addDomListener(window, 'load', initialize);