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

var LatLonArray = []
var g;

function locate() {

    console.log("Locate-function initialized")

    console.log(cityArray)
    console.log(longitudeArray)
    console.log(latitudeArray)

    //var myCenter=new google.maps.LatLng(51.508742,-0.120850);


    // var marker = new google.maps.Marker({
    //   position: myCenter
    // });

    // marker.setMap(map);

    for (g=0;g<=countryArray.length-1;g++) {

      console.log("G : " + g)

      var keijo = latitudeArray[g] + "," + longitudeArray[g]
      console.log(keijo)
      
      //LatLonArray.push(latitudeArray[g] + "," + longitudeArray[g])

      console.log("Pysähtyykö tähän?")

      //console.log("Array " + cityArray[g] + " | " + LonLanArray[g]);

      var kierrosmerkki = "myMarker" + g;
      console.log("kierrosmerkki : " + kierrosmerkki )
      kierrosmerkki = new google.maps.LatLng(keijo);

      var kierrosmarkki = "marker" + g;

      console.log("kierrosmarkki : " + kierrosmarkki )

      kierrosmarkki = new google.maps.Marker({
        position: kierrosmerkki
      });

      kierrosmarkki.setMap(map);

    };

  }
    // No for-loop for reading table needed
    // Instead read the marker-information from correct arrays
    // cityArray, countryArray, latitudeArray, longitudeArray

    // Name for a marker comes from a cell with City, Country (cell 3)
    // Location values to a marker comes from to cells : latitude and longitude

    // What if name is Reserved?

    /*
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
     initialize(); */



google.maps.event.addDomListener(window, 'load', initialize);