import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";
import { DB_NAME } from "./config.js";

const filepath = path.join(__dirname, `../${DB_NAME}`);
import * as sql_init from "./sql_init";
import * as sql from "./sql";
import {
  BaseStationQuery,
  Buoy,
  BuoyQuery,
  Message,
  PositionReportQuery,
  VoyageDataQuery,
  WeatherReport,
  WeatherReportQuery,
} from "./types.js";

sqlite3.verbose();

const createTable = (db: sqlite3.Database) => {
  db.exec(sql_init.createVesselTable);
  db.exec(sql_init.createPositionReportTable);
  db.exec(sql_init.createBaseStationTable);
  db.exec(sql_init.createWeatherBroadcastsTable);
  db.exec(sql_init.createBuoyTable);
};

export const createDbConnection = () => {
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

export const updatePositionReport = (
  db: sqlite3.Database,
  message: PositionReportQuery
) => {
  db.run(sql.updatePositionReport, message, function (err) {
    if (err) {
      return console.error(err.message);
    }
  });
};

export const updateWeatherBroadcast = (
  db: sqlite3.Database,
  message: WeatherReportQuery
) => {
  db.run(sql.updateWeatherBroadcast, message, function (err) {
    if (err) {
      return console.error(err.message);
    }
  });
};

export const updateBaseStation = (
  db: sqlite3.Database,
  message: BaseStationQuery
) => {
  db.run(sql.updateBaseStation, message, function (err) {
    if (err) {
      return console.error(err.message);
    }
  });
};

export const updateVessel = (
  db: sqlite3.Database,
  message: VoyageDataQuery
) => {
  db.run(sql.updateVessel, message, function (err) {
    if (err) {
      return console.error(err.message);
    }
  });
};

export const updateBuoy = (db: sqlite3.Database, message: BuoyQuery) => {
  db.run(sql.updateBuoy, message, function (err) {
    if (err) {
      return console.error(err.message);
    }
  });
};

export const getPositionReports = async (
  db: sqlite3.Database
): Promise<Message[]> => {
  return new Promise((resolve, reject) => {
    db.all(
      sql.getPositionReports,
      { $time: new Date().getTime() - 60000 * 10 },
      (err, rows) => {
        if (err) {
          return reject(err);
        }
        return resolve(rows as Message[]);
      }
    );
  });
};

export const getBaseStations = async (
  db: sqlite3.Database
): Promise<Message[]> => {
  return new Promise((resolve, reject) => {
    db.all(
      sql.getBaseStations,
      { $time: new Date().getTime() - 60000 * 10 },
      (err, rows) => {
        if (err) {
          return reject(err);
        }
        return resolve(rows as Message[]);
      }
    );
  });
};

export const getWeatherReports = async (
  db: sqlite3.Database
): Promise<WeatherReport[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql.getWeatherStations, (err, rows) => {
      if (err) {
        return reject(err);
      }
      return resolve(rows as WeatherReport[]);
    });
  });
};

export const getBuoys = async (db: sqlite3.Database): Promise<Buoy[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql.getBuoys, (err, rows) => {
      if (err) {
        return reject(err);
      }
      return resolve(rows as Buoy[]);
    });
  });
};

export const getAllVessels = async (
  db: sqlite3.Database
): Promise<Message[]> => {
  const currentVessels: Message[] = [];

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
