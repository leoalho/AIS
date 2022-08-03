const dgram     = require("dgram");
const socket    = dgram.createSocket({type: "udp4", reuseAddr: true});
const http      = require("http");
const path      = require("path");
const fs        = require("fs");
const express   = require("express");
const socketIO  = require("socket.io");
const { MongoClient } = require("mongodb");
const {parseMessage} = require("./parsers.js");

const uri = "mongodb://localhost:27017";
console.log("Connecting to database...");
const client = new MongoClient(uri);
client.connect();
console.log("Connected to database");
const database = client.db('AIS');
const vessels = database.collection("vessels");
const vesselNames = database.collection("vesselNames");
const weatherStations = database.collection("weatherStations");

let app         = express();
let server      = http.createServer(app);
let io          = socketIO(server);

function addLeadingZeros(num, totalLength) {
    return String(num).padStart(totalLength, '0');
  }

async function emitVessels(){
    currentVessels = [];
    await vessels.find({timeReceived : {$gte : new Date().getTime()-(60000*10)}}).forEach(vessel =>{
        currentVessels.push(vessel);
    });
    await weatherStations.find({timeReceived : {$gte : new Date().getTime()-(60000*10)}}).forEach(vessel =>{
        currentVessels.push(vessel);
    });
    io.emit("newVessels", JSON.stringify(currentVessels));
    console.log('emitting')
}

async function updateVessel(vessel){
    if (vessel.messageType==5){
        await vesselNames.updateOne({MMSI: vessel.MMSI},{$set: vessel},{ upsert: true });
    }else if (vessel.messageType==8 && vessel.dac==1 && vessel.fid ==11){
        await weatherStations.updateOne({stationId : vessel.stationId},{$set: vessel},{upsert: true});
    }else{
        await vessels.updateOne({MMSI: vessel.MMSI},{$set: vessel},{ upsert: true });
    }
}

socket.on("message", (msg, rinfo) =>{
    let vessel = parseMessage(msg.toString());
    if (vessel){
        updateVessel(vessel);
    }

    //io.emit("newMessage", msg.toString());
    console.log(msg.toString());
    let year = addLeadingZeros(new Date().getYear()-100,2);
    let month = addLeadingZeros(new Date().getMonth()+1,2);
    let date = addLeadingZeros(new Date().getDate(),2);
    let fileName = "./AISdata/AIS-"+year+month+date+".txt";
    fs.appendFileSync(fileName, msg);
});

socket.bind(3000, "127.0.0.1", () => {
    console.log("TCP socket formed on port 3000");
});

const publicPath    = path.join(__dirname, "./public");
app.use(express.static(publicPath));

server.listen(8080, "127.0.0.1", () =>{
    console.log("HTTP server listening on port 8080");
});

io.on("connection", (socket) => {
    console.log("New Connection");
})

setInterval(emitVessels,30000);


