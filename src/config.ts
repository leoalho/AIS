require("dotenv").config();

export const ADDRESS = process.env.ADDRESS || "127.0.0.1";
export const HTTP_PORT = process.env.HTTP_PORT
  ? parseInt(process.env.HTTP_PORT)
  : 8080;
export const UDP_PORT = process.env.UDP_PORT
  ? parseInt(process.env.UDP_PORT)
  : 3000;
export const DB_NAME = process.env.DB_NAME || "vesselData.db";
