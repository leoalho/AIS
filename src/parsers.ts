import { Binary } from "mongodb";
import {
  messageType,
  navStatus,
  navAid,
  epfd,
  beaufort1,
  beaufort2,
  precipitation,
  sixBitAscii,
  weatherStation,
} from "./consts";
import {
  BaseStationQuery,
  BinaryBroadcast,
  BuoyQuery,
  Message,
  MessageQuery,
  PositionReport,
  PositionReportQuery,
  VoyageData,
  VoyageDataQuery,
  WeatherReportQuery,
} from "./types";

function toSixBits(char: string): string {
  let bits = "000000";
  let AsciiCode = char.charCodeAt(0) - 48;
  if (AsciiCode > 40) {
    AsciiCode -= 8;
  }
  bits += AsciiCode.toString(2);
  bits = bits.slice(-6);
  return bits;
}

function toSixBitArray(message: string): string {
  let sixBitMessage = "";
  // console.log('Payload length: '+message.length);
  for (let i = 0; i < message.length; i++) {
    sixBitMessage += toSixBits(message[i]);
  }
  return sixBitMessage;
}

function changeBits(message: string): string {
  let changed = "";
  for (let i = 0; i < message.length; i++) {
    if (message[i] == "0") {
      changed += 1;
    } else {
      changed += 0;
    }
  }
  return changed;
}

function getCoord(coord: string): number {
  if (parseInt(coord[0]) == 0) {
    return parseInt(coord.slice(1), 2) / 600000.0;
  } else {
    return -parseInt(changeBits(coord.slice(1)), 2) / 600000.0;
  }
}

function rateOfTurn(value: string): number {
  let rot = parseInt(value.slice(1), 2);
  rot = rot / 4.733;
  rot = rot * rot;
  if (parseInt(value[0]) == 1) {
    rot -= 128;
  }
  return rot;
}

function parseToText(message: string): string {
  let sign = "";
  let messageLength = message.length / 6;
  for (let i = 0; i < messageLength; i++) {
    sign += sixBitAscii[parseInt(message.slice(i * 6, i * 6 + 6), 2)];
  }
  let neatSign = sign.replace(/\s+/g, "");
  neatSign = neatSign.replaceAll("@", "");
  return neatSign;
}

function parsePositionReport(payload: string): PositionReportQuery {
  return {
    $messageType: parseInt(payload.slice(0, 6), 2),
    $MMSI: parseInt(payload.slice(8, 38), 2),
    $navStatus: navStatus[parseInt(payload.slice(38, 42), 2)],
    $ROT: rateOfTurn(payload.slice(42, 50)),
    $SOG: parseInt(payload.slice(50, 60), 2) / 10,
    $accuracy: parseInt(payload.slice(60, 61), 2),
    $lon: getCoord(payload.slice(61, 89)),
    $lat: getCoord(payload.slice(89, 116)),
    $COG: parseInt(payload.slice(116, 128), 2) / 10,
    $HDG: parseInt(payload.slice(128, 137), 2),
    $timestamp: parseInt(payload.slice(137, 143), 2),
    $timeReceived: new Date().getTime(),
  };
}

function parseBaseStationReport(payload: string): BaseStationQuery {
  return {
    $timeReceived: new Date().getTime(),
    $messageType: parseInt(payload.slice(0, 6), 2),
    $MMSI: parseInt(payload.slice(8, 38), 2),
    $year: parseInt(payload.slice(38, 52), 2),
    $month: parseInt(payload.slice(53, 56), 2),
    $day: parseInt(payload.slice(56, 61), 2),
    $hour: parseInt(payload.slice(61, 66), 2),
    $minute: parseInt(payload.slice(66, 72), 2),
    $second: parseInt(payload.slice(73, 78), 2),
    $accuracy: parseInt(payload.slice(78, 79), 2),
    $lon: getCoord(payload.slice(79, 107)),
    $lat: getCoord(payload.slice(107, 134)),
    $epfd: epfd[parseInt(payload.slice(134, 138), 2)],
  };
}

function parseVoyageRelatedData(payload: string): VoyageDataQuery {
  return {
    $timeReceived: new Date().getTime(),
    $messageType: parseInt(payload.slice(0, 6), 2),
    $MMSI: parseInt(payload.slice(8, 38), 2),
    $AISversion: parseInt(payload.slice(38, 40), 2),
    $IMO: parseInt(payload.slice(40, 70), 2),
    $callSign: parseToText(payload.slice(70, 112)),
    $shipname: parseToText(payload.slice(112, 232)),
    $shipType: parseInt(payload.slice(232, 240), 2),
    $to_bow: parseInt(payload.slice(240, 249), 2),
    $to_stern: parseInt(payload.slice(249, 258), 2),
    $to_port: parseInt(payload.slice(258, 264), 2),
    $to_starboard: parseInt(payload.slice(264, 270), 2),
    $epfd: epfd[parseInt(payload.slice(270, 274), 2)],
    $ETAmonth: parseInt(payload.slice(274, 278), 2),
    $ETAday: parseInt(payload.slice(278, 283), 2),
    $ETAhour: parseInt(payload.slice(283, 288), 2),
    $ETAminute: parseInt(payload.slice(288, 294), 2),
    $draught: parseInt(payload.slice(294, 302), 2) / 10,
    $destination: parseToText(payload.slice(302, 422)),
    $dte: parseInt(payload.slice(422, 423), 2),
  };
}

function parseBinaryBroadcast(payload: string) {
  let report: BinaryBroadcast = {
    $timeReceived: new Date().getTime(),
    $messageType: parseInt(payload.slice(0, 6), 2),
    $messageType1: messageType[parseInt(payload.slice(0, 6), 2) - 1],
    $MMSI: parseInt(payload.slice(8, 38), 2),
    $dac: parseInt(payload.slice(40, 50), 2),
    $fid: parseInt(payload.slice(50, 56), 2),
  };
  if (report.$dac == 1 && report.$fid == 11) {
    let seaState = parseInt(payload.slice(318, 322), 2);
    let weatherReport: WeatherReportQuery = {
      ...report,
      $lat: getCoord(payload.slice(56, 80)) * 10,
      $lon: getCoord(payload.slice(80, 105)) * 10,
      $day: parseInt(payload.slice(105, 110), 2),
      $hour: parseInt(payload.slice(110, 115), 2),
      $minute: parseInt(payload.slice(115, 121), 2),
      $wspeed: parseInt(payload.slice(121, 128), 2),
      $wgust: parseInt(payload.slice(128, 135), 2),
      $wdir: parseInt(payload.slice(135, 144), 2),
      $wgustdir: parseInt(payload.slice(144, 153), 2),
      $temperature: (parseInt(payload.slice(153, 164), 2) - 600) / 10,
      $humidity: parseInt(payload.slice(164, 171), 2),
      $dewpoint: parseInt(payload.slice(171, 181), 2),
      $pressure: parseInt(payload.slice(181, 190), 2) + 800,
      $pressureTrend: parseInt(payload.slice(190, 192), 2), //add array
      $visibility: parseInt(payload.slice(192, 200), 2) / 10,
      $waterlevel: parseInt(payload.slice(200, 209), 2), //fix this
      $leveltrend: parseInt(payload.slice(209, 211), 2), // add array
      $cspeed: parseInt(payload.slice(211, 219), 2),
      $cdir: parseInt(payload.slice(219, 228), 2),
      $cspeed2: parseInt(payload.slice(228, 236), 2) / 10,
      $cdir2: parseInt(payload.slice(236, 245), 2),
      $cdepth2: parseInt(payload.slice(245, 250), 2) / 10,
      $cspeed3: parseInt(payload.slice(250, 258), 2) / 10,
      $cdir3: parseInt(payload.slice(258, 267), 2) / 10,
      $cdepth3: parseInt(payload.slice(267, 272), 2) / 10,
      $waveHeight: parseInt(payload.slice(272, 280), 2) / 10,
      $wavePeriod: parseInt(payload.slice(280, 286), 2),
      $waveDirection: parseInt(payload.slice(286, 295), 2),
      $swellHeight: parseInt(payload.slice(295, 303), 2) / 10,
      $swellPeriod: parseInt(payload.slice(303, 309), 2),
      $swellDir: parseInt(payload.slice(309, 318), 2),
      $seaState: beaufort1[seaState] + " (" + beaufort2[seaState] + ")",
      $waterTemp: (parseInt(payload.slice(322, 332), 2) - 100) / 10,
      $precipitation: precipitation[parseInt(payload.slice(332, 335), 2)], //fix this
      $salinity: parseInt(payload.slice(335, 344), 2),
      $ice: parseInt(payload.slice(344, 346), 2), //fix this
    };
    for (let i = 0; i < weatherStation.length; i++) {
      let station = weatherStation[i];
      if (
        weatherReport.$lon > station.lon1 &&
        weatherReport.$lon < station.lon2 &&
        weatherReport.$lat > station.lat1 &&
        weatherReport.$lat < station.lat2
      ) {
        weatherReport.$stationId = station.id;
        weatherReport.$stationName = station.name;
      }
    }
    return weatherReport;
  }
  //console.log("This type of binary broadcast not yet fully supported");
  return report;
}

function parseAidToNavigation(payload: string): BuoyQuery {
  const report = {
    $timeReceived: new Date().getTime(),
    $messageType: parseInt(payload.slice(0, 6), 2),
    $messageType1: messageType[parseInt(payload.slice(0, 6), 2) - 1],
    $MMSI: parseInt(payload.slice(8, 38), 2),
    $aidType: navAid[parseInt(payload.slice(38, 43), 2)],
    $name: parseToText(payload.slice(43, 163)),
    $accuracy: parseInt(payload.slice(163, 164), 2),
    $lon: getCoord(payload.slice(164, 192)),
    $lat: getCoord(payload.slice(192, 219)),
    $to_bow: parseInt(payload.slice(219, 228), 2),
    $to_stern: parseInt(payload.slice(228, 237), 2),
    $to_port: parseInt(payload.slice(237, 243), 2),
    $to_starboard: parseInt(payload.slice(243, 249), 2),
    $epfd: epfd[parseInt(payload.slice(249, 253), 2)],
    $second: parseInt(payload.slice(253, 259), 2),
    $off_position: parseInt(payload.slice(259, 260), 2),
    $regional: parseInt(payload.slice(260, 268), 2),
    $raim: parseInt(payload.slice(268, 269), 2),
    $virtual_aid: parseInt(payload.slice(269, 270), 2),
    $assigned: parseInt(payload.slice(270, 271), 2),
    $spare: parseInt(payload.slice(271, 272), 2),
    $nameExtension: parseInt(payload.slice(272, 360), 2),
  };
  if (report.$name.length == 20) {
    report.$name = report.$name + report.$nameExtension;
  }
  return report;
}

const parsers = {
  1: parsePositionReport,
  2: parsePositionReport,
  3: parsePositionReport,
  4: parseBaseStationReport,
  5: parseVoyageRelatedData,
  8: parseBinaryBroadcast,
  21: parseAidToNavigation,
};

var multipartMessage: string[] = [];

export function parseMessage(message: string): MessageQuery | void {
  message = String(message);
  let messageArray = message.split(",");
  // console.log('Received AIS-message: ' + messageArray);
  if (message.slice(0, 2) != "!A" || messageArray.length == 1) {
    //console.log("XXX"+message+"XXX");
    //console.log("Error parsing data, possibly not a proper NMEA AIS message.");
    return;
  }
  if (parseInt(messageArray[1]) > 1) {
    if (parseInt(messageArray[2]) == 1) {
      multipartMessage = messageArray;
      //console.log("Received first part of a multipart message ... awaiting next parts")
      return;
    } else if (multipartMessage[3] == messageArray[3]) {
      messageArray[5] = multipartMessage[5] + messageArray[5];
      // console.log(messageArray[5]);
      multipartMessage = [];
    } else {
      //console.log("Did not find earlier messages with same id")
      return;
    }
  }
  let payload = messageArray[5];
  let bitPayload = toSixBitArray(payload);
  // console.log('Binary payload: '+bitPayload);
  let type = parseInt(bitPayload.slice(0, 6), 2);
  // console.log('Message type: '+type+' ('+messageType[type-1]+')');
  if (!parsers[type as keyof typeof parsers]) {
    console.log("Message type not yet supported :(");
    return;
  } else {
    let parsedPayload = parsers[type as keyof typeof parsers](bitPayload);
    //console.log(parsedPayload);
    parsedPayload.$timeReceived = new Date().getTime();
    return parsedPayload;
  }
}
