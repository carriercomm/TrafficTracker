
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
var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png',size,offset);
markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(0,0),icon));


var halfIcon = icon.clone();
markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(0,45),halfIcon));

marker = new OpenLayers.Marker(new OpenLayers.LonLat(90,10),icon.clone());
marker.setOpacity(0.2);
marker.events.register('mousedown', marker, function(evt) { alert(this.icon.url); OpenLayers.Event.stop(evt); });
markers.addMarker(marker); 

map.zoomToMaxExtent();
map.zoomIn();


function simosilmu() {
	// Once again, implement a for-loop for going through the arrays.
	// 
};




   