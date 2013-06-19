
var map = new OpenLayers.Map("map");
var layer;

var ol_wms = new OpenLayers.Layer.WMS(
    "OpenLayers WMS",
    "http://vmap0.tiles.osgeo.org/wms/vmap0",
    {layers: "basic"}
); 

map.addLayers([ol_wms]);

map.setCenter(new OpenLayers.LonLat(0, 0), 0);

var markers = new OpenLayers.Layer.Markers( "Markers" );
map.addLayer(markers);

var size = new OpenLayers.Size(21,25);
var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
var icon = new OpenLayers.Icon('http://www.openstreetmap.org/assets/marker-red-7344acb6b41d14fbaa0476a8eb191da1.png',size,offset);

map.zoomToMaxExtent();
map.zoomIn();

map.addControl(
    new OpenLayers.Control.MousePosition({
        prefix: 
            'EPSG:4326</a> coordinates: ',
        separator: ' | ',
        numDigits: 2,
        emptyString: 'Mouse is not over map.'
    })
);


var markerCounter = []
var markerList = []



function addMarkers() {

	if ( countryArray[countryArray.length-1] != "Reserved" ) {


		// Filter out the "Reserved"-tag


		if ( countryArray[countryArray.length-1] != undefined ) {


			// Title for the marker
			var nameMarker;

			nameMarker = cityArray[cityArray.length-1] + ", " + countryArray[countryArray.length-1];
			

			if ( markerList.indexOf(nameMarker) != "-1") {
				
				// Filter duplicate markers

			} else {

				

				// Longitude and longitude for the marker
				var lon = longitudeArray[longitudeArray.length-1];
				var lat = latitudeArray[latitudeArray.length-1];

				// Creating new marker
				marker = new OpenLayers.Marker(new OpenLayers.LonLat(lon,lat),icon.clone());
				marker.setOpacity(0.8);
				marker.events.register('mousedown', marker, function(evt) { alert(this.icon.url); OpenLayers.Event.stop(evt); });

				// Give the marker a name
				marker.icon.imageDiv.title = nameMarker;
				markers.addMarker(marker); 

				// Logging
				console.log("New Marker placed on the map : " + nameMarker + "(" + lon + lat + ")" )
				markerCounter.push(1);
				markerList.push(nameMarker);

		}



		} else {

			console.log("FILTER (MAPS): Undefined value detected, doing nothings");

		}

	} else {

		console.log("FILTER (MAPS): 'Reserved' value detected, doing nothings");

	}

}; // END function addMarkers




   