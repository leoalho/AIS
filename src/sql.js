exports.updateVessels = `
INSERT INTO vessels (
    MMSI, messageType, callSign, shipname, shipType,
    to_bow, to_stern, to_port, to_starboard, epfd,
    ETAmonth, ETAday, ETAhour, ETAminute, draught,
    destination, dte, $timeReceived
  ) VALUES (
    $MMSI, $messageType, $callSign, $shipname, $shipType,
    $to_bow, $to_stern, $to_port, $to_starboard, $epfd,
    $ETAmonth, $ETAday, $ETAhour, $ETAminute, $draught,
    $destination, $dte, timeReceived
  )
  ON CONFLICT (MMSI)
  DO UPDATE SET
    messageType = excluded.messageType,
    callSign = excluded.callSign,
    shipname = excluded.shipname,
    shipType = excluded.shipType,
    to_bow = excluded.to_bow,
    to_stern = excluded.to_stern,
    to_port = excluded.to_port,
    to_starboard = excluded.to_starboard,
    epfd = excluded.epfd,
    ETAmonth = excluded.ETAmonth,
    ETAday = excluded.ETAday,
    ETAhour = excluded.ETAhour,
    ETAminute = excluded.ETAminute,
    draught = excluded.draught,
    destination = excluded.destination,
    dte = excluded.dte
    timeReceived = excluded.timeReceived;
`;

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

exports.updateBaseStation = `
INSERT INTO baseStationReports (
MMSI, messageType, year, month, day, hour, minute, second, accuracy, lon, lat, epfd, timeReceived)
VALUES ($MMSI, $messageType, $year, $month, $day, $hour, $minute, $second, $accuracy, $lon, $lat, $epfd, $timeReceived)
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
epfd = excluded.epfd,
timeReceived = excluded.timeReceived;`;

exports.updateWeatherBroadcast = `
INSERT INTO weatherBroadcasts (
    MMSI, messageType, dav, fid, lat,
    lon, day, hour, minute, temperature,
    wspeed, wgust, wdir, wgustdir,
    humidity, dewpoint, pressure, pressureTrend,
    visibility, seaState, stationId, stationName, timeReceived
  ) VALUES (
    $MMSI, $messageType, $dav, $fid, $lat,
    $lon, $day, $hour, $minute, $temperature,
    $wspeed, $wgust, $wdir, $wgustdir,
    $humidity, $dewpoint, $pressure, $pressureTrend,
    $visibility, $seaState, $stationId, $stationName, $timeReceived
  )
  ON CONFLICT (MMSI)
  DO UPDATE SET
    messageType = excluded.messageType,
    dav = excluded.dav,
    fid = excluded.fid,
    lat = excluded.lat,
    lon = excluded.lon,
    day = excluded.day,
    hour = excluded.hour,
    minute = excluded.minute,
    temperature = excluded.temperature,
    wspeed = excluded.wspeed,
    wgust = excluded.wgust,
    wdir = excluded.wdir,
    wgustdir = excluded.wgustdir,
    humidity = excluded.humidity,
    dewpoint = excluded.dewpoint,
    pressure = excluded.pressure,
    pressureTrend = excluded.pressureTrend,
    visibility = excluded.visibility,
    seaState = excluded.seaState,
    stationId = excluded.stationId,
    stationName = excluded.stationName
    timeReceived = excluded.timeReceived;
  `;

exports.updateBuoy = `
INSERT INTO buoys (
    MMSI, messageType, aidType, name, accuracy,
    lat, lon, to_bow, to_stern, to_port,
    to_starboard, epfd, second, off_position,
    regional, raim, virtual_aid, assigned, spare, timeReceived
  ) VALUES (
    $MMSI, $messageType, $aidType, $name, $accuracy,
    $lat, $lon, $to_bow, $to_stern, $to_port,
    $to_starboard, $epfd, $second, $off_position,
    $regional, $raim, $virtual_aid, $assigned, $spare, $timeReceived
  )
  ON CONFLICT (MMSI)
  DO UPDATE SET
    messageType = excluded.messageType,
    aidType = excluded.aidType,
    name = excluded.name,
    accuracy = excluded.accuracy,
    lat = excluded.lat,
    lon = excluded.lon,
    to_bow = excluded.to_bow,
    to_stern = excluded.to_stern,
    to_port = excluded.to_port,
    to_starboard = excluded.to_starboard,
    epfd = excluded.epfd,
    second = excluded.second,
    off_position = excluded.off_position,
    regional = excluded.regional,
    raim = excluded.raim,
    virtual_aid = excluded.virtual_aid,
    assigned = excluded.assigned,
    spare = excluded.spare
    timeReceived = excluded.timeReceived;
  `;

exports.getPositionReports = `
SELECT positionReports.*, vessels.shipName, vessels.callSign FROM positionReports
LEFT JOIN vessels ON positionReports.MMSI=vessels.MMSI
WHERE positionReports.timeReceived > $time;`;

exports.getBaseStations = "SELECT * FROM baseStationReports;";
exports.getWeatherStations = "SELECT * FROM weatherBroadcasts;";
exports.getBuoys = "SELECT * FROM buoys;";
