google.maps.visualRefresh = true;

var map;

function initialize() {
  var mapOptions = {
    zoom: 2,
    center: new google.maps.LatLng(0,0),
    mapTypeId: google.maps.MapTypeId.SATELLITE
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
}



function locate() {

    console.log("Locate-function initialized")

    for (var r = 1, n = table.rows.length; r < n;r++) {

        for (var c = 3, m = 4; c < m; c++) {
            // Name for a marker comes from a cell with City, Country (cell 3)
            // Location values to a marker comes from to cells : latitude and longitude

            // What if name is Reserved? 

            var name = table.rows[r].cells[3].innerHTML
            var temp = "<a href='http://en.wikipedia.org/wiki/Reserved_IP_addresses' target='_blank'>Reserved address</a>"

            if (name != "null" && name != temp) {

              var locationData = table.rows[r].cells[4].innerHTML + "," + table.rows[r].cells[5].innerHTML
              console.log("Name to a marker: " + name + " : locationData : " + locationData)

              var myMarker = new google.maps.LatLng(locationData)

              //console.log("myMarker : " + myMarker)

              var marker = new google.maps.Marker({
                position: myMarker,
                map: map,
                animation: google.maps.Animation.DROP,
                title: name

              });
             marker.setMap(map);
             // Map should be re-initialized after this i think?
             initialize();


          }

        }
    }
}

google.maps.event.addDomListener(window, 'load', initialize);