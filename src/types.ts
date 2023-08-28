export type VoyageDataQuery = {
  $MMSI: number;
  $messageType: number;
  $callSign: string;
  $shipname: string;
  $shipType: number;
  $to_bow: number;
  $to_stern: number;
  $to_port: number;
  $to_starboard: number;
  $epfd: string;
  $ETAmonth: number;
  $ETAday: number;
  $ETAhour: number;
  $ETAminute: number;
  $draught: number;
  $destination: string;
  $dte: number;
  $timeReceived: number;
  $AISversion: number;
  $IMO: number;
};

export type VoyageData = {
  MMSI: number;
  messageType: number;
  messageType1: string;
  callSign: string;
  shipname: string;
  shipType: number;
  to_bow: number;
  to_stern: number;
  to_port: number;
  to_starboard: number;
  epfd: string;
  ETAmonth: number;
  ETAday: number;
  ETAhour: number;
  ETAminute: number;
  draught: number;
  destination: string;
  dte: number;
  timeReceived: number;
  AISversion: number;
  IMO: number;
};

export type PositionReportQuery = {
  $messageType: number;
  $MMSI: number;
  $navStatus: string;
  $ROT: number;
  $SOG: number;
  $accuracy: number;
  $lon: number;
  $lat: number;
  $COG: number;
  $HDG: number;
  $timestamp: number;
  $timeReceived: number;
};

export type PositionReport = {
  messageType: number;
  MMSI: number;
  navStatus: string;
  ROT: number;
  SOG: number;
  accuracy: number;
  lon: number;
  lat: number;
  COG: number;
  HDG: number;
  timestamp: number;
  timeReceived: number;
  shipName?: string;
  callSign?: string;
};

export interface BinaryBroadcast {
  $MMSI: number;
  $messageType: number;
  $messageType1: string;
  $dac: number;
  $fid: number;
  $timeReceived: number;
}

export interface WeatherReportQuery extends BinaryBroadcast {
  $lat: number;
  $lon: number;
  $day: number;
  $hour: number;
  $minute: number;
  $wspeed: number;
  $wgust: number;
  $wdir: number;
  $wgustdir: number;
  $temperature: number;
  $humidity: number;
  $dewpoint: number;
  $pressure: number;
  $pressureTrend: number;
  $visibility: number;
  $waterlevel: number;
  $leveltrend: number;
  $cspeed: number;
  $cdir: number;
  $cspeed2: number;
  $cdir2: number;
  $cdepth2: number;
  $cspeed3: number;
  $cdir3: number;
  $cdepth3: number;
  $waveHeight: number;
  $wavePeriod: number;
  $waveDirection: number;
  $swellHeight: number;
  $swellPeriod: number;
  $swellDir: number;
  $seaState: string;
  $waterTemp: number;
  $precipitation: string;
  $salinity: number;
  $ice: number;
  $stationId?: number;
  $stationName?: string;
}

export interface WeatherReport extends BinaryBroadcast {}

export type Buoy = {
  MMSI: number;
  messageType: number;
  aidType: string;
  name: string;
  accuracy: number;
  lat: number;
  lon: number;
  to_bow: number;
  to_stern: number;
  to_port: number;
  to_starboard: number;
  epfd: string;
  second: number;
  off_position: number;
  regional: number;
  raim: number;
  virtual_aid: number;
  assigned: number;
  spare: number;
  timeReceived: number;
};

export type BuoyQuery = {
  $MMSI: number;
  $messageType: number;
  $aidType: string;
  $name: string;
  $accuracy: number;
  $lat: number;
  $lon: number;
  $to_bow: number;
  $to_stern: number;
  $to_port: number;
  $to_starboard: number;
  $epfd: string;
  $second: number;
  $off_position: number;
  $regional: number;
  $raim: number;
  $virtual_aid: number;
  $assigned: number;
  $spare: number;
  $timeReceived: number;
};

export type BaseStation = {
  messageType: number;
  MMSI: number;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  accuracy: number;
  lon: number;
  lat: number;
  epfd: string;
};

export type BaseStationQuery = {
  $timeReceived: number;
  $messageType: number;
  $MMSI: number;
  $year: number;
  $month: number;
  $day: number;
  $hour: number;
  $minute: number;
  $second: number;
  $accuracy: number;
  $lon: number;
  $lat: number;
  $epfd: string;
};

export type Message =
  | VoyageData
  | PositionReport
  | WeatherReport
  | Buoy
  | BaseStation;

export type MessageQuery =
  | VoyageDataQuery
  | PositionReportQuery
  | BinaryBroadcast
  | WeatherReportQuery
  | BuoyQuery
  | BaseStationQuery;
