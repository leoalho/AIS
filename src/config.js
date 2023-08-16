require("dotenv").config();

const ADDRESS = process.env.ADDRESS || "127.0.0.1";
const HTTP_PORT = process.env.HTTP_PORT || 8080;
const UDP_PORT = process.env.UDP_PORT || 3000;
const DB_NAME = process.env.DB_NAME || "vesselData.db";

module.exports = {
  ADDRESS,
  HTTP_PORT,
  UDP_PORT,
  DB_NAME,
};
