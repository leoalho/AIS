exports.createVesselTable = `
CREATE TABLE vessels
(
  MMSI INTEGER PRIMARY KEY,
  messageType INTEGER,
  callSign TEXT,
  shipname TEXT,
  shipType INTEGER,
  to_bow INTEGER,
  to_stern INTEGER,
  to_port INTEGER,
  to_starboard INTEGER,
  epfd TEXT,
  ETAmonth INTEGER,
  ETAday INTEGER,
  ETAhout INTEGER,
  ETAminute INTEGER,
  draught INTEGER,
  destination TEXT,
  dte INTEGER,
  timeReceived INTEGER
);`;

exports.createPositionReportTable = `
CREATE TABLE positionReports
(
  MMSI INTEGER PRIMARY KEY,
  messageType INTEGER,
  navStatus TEXT,
  ROT INTEGER,
  SOG INTEGER,
  accuracy INTEGER,
  lon REAL,
  lat REAL,
  COG INTEGER,
  HDG INTEGER,
  timestamp INTEGER,
  timeReceived INTEGER
);`;

exports.createBaseStationTable = `
CREATE TABLE baseStationReports
(
  MMSI INTEGER PRIMARY KEY,
  messageType INTEGER,
  year INTEGER,
  month INTEGER,
  day INTEGER,
  hour INTEGER,
  minute INTEGER,
  second INTEGER,
  accuracy INTEGER,
  lon REAL,
  lat REAL,
  epfd TEXT,
  timeReceived INTEGER
)`;

exports.createWeatherBroadcastsTable = `
CREATE TABLE weatherBroadcasts
(
  MMSI INTEGER PRIMARY KEY,
  messageType INTEGER,
  dav INTEGER,
  fid INTEGER,
  lat REAL,
  lon REAL,
  day INTEGER,
  hour INTEGER,
  minute INTEGER,
  temperature REAL,
  wspeed INTEGER,
  wgust INTEGER,
  wdir INTEGER
  wgustdir INTEGER,
  humidity INTEGER,
  dewpoint INTEGER,
  pressure INTEGER,
  pressureTrend INTEGER,
  visibility INTEGER,
  seaState TEXT,
  stationId TEXT,
  stationName TEXT,
  timeReceived INTEGER
);`;

exports.createBuoyTable = `
CREATE TABLE buoys
(
  MMSI INTEGER PRIMARY KEY,
  messageType INTEGER,
  aidType TEXT,
  name TEXT,
  accuracy INTEGER,
  lat REAL,
  lon REAL,
  to_bow INTEGER,
  to_stern INTEGER,
  to_port INTEGER,
  to_starboard INTEGER,
  epfd TEXT,
  second INTEGER,
  off_position INTEGER,
  regional INTEGER,
  raim INTEGER,
  virtual_aid INTEGER,
  assigned INTEGER,
  spare INTEGER,
  timeReceived INTEGER
);`;
