function positionReport(vessel) {
  let popupText = "";
  if (vessel.shipname) {
    popupText += "Name: " + vessel.shipname + "<br>";
  }
  popupText +=
    "MMSI: " +
    vessel.MMSI +
    "<br>" +
    "Location: " +
    vessel.lat.toFixed(4) +
    " N, " +
    vessel.lon.toFixed(4) +
    " E<br>" +
    "Navigational status: " +
    vessel.navStatus +
    "<br>" +
    "Speed over ground: " +
    vessel.SOG +
    " knots<br>" +
    "Heading: " +
    vessel.HDG +
    "°<br>" +
    "Rate of Turn: " +
    vessel.ROT +
    "°/min<br>" +
    "Course over ground: " +
    vessel.COG +
    "°<br>" +
    "Time Received: " +
    new Date(vessel.timeReceived).toUTCString();

  return popupText;
}

function baseStationReport(vessel) {
  let popupText =
    "<b><u>Base Station</u></b><br> MMSI: " +
    vessel.MMSI +
    "<br>" +
    "Location: " +
    vessel.lat.toFixed(4) +
    " N, " +
    vessel.lon.toFixed(4) +
    " E<br>" +
    "Time Received: " +
    new Date(vessel.timeReceived).toUTCString();

  return popupText;
}

function AidToNavigation(vessel) {
  let popupText =
    "Name: " +
    vessel.name +
    "<br>" +
    "Aid Type: " +
    vessel.aidType +
    "<br>" +
    "MMSI: " +
    vessel.MMSI +
    "<br>" +
    "Location: " +
    vessel.lat.toFixed(4) +
    " N, " +
    vessel.lon.toFixed(4) +
    " E<br>" +
    "Time Received: " +
    new Date(vessel.timeReceived).toUTCString();

  return popupText;
}

function weatherReport(vessel) {
  let popupText =
    "Name: " +
    vessel.stationName +
    "<br>" +
    "MMSI: " +
    vessel.MMSI +
    "<br>" +
    "Location: " +
    vessel.lat.toFixed(4) +
    " N, " +
    vessel.lon.toFixed(4) +
    " E<br>" +
    "Air temperature: " +
    vessel.temperature +
    " °C<br>" +
    "10-min avg wind speed: " +
    vessel.wspeed +
    " knots <br>" +
    "10-min top wind speed: " +
    vessel.wgust +
    " knots <br>" +
    "Wind direction: " +
    vessel.wdir +
    " °<br>" +
    "Air pressure: " +
    vessel.pressure +
    " hPa<br>" +
    //+ "Sea state: "+vessel.seaState+"<br>"
    //+ "Water temperature: "+vessel.waterTemp+"<br>"
    //+ "Wave height: "+vessel.waveHeight+ " m<br>"
    "Precipitation: " +
    vessel.precipitation +
    "<br>" +
    "Time Received: " +
    new Date(vessel.timeReceived).toUTCString();
  return popupText;
}

var popups = {
  1: positionReport,
  2: positionReport,
  3: positionReport,
  4: baseStationReport,
  8: weatherReport,
  21: AidToNavigation,
};

export function createPopup(vessel) {
  let popup;
  if (popups[vessel.messageType]) {
    popup = L.popup().setContent(popups[vessel.messageType](vessel));
  } else {
    popup = L.popup().setContent(JSON.stringify(vessel, null, "<br>"));
  }
  return popup;
}
