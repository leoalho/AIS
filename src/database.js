const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");
const { DB_NAME } = require("./config.js");

const filepath = path.join(__dirname, `../${DB_NAME}`);
const sql_init = require("./sql_init");
const sql = require("./sql");

const createTable = (db) => {
  db.exec(sql_init.createVesselTable);
  db.exec(sql_init.createPositionReportTable);
  db.exec(sql_init.createBaseStationTable);
  db.exec(sql_init.createWeatherBroadcastsTable);
  db.exec(sql_init.createBuoyTable);
};

const createDbConnection = () => {
  const fileExists = fs.existsSync(filepath);
  const db = new sqlite3.Database(filepath, (error) => {
    if (error) {
      return console.error(error.message);
    }
  });
  if (!fileExists) {
    createTable(db);
  }
  console.log("Connection with SQLite has been established");
  return db;
};

const updatePositionReport = (db, message) => {
  db.run(sql.updatePositionReport, message, function (err) {
    if (err) {
      return console.error(err.message);
    }
  });
};

const updateWeatherBroadcast = (db, message) => {
  db.run(sql.updateWeatherBroadcast, message, function (err) {
    if (err) {
      return console.error(err.message);
    }
  });
};

const updateBaseStation = (db, message) => {
  db.run(sql.updateBaseStation, message, function (err) {
    if (err) {
      return console.error(err.message);
    }
  });
};

const updateVessel = (db, message) => {
  db.run(sql.updateVessel, message, function (err) {
    if (err) {
      return console.error(err.message);
    }
  });
};

const updateBuoy = (db, message) => {
  db.run(sql.updateBuoy, message, function (err) {
    if (err) {
      return console.error(err.message);
    }
  });
};

const getPositionReports = async (db) => {
  return new Promise((resolve, reject) => {
    db.all(
      sql.getPositionReports,
      { $time: new Date().getTime() - 60000 * 10 },
      (err, rows) => {
        if (err) {
          return reject(err);
        }
        return resolve(rows);
      }
    );
  });
};

const getBaseStations = async (db) => {
  return new Promise((resolve, reject) => {
    db.all(sql.getBaseStations, (err, rows) => {
      if (err) {
        return reject(err);
      }
      return resolve(rows);
    });
  });
};

const getWeatherReports = async (db) => {
  return new Promise((resolve, reject) => {
    db.all(sql.getWeatherStations, (err, rows) => {
      if (err) {
        return reject(err);
      }
      return resolve(rows);
    });
  });
};

const getBuoys = async (db) => {
  return new Promise((resolve, reject) => {
    db.all(sql.getBuoys, (err, rows) => {
      if (err) {
        return reject(err);
      }
      return resolve(rows);
    });
  });
};

const getAllVessels = async (db) => {
  const currentVessels = [];

  let positionReports = await getPositionReports(db);
  positionReports.forEach((report) => currentVessels.push(report));

  let baseStations = await getBaseStations(db);
  baseStations.forEach((report) => currentVessels.push(report));

  let weatherReports = await getWeatherReports(db);
  weatherReports.forEach((report) => currentVessels.push(report));

  let buoys = await getBuoys(db);
  buoys.forEach((report) => currentVessels.push(report));

  return currentVessels;
};

module.exports = {
  createDbConnection,
  updatePositionReport,
  updateWeatherBroadcast,
  updateBaseStation,
  updateBuoy,
  updateVessel,
  getAllVessels,
};
