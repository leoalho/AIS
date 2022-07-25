var socket = io();

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
var voyageMessages = [];

const sixBitAscii = ['@','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O',
        'P','Q','R','S','T','U','V','W','X','Y','Z','[','\\',']','^',
        '_',' ','!','"','#','$','%','&','\'','(',')','*','+',',','-',
        '.','/','0','1','2','3','4','5','6','7','8','9',':',';','<',
        '=','>','?'];

// old version const colors = ['red','red','red','blue'];
const colors = {1: 'red', 2: 'red', 3: 'red', 4: 'blue', 5: 'red'}; //not yet in use

const messageType = ['Position Report Class A','Position Report Class A (Assigned schedule)',
'Position Report Class A (Response to interrogation)','Base Station Report','Static and Voyage Related Data',
'Binary Addressed Message','Binary Acknowledge','Binary Broadcast Message','Standard SAR Aircraft Position Report',
'UTC and Date Inquiry','UTC and Date Response','Addressed Safety Related Message','Safety Related Acknowledgement',
'Safety Related Broadcast Message','Interrogation','Assignment Mode Command','DGNSS Binary Broadcast Message',
'Standard Class B CS Position Report','Extended Class B Equipment Position Report','Data Link Management',
'Aid-to-Navigation Report','Channel Management','Group Assignment Command','Static Data Report','Single Slot Binary Message',
'Multiple Slot Binary Message With Communications State','Position Report For Long-Range Applications'];

const navStatus = ['Under way using engine','At anchor','Not under command','Restricted manoeuverability','Constrained by her draught','Moored','Aground','Engaged in Fishing',
'Under way sailing','Reserved for future amendment of Navigational Status for HSC','Reserved for future amendment of Navigational Status for WIG','Reserved for future use',
'Reserved for future use','Reserved for future use','AIS-SART is active','Not defined (default)'];

function toSixBits(char){
	let bits = '000000';
	let AsciiCode = char.charCodeAt(0)-48;
	if (AsciiCode>40){
		AsciiCode -= 8;
	}
	bits += AsciiCode.toString(2);
	bits = bits.slice(-6);
	return bits;
}

function toSixBitArray(message){
	let sixBitMessage = '';
	// console.log('Payload length: '+message.length); 
	for (let i=0; i<message.length; i++){
		sixBitMessage += toSixBits(message[i]);
	}
	return sixBitMessage;
}

function rateOfTurn(value){
	let rot = parseInt(value.slice(1),2);
	//rot = rot/4.733;
	//rot = rot*rot;
	if (parseInt(value[0])==1){
		rot -= 128;;
	}
	return rot;
}

function changeBits(message){
	let = changed = "";
	for(let i=0;i<message.length;i++){
		if (message[i]=="0"){
			changed += 1;
		}else{
			changed += 0;
		}
	}
	return changed;
}

function getCoord(coord){
	if  (parseInt(coord[0])==0){
		return parseInt(coord.slice(1),2)/600000.0;
	}else{
		return -parseInt(changeBits(coord.slice(1)),2)/600000.0;
	}
}

function parseToText(message){
	let sign = ""
	messageLength = message.length/6;
	for (let i=0; i<messageLength; i++){
		sign += sixBitAscii[parseInt(message.slice(i*6,i*6+6),2)];
	}
	neatSign = sign.replace(/\s+/g, '');
	return neatSign;
}

function parsePositionReport(message){
	let report = {};
	report.messageType = parseInt(message.slice(0,6),2);
	report.MMSI = parseInt(message.slice(8,38),2);
	report.navStatus = navStatus[parseInt(message.slice(38,42),2)];
	report.ROT = rateOfTurn(message.slice(42,50));
	report.SOG = parseInt(message.slice(50,60),2)/10;
	report.accuracy = parseInt(message.slice(60,61),2);
	report.lon = getCoord(message.slice(61,89));
	report.lat = getCoord(message.slice(89,116));
	report.COG = parseInt(message.slice(116,128),2)/10;
	report.HDG = parseInt(message.slice(128,137),2);
	report.timeStamp = parseInt(message.slice(137,143),2);
	return report;
}

function parseBaseStationReport(payload){
	let report = {};
	report.messageType = parseInt(payload.slice(0,6),2);
	report.MMSI = parseInt(payload.slice(8,38),2);
	report.year = parseInt(payload.slice(38,52),2);
	report.month = parseInt(payload.slice(53,56),2);
	report.day = parseInt(payload.slice(56,61),2);
	report.hour = parseInt(payload.slice(61,66),2);
	report.minute = parseInt(payload.slice(66,72),2);
	report.second = parseInt(payload.slice(73,78),2);
	report.accuracy = parseInt(payload.slice(78,79),2);
	report.lon = getCoord(payload.slice(79,107));
	report.lat = getCoord(payload.slice(107,134));
	report.epfd = parseInt(payload.slice(134,138),2);
	return report;
}

function parseVoyageRelatedData(payload){
	let report = {};
	report.messageType = parseInt(payload.slice(0,6),2);
	report.MMSI = parseInt(payload.slice(8,38),2);
	report.AISversion = parseInt(payload.slice(38,40),2);
	report.IMO = parseInt(payload.slice(40,70),2);
	report.callSign = parseToText(payload.slice(70,112));
	report.shipname = parseToText(payload.slice(112,232));
	report.shipType = parseInt(payload.slice(232,240),2);
	report.to_bow = parseInt(payload.slice(240,249),2);
	report.to_stern = parseInt(payload.slice(249,258),2);
	report.to_port = parseInt(payload.slice(258,264),2);
	report.to_starboard = parseInt(payload.slice(264,270),2);
	report.epfd = parseInt(payload.slice(270,274),2);
	report.ETAmonth = parseInt(payload.slice(274,278),2);
	report.ETAday = parseInt(payload.slice(278,283),2);
	report.ETAhour = parseInt(payload.slice(283,288),2);
	report.ETAminute = parseInt(payload.slice(288,294),2);
	report.draught = parseInt(payload.slice(294,302),2)/10;
	report.destination = parseToText(payload.slice(302,422));
	report.dte = parseInt(payload.slice(422,423),2);
	return report;
}

/* old version var parsers = [
	parsePositionReport,
	parsePositionReport,
	parsePositionReport,
	parseBaseStationReport,
	parseVoyageRelatedData
]
*/
var parsers = {1: parsePositionReport,
	2: parsePositionReport,
	3: parsePositionReport,
	4: parseBaseStationReport,
	5: parseVoyageRelatedData}; //not yet in use

function drawVessel(vessel){
	let lon = vessel.lon;
	let lat = vessel.lat;
	let lonDelta = lon - 23.9282;
	let latDelta = lat - 59.8545;
	let lonRelative = lonDelta/1.0396;
	let latRelative = latDelta/0.3672;
	let lonPixels = parseInt(lonRelative * 948);
	let latPixels = 667-parseInt(latRelative * 667);
	ctx.fillStyle = colors[vessel.messageType];
	ctx.beginPath();
	ctx.arc(lonPixels,latPixels,10,0,Math.PI*2);
	ctx.fill();
	ctx.stroke();
}

function drawAllVessels(){
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

var multipartMessage = [];

function parseMessage(message){
	message = String(message);
	let messageArray = message.split(',');
	// console.log('Received AIS-message: ' + messageArray);
	if (message.slice(0,2)!="!A" || messageArray.length==1){
		return("Error parsing data, possibly not a proper NMEA AIS message.")
	}
	if (messageArray[1]>1){
		if (messageArray[2]==1){
			multipartMessage = messageArray;
			return("Received first part of a multipart message ... awaiting next parts")
		}else if (multipartMessage[3]==messageArray[3]){
			messageArray[5] = multipartMessage[5] + messageArray[5];
			// console.log(messageArray[5]);
			multipartMessage = [];
		}else{
			return("Did not find earlier messages with same id")
		}
	}
	let payload = messageArray[5];
	bitPayload = toSixBitArray(payload);
	// console.log('Binary payload: '+bitPayload);
	let type= parseInt(bitPayload.slice(0,6),2);
	// console.log('Message type: '+type+' ('+messageType[type-1]+')');
	if (!parsers[type]){
		return('Message type not yet supported :(')
	}else{
		let parsedPayload = parsers[type](bitPayload);
		updateVessels(parsedPayload);
		console.table(vessels);
		drawAllVessels();
		return parsedPayload;
	}
		
}	

function getMessage(){
	let message = document.getElementById('message').value;

	if (message != ""){
		document.getElementById('decoded').innerText=JSON.stringify(parseMessage(message), null, '\t');
	}
	document.getElementById('message').value = '';
}

document.getElementById('submit').addEventListener('click', getMessage)

socket.on('newMessage', (message)=>{
	document.getElementById('decoded').innerText=JSON.stringify(parseMessage(message), null, '\t')
})