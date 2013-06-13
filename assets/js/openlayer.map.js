
var map = new OpenLayers.Map("map");
var layer;

var ol_wms = new OpenLayers.Layer.WMS(
    "OpenLayers WMS",
    "http://vmap0.tiles.osgeo.org/wms/vmap0",
    {layers: "basic"}
); 

//layer = new OpenLayers.Layer.OSM( "Simple OSM Map");

map.addLayers([ol_wms]);

map.setCenter(new OpenLayers.LonLat(0, 0), 0);

var markers = new OpenLayers.Layer.Markers( "Markers" );
map.addLayer(markers);

var size = new OpenLayers.Size(21,25);
var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png',size,offset);


// var halfIcon = icon.clone();
// markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(0,45),halfIcon));

map.zoomToMaxExtent();
map.zoomIn();


var LonLatArray = []

function addMarkers() {

	if ( countryArray[countryArray.length-1] != undefined) {

		// Title for the marker
		var nameMarker = cityArray[cityArray.length-1] + ", " + countryArray[countryArray.length-1];

		// Longitude and longitude for the marker
		var lon = longitudeArray[longitudeArray.length-1];
		var lat = latitudeArray[latitudeArray.length-1];

		// Creating new marker
		marker = new OpenLayers.Marker(new OpenLayers.LonLat(lon,lat),icon.clone());
		marker.setOpacity(0.8);
		marker.events.register('mousedown', marker, function(evt) { alert(this.icon.url); OpenLayers.Event.stop(evt); });
		marker.icon.imageDiv.title = nameMarker;
		markers.addMarker(marker); 

	} else {
		console.log("undefined value detected, doing nothings");
	}

};




   