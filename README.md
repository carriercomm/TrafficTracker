TrafficTracker
==============

About
-----
TrafficTracker is a tool created for monitoring your network activity. On default, it sniffs your HTTP GET-requests while browsing websites. With TrafficTracker, you can put your network activity on the map.

How does it work
-----------------------
TrafficTracker is basicly a webapp, but it works on top of Nodejs via Websockets. Sniffing is implemented by tshark and the ip-information is fetched from ip-api.com. Maps are powered by leafletjs and OpenStreetMaps.

Installation
---------------
TrafficTracker has been developed on Mac OS X and Debian Wheezy. 

<pre> git clone https://github.com/iuuso/TrafficTracker.git </pre>

That should do it.
