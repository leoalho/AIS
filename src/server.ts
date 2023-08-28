import dgram from "dgram";
import http from "http";
import path from "path";
import fs from "fs";
import express from "express";
import { Server } from "socket.io";

import { parseMessage } from "./parsers";
import {
  createDbConnection,
  updatePositionReport,
  updateWeatherBroadcast,
  updateBaseStation,
  updateBuoy,
  updateVessel,
  getAllVessels,
} from "./database.js";
import { addLeadingZeros } from "./utils";
import { ADDRESS, HTTP_PORT, UDP_PORT } from "./config.js";
import {
  BaseStationQuery,
  BinaryBroadcast,
  BuoyQuery,
  MessageQuery,
  PositionReportQuery,
  VoyageDataQuery,
  WeatherReportQuery,
} from "./types";

const socket = dgram.createSocket({ type: "udp4", reuseAddr: true });
const db = createDbConnection();
let app = express();
let server = http.createServer(app);
let io = new Server(server);

async function emitVessels() {
  const currentVessels = await getAllVessels(db);
  io.emit("newVessels", JSON.stringify(currentVessels));
  console.log("emitting");
}

async function update(vessel: MessageQuery) {
  if (vessel.$messageType === 5) {
    updateVessel(db, vessel as VoyageDataQuery);
  } else if (
    vessel.$messageType === 8 &&
    (vessel as BinaryBroadcast).$dac === 1 &&
    (vessel as BinaryBroadcast).$fid === 11
  ) {
    updateWeatherBroadcast(db, vessel as WeatherReportQuery);
  } else if (vessel.$messageType === 4) {
    console.log(vessel);
    updateBaseStation(db, vessel as BaseStationQuery);
  } else if (vessel.$messageType === 21) {
    updateBuoy(db, vessel as BuoyQuery);
  } else if (vessel.$messageType <= 3) {
    updatePositionReport(db, vessel as PositionReportQuery);
  }
}

socket.on("message", (msg, _rinfo) => {
  let vessel = parseMessage(msg.toString());
  if (vessel) {
    update(vessel);
  }
  console.log(msg.toString());
  let year = addLeadingZeros(new Date().getFullYear() - 100, 2);
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
