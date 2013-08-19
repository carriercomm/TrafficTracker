TrafficTracker
==============

About
-----
TrafficTracker is a tool created for monitoring your network activity. On default, it sniffs your HTTP GET-requests while browsing websites. With TrafficTracker, you can put your network activity on the map.

How does it work
-----------------------
TrafficTracker is basicly a webapp, but it works on top of Nodejs via Websockets. Sniffing is implemented by tshark (command-line version of wireshark, similar to tcpdump etc.) and the ip-information is fetched from ip-api.com. Maps are powered by leafletjs and OpenStreetMaps.

Installation
---------------
TrafficTracker has been developed on Mac OS X and Debian Wheezy, and they have been tested to work properly on both systems.

First, you need to clone the repository on your system. 

<pre> git clone https://github.com/iuuso/TrafficTracker.git </pre>

<h3> Nodejs </h3>

Download and install <a href"http://nodejs.org/">Nodejs</a>.

<strong>Please note: </strong> Nodejs is very version-sensitive. TrafficTracker has been developed with the version v0.10.13. Working with different versions is not supported, and there may be some funny errors due to that. 

Secondly, install npm and libraries needed for TrafficTracker.

<pre> npm install websocket </pre>
<pre> npm install execSync </pre>
<pre> npm install asyncblock </pre>

Almost there. Find and install tshark to your systems. Dependending on your system it's possible that you can find it from your distributions repos, more info and other versions from <a href="https://www.wireshark.org/download.html">here</a>.

<strong> Please note: </strong> In Linux, or atleast in Debian, you have mess with the privileges to get the tshark working properly with Nodejs. <code> sudo setcap cap_net_raw=+ep /usr/bin/dumpcap </code>. That should do it.

