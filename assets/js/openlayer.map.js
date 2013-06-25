


function addMarkers() {

	for (var e=0; e<=countryArray.length; e++) {


		if ( markerList.indexOf(cityArray[e] + ", " + countryArray[e]) != "0") {

			// ELSE Puuttuu - algoritmi aivan liian raskas
			// filter maps arrayssa on tuhannen paketin jälkeen 10,000 ilmoitusta 
			//


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
						console.log("New Marker placed on the map : " + nameMarker + "(" + lon + "," + lat + ")"
							)
						markerCounter.push(1); 
						markerList.push(nameMarker);

					}

				} else {

					console.log("FILTER (MAPS): Undefined value detected, doing nothings");

				}

			} else {

				console.log("FILTER (MAPS): 'Reserved' value detected, doing nothings");

			}

		}

	}

} // END function addMarkers




   