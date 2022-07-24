const dgram     = require("dgram");
const socket    = dgram.createSocket("udp4");
const http      = require("http");
const path      = require("path");
const express   = require("express");
const socketIO  = require("socket.io");

let app         = express();
let server      = http.createServer(app);
let io          = socketIO(server);

socket.on("message", (msg, rinfo) =>{
    io.emit("newMessage", msg.toString());
    console.log(`server got ${msg} from ${rinfo.address}: ${rinfo.port}`);
});

socket.bind(8080, "192.168.0.4", () => {
    console.log("TCP socket formed on port 8080");
});

const publicPath    = path.join(__dirname, "./public");
app.use(express.static(publicPath));

server.listen(3000, "127.0.0.1", () =>{
    console.log("HTTP server listening on port 3000");
});

io.on("connection", (socket) => {
    console.log("New Connection");
})



