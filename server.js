const dgram     = require("dgram");
const socket    = dgram.createSocket({type: "udp4", reuseAddr: true});
const http      = require("http");
const path      = require("path");
const fs        = require("fs");
const express   = require("express");
const socketIO  = require("socket.io");
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
console.log("Connecting to database...");
const client = new MongoClient(uri);
client.connect();
console.log("Connected to database");
const database = client.db('AIS');
const vessels = database.collection("vessels");
const vesselNames = database.collection("vesselNames");

let app         = express();
let server      = http.createServer(app);
let io          = socketIO(server);

socket.on("message", (msg, rinfo) =>{
    io.emit("newMessage", msg.toString());
    console.log(msg.toString());
    fs.appendFileSync("AIS.txt", msg);
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



