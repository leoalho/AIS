exports.updateVessels = `
INSERT INTO vessels (
    MMSI, messageType, callSign, shipname, shipType,
    to_bow, to_stern, to_port, to_starboard, epfd,
    ETAmonth, ETAday, ETAhour, ETAminute, draught,
    destination, dte
  ) VALUES (
    $MMSI, $messageType, $callSign, $shipname, $shipType,
    $to_bow, $to_stern, $to_port, $to_starboard, $epfd,
    $ETAmonth, $ETAday, $ETAhour, $ETAminute, $draught,
    $destination, $dte
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
    dte = excluded.dte;
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
INSERT INTO weatherBroadcasts (
    MMSI, messageType, dav, fid, lat,
    lon, day, hour, minute, temperature,
    wspeed, wgust, wdir, wgustdir,
    humidity, dewpoint, pressure, pressureTrend,
    visibility, seaState, stationId, stationName
  ) VALUES (
    $MMSI, $messageType, $dav, $fid, $lat,
    $lon, $day, $hour, $minute, $temperature,
    $wspeed, $wgust, $wdir, $wgustdir,
    $humidity, $dewpoint, $pressure, $pressureTrend,
    $visibility, $seaState, $stationId, $stationName
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
    stationName = excluded.stationName;
  `;

exports.updateBuoyTable = `
INSERT INTO buoys (
    MMSI, messageType, aidType, name, accuracy,
    lat, lon, to_bow, to_stern, to_port,
    to_starboard, epfd, second, off_position,
    regional, raim, virtual_aid, assigned, spare
  ) VALUES (
    $MMSI, $messageType, $aidType, $name, $accuracy,
    $lat, $lon, $to_bow, $to_stern, $to_port,
    $to_starboard, $epfd, $second, $off_position,
    $regional, $raim, $virtual_aid, $assigned, $spare
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
    spare = excluded.spare;
  `;

exports.getPositionReports = `
SELECT * FROM positionReports
WHERE timeReceived > $time;`;

exports.getAllWeatherStations = "SELECT * FROM weatherStations;";
