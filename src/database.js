const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");
const filepath = path.join("../vesselData.db");
console.log(filepath);
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
  const data = {
    $MMSI: message.MMSI,
    $messageType: message.messageType,
    $navStatus: message.$navStatus,
    $ROT: message.ROT,
    $SOG: message.SOG,
    $accuracy: message.accuracy,
    $lon: message.lon,
    $lat: message.lat,
    $COG: message.COG,
    $HDG: message.HDG,
    $timestamp: message.timeStamp,
    $timeReceived: message.timeReceived,
  };
  db.run(sql.updatePositionReport, data, function (err) {
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
        console.log(rows);
        return resolve(rows);
      }
    );
  });
};

module.exports = {
  createDbConnection,
  updatePositionReport,
  getPositionReports,
};
