const dgram = require("dgram");
const http = require("http");
const path = require("path");
const fs = require("fs");
const express = require("express");
const socketIO = require("socket.io");

const { parseMessage } = require("./parsers.js");
const {
  createDbConnection,
  updatePositionReport,
  updateWeatherBroadcast,
  updateBaseStation,
  updateBuoy,
  updateVessel,
  getAllVessels,
} = require("./database.js");
const { addLeadingZeros } = require("./utils.js");
const { ADDRESS, HTTP_PORT, UDP_PORT } = require("./config.js");

const socket = dgram.createSocket({ type: "udp4", reuseAddr: true });
const db = createDbConnection();
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

async function emitVessels() {
  const currentVessels = await getAllVessels(db);
  io.emit("newVessels", JSON.stringify(currentVessels));
  console.log("emitting");
}

async function update(vessel) {
  if (vessel.$messageType === 5) {
    updateVessel(db, vessel);
  } else if (
    vessel.$messageType === 8 &&
    vessel.$dac === 1 &&
    vessel.$fid === 11
  ) {
    updateWeatherBroadcast(db, vessel);
  } else if (vessel.$messageType === 4) {
    console.log(vessel);
    updateBaseStation(db, vessel);
  } else if (vessel.$messageType === 21) {
    updateBuoy(db, vessel);
  } else if (vessel.$messageType <= 3) {
    updatePositionReport(db, vessel);
  }
}

socket.on("message", (msg, rinfo) => {
  let vessel = parseMessage(msg.toString());
  if (vessel) {
    update(vessel);
  }
  console.log(msg.toString());
  let year = addLeadingZeros(new Date().getYear() - 100, 2);
  let month = addLeadingZeros(new Date().getMonth() + 1, 2);
  let date = addLeadingZeros(new Date().getDate(), 2);
  let fileName = "./AISdata/AIS-" + year + month + date + ".txt";
  fs.appendFileSync(fileName, msg);
});

socket.bind(UDP_PORT, ADDRESS, () => {
  console.log(`UDP socket formed on ${ADDRESS} port ${UDP_PORT}`);
});

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

server.listen(HTTP_PORT, ADDRESS, () => {
  console.log(`HTTP server listening on ${ADDRESS} port ${HTTP_PORT}`);
});

io.on("connection", async (socket) => {
  const currentVessels = await getAllVessels(db);
  socket.emit("newVessels", JSON.stringify(currentVessels));
  console.log("New Connection");
});

setInterval(emitVessels, 30000);
