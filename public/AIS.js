var socket = io();
import {parseMessage} from "./parsers.js";

// initialize Leaflet
var map = L.map('map').setView({lon: 24.4391, lat: 60.050}, 10);

// add the OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);

// show the scale bar on the lower left corner
L.control.scale({imperial: true, metric: true}).addTo(map);

var vessels = [];
var markersLayer = new L.LayerGroup();
markersLayer.addTo(map);

function drawAllVessels(){
	markersLayer.clearLayers();
	vessels.forEach(vessel => {
		let popup = L.popup().setContent(JSON.stringify(vessel,null,"<br>"));
		let marker = L.marker({lon: vessel.lon, lat: vessel.lat}).bindPopup(popup);
		marker.bindPopup(popup);
		markersLayer.addLayer(marker); 
	})
}

function updateVessels(vessel){
	for (let i=0; i<vessels.length; i++){
		if (vessels[i].MMSI==vessel.MMSI){
			let keys = Object.keys(vessel);
			keys.forEach((key)=>{
				vessels[i][key]=vessel[key];
			});
			return;
		}
	}
	vessels.push(vessel);
}

socket.on('newMessage', (message)=>{
	let vessel = parseMessage(message);
	if (vessel){
		updateVessels(vessel);
		console.log(vessels);
		drawAllVessels();
	}
})

