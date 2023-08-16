# AIS

A simple web application that can receive and display AIS messages written in nodejs.
The backend is located in the ./src directory and the frontend in the ./public directory.

## Running the application

To run the server. Run npm start. This will start the http server at port 8080 and the UDP server at port 3000.

### Environmental variables

ADDRESS: the address of the server, default value 127.0.0.1
HTTP_PORT: the port of the http-server, default value 8080
UDP_PORT: the port of the UDP-server, default value 3000
DB_NAME: name of the SQLite database, default value vesselData.db

## Frontend

The frontend is written in native js using leaflet to render the map and socket.io for the socket connection.

## Backend

The http server is implemented with express and socket.io. The UDP socket is created with the node.js native dgram library.

### Database

At the first stages a mongodb database was used (see branch mongo), later versions use SQLite as a database. For SQL learning purposes no ORM is used.
