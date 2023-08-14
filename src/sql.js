exports.updatePositionReport = `
INSERT INTO positionReports(MMSI, messageType, navStatus, ROT, SOG, accuracy, lon, lat, COG, HDG, timestamp, timeReceived)
VALUES($MMSI, $messageType, $navStatus, $ROT, $SOG, $accuracy, $lon, $lat, $COG, $HDG, $timestamp, $timeReceived)
ON CONFLICT(MMSI) DO UPDATE SET
messageType = excluded.messageType,
navStatus = excluded.navStatus,
ROT = excluded.ROT,
SOG = excluded.SOG,
accuracy = excluded.accuracy,
lon = excluded.lon,
lat = excluded.lat,
COG = excluded.COG,
HDG = excluded.HDG,
timestamp = excluded.timestamp,
timeReceived = excluded.timeReceived
;`;

exports.updatebaseStation = `
INSERT INTO baseStationReports (MMSI,
messageType, year, month, day, hour, minute, second, accuracy, lon, lat, epfd)
VALUES ($MMSI, $messageType, $year, $month, $day, $hour, $minute, $second, $accuracy, $lon, $lat, $epfd)
ON CONFLICT(MMSI) DO UPDATE SET
messageType = excluded.messageType,
year = excluded.year,
month = excluded.month,
day = excluded.day,
hour = excluded.hour,
minute = excluded.minute,
second = excluded.second,
accuracy = excluded.accuracy,
lon = excluded.lon,
lat = excluded.lat,
epfd = excluded.epfd;`;

exports.updateWeatherStation = `
INSERT INTO weatherSTations
VALUES()
ON CONFLICT DO UPDATE SET
;`;

exports.getPositionReports = `
SELECT * FROM positionReports
WHERE timeReceived > $time;`;

exports.getAllWeatherStations = "SELECT * FROM weatherStations;";
