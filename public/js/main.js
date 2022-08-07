var socket = io();
import {icons} from './icons.js';
//import { RotatedMarker} from './rotatedMarker.js';
import {createPopup} from './popups.js';
// initialize Leaflet
var map = L.map('map').setView({lon: 24.4391, lat: 60.050}, 10);

// add the OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);

// show the scale bar on the lower left corner
L.control.scale({metric: true}).addTo(map);

var vessels = [];
var markersLayer = new L.LayerGroup();
markersLayer.addTo(map);

function drawAllVessels(){
	markersLayer.clearLayers();
	vessels.forEach(vessel => {
		let popup = createPopup(vessel);
		let rotation = 0;
		if (vessel.HDG){
			rotation = vessel.HDG;
		}
		let marker;
		if (icons[vessel.messageType]){
			marker = L.rotatedMarker({lon: vessel.lon, lat: vessel.lat}, {icon: icons[vessel.messageType], rotationAngle: rotation,
				rotationOrigin: "center"});
		}else{
			marker = L.rotatedMarker({lon: vessel.lon, lat: vessel.lat}, {rotationAngle: rotation,
				rotationOrigin: "center"});
		}
		
		marker.bindPopup(popup);
		markersLayer.addLayer(marker); 
	})
}

socket.on('newVessels', (newVessels)=>{
	vessels = JSON.parse(newVessels);
	drawAllVessels();
})

