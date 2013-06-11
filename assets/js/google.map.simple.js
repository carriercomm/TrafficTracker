google.maps.visualRefresh = true;

var map;

function initialize() {
  var mapOptions = {
    zoom: 2,
    center: new google.maps.LatLng(0,0),
    mapTypeId: google.maps.MapTypeId.TERRAIN
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

    // var myCenter=new google.maps.LatLng(51.508742,-0.120850);
    // var marker = new google.maps.Marker({
    //   position: myCenter,
    //   animation: google.maps.Animation.DROP
    // });

    // marker.setMap(map);

    for (g=0;g<=countryArray.length-1;g++) {


      var keijo = latitudeArray[g] + "," + longitudeArray[g]
      console.log(keijo)
      
      //LatLonArray.push(latitudeArray[g] + "," + longitudeArray[g])

      //console.log("Array " + cityArray[g] + " | " + LonLanArray[g]);

      var kierrosmerkki = "myMarker" + g;
      console.log("kierrosmerkki : " + kierrosmerkki )
      kierrosmerkki = new google.maps.LatLng(keijo);

      var kierrosmarkki = "marker" + g;

      console.log("kierrosmarkki : " + kierrosmarkki )

      kierrosmarkki = new google.maps.Marker({
        position: kierrosmerkki,
        animation: google.maps.Animation.DROP
      })

      kierrosmarkki.setMap(map);

    }

}

google.maps.event.addDomListener(window, 'load', initialize);