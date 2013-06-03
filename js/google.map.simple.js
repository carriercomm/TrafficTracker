google.maps.visualRefresh = true;

var map;

function initialize() {
  var mapOptions = {
    zoom: 3,
    center: new google.maps.LatLng(0,0),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
}



function locate() {
    console.log(locationTable)

    for (var r = 1, n = table.rows.length; r < n;r++) {

        for (var c = 3, m = 4; c < m; c++) {

            var value = table.rows[r].cells[c].innerHTML
            console.log(value)

        }
    }
}

google.maps.event.addDomListener(window, 'load', initialize);