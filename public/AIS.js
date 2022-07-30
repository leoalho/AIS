var socket = io();
import {parseMessage} from "./parsers.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const image = new Image();
image.src = 'testikartta2.png';
image.onload = ()=>{
	canvas.width = image.naturalWidth;
	canvas.height = image.naturalHeight;
	ctx.drawImage(image,0,0);
}

var vessels = [];

const colors = {1: 'red', 2: 'red', 3: 'red', 4: 'blue', 5: 'red',8: 'green'};

function getPixels(vessel){
	let pixels={};
	let lon = vessel.lon;
	let lat = vessel.lat;
	let lonDelta = lon - 23.9282;
	let latDelta = lat - 59.8545;
	let lonRelative = lonDelta/1.0396;
	let latRelative = latDelta/0.3672;
	pixels.lon = parseInt(lonRelative * 948);
	pixels.lat = 667-parseInt(latRelative * 667);
	return pixels;
}

function drawVessel(vessel){
	let pixels=getPixels(vessel);
	ctx.fillStyle = colors[vessel.messageType];
	ctx.beginPath();
	ctx.arc(pixels.lon,pixels.lat,10,0,Math.PI*2);
	ctx.fill();
	ctx.stroke();
}

function drawAllVessels(){
	ctx.lineWidth = 3;
	ctx.drawImage(image,0,0);
	for (let i=0; i<vessels.length; i++){
		if (vessels[i].lat < 60.2217 && vessels[i].lat>59.8545 && vessels[i].lon>23.9282 && vessels[i].lon<24.9678){
			drawVessel(vessels[i]);
		}
	}
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

canvas.addEventListener("mousemove", function(e) { 
    var cRect = canvas.getBoundingClientRect();        // Gets CSS pos, and width/height
    var canvasX = Math.round(e.clientX - cRect.left);  // Subtract the 'left' of the canvas 
    var canvasY = Math.round(e.clientY - cRect.top);   // from the X/Y positions to make  
	ctx.drawImage(image,0,0);
    vessels.forEach(vessel =>{
		let pixels=getPixels(vessel);
		ctx.beginPath();
		ctx.arc(pixels.lon,pixels.lat,10,0,Math.PI*2);

        if (ctx.isPointInPath(canvasX,canvasY)){
            ctx.lineWidth = 5;
			// document.getElementById('decoded').innerText=JSON.stringify(vessel, null, '\t')
			let html = "<table>"
			
			Object.keys(vessel).forEach(key => {
				html += "<tr><td>" + key + "</td><td>"+vessel[key]+"</td></tr>";
			})
			html += "</table>";
			document.getElementById('decoded').innerHTML = html;
        }else{
            ctx.lineWidth = 3;
        }
		drawVessel(vessel);
        
    })

});

socket.on('newMessage', (message)=>{
	let vessel = parseMessage(message);
	updateVessels(vessel);
	console.log(vessels);
	drawAllVessels();
})

