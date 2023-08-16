var socket = io();
import { icons } from "./icons.js";
//import { RotatedMarker } from "./rotatedMarker.js";
import { createPopup } from "./popups.js";
// initialize Leaflet
var map = L.map("map").setView({ lon: 24.4391, lat: 60.05 }, 10);

L.RotatedMarker = L.Marker.extend({
  options: {
    rotationAngle: 0,
    rotationOrigin: "",
  },

  initialize: function (latlng, options) {
    L.Marker.prototype.initialize.call(this);

    L.Util.setOptions(this, options);
    this._latlng = L.latLng(latlng);

    var iconOptions = this.options.icon && this.options.icon.options;
    var iconAnchor = iconOptions && this.options.icon.options.iconAnchor;
    if (iconAnchor) {
      iconAnchor = iconAnchor[0] + "px " + iconAnchor[1] + "px";
    }

    this.options.rotationOrigin =
      this.options.rotationOrigin || iconAnchor || "center bottom";
    this.options.rotationAngle = this.options.rotationAngle || 0;

    // Ensure marker keeps rotated during dragging
    this.on("drag", function (e) {
      e.target._applyRotation();
    });
  },

  onRemove: function (map) {
    L.Marker.prototype.onRemove.call(this, map);
  },

  _setPos: function (pos) {
    L.Marker.prototype._setPos.call(this, pos);
    this._applyRotation();
  },

  _applyRotation: function () {
    if (this.options.rotationAngle) {
      this._icon.style[L.DomUtil.TRANSFORM + "Origin"] =
        this.options.rotationOrigin;

      this._icon.style[L.DomUtil.TRANSFORM] +=
        " rotateZ(" + this.options.rotationAngle + "deg)";
    }
  },

  setRotationAngle: function (angle) {
    this.options.rotationAngle = angle;
    this.update();
    return this;
  },

  setRotationOrigin: function (origin) {
    this.options.rotationOrigin = origin;
    this.update();
    return this;
  },
});

L.rotatedMarker = function (latlng, options) {
  return new L.RotatedMarker(latlng, options);
};

// add the OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
}).addTo(map);

// show the scale bar on the lower left corner
L.control.scale({ metric: true }).addTo(map);

var vessels = [];
var markersLayer = new L.LayerGroup();
markersLayer.addTo(map);

function drawAllVessels() {
  markersLayer.clearLayers();
  vessels.forEach((vessel) => {
    let popup = createPopup(vessel);
    let rotation = 0;
    if (vessel.HDG) {
      rotation = vessel.HDG;
    }
    let marker;
    if (icons[vessel.messageType]) {
      marker = L.rotatedMarker(
        { lon: vessel.lon, lat: vessel.lat },
        {
          icon: icons[vessel.messageType],
          rotationAngle: rotation,
          rotationOrigin: "center",
        }
      );
    } else {
      marker = L.rotatedMarker(
        { lon: vessel.lon, lat: vessel.lat },
        { rotationAngle: rotation, rotationOrigin: "center" }
      );
    }

    marker.bindPopup(popup);
    markersLayer.addLayer(marker);
  });
}

socket.on("newVessels", (newVessels) => {
  vessels = JSON.parse(newVessels);
  drawAllVessels();
});
