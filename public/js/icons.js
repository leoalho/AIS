var boatIcon = L.icon({
    iconUrl: '../images/boat.png',
    iconSize:     [16, 40], // size of the icon
    iconAnchor:   [8, 20] // point of the icon which will correspond to marker's location
});

var buoyIcon = L.icon({
	iconUrl: '../images/redcircle.png',
	iconSize: [25,25],
	iconAnchor: [12,12]
})

var StationIcon = L.icon({
	iconUrl: '../images/greencircle.png',
	iconSize: [25,25],
	iconAnchor: [12,12]
})

var weatherIcon = L.icon({
	iconUrl: '../images/bluecircle.png',
	iconSize: [25,25],
	iconAnchor: [12,12]
})

export var icons = {
	1 : boatIcon,
	2 : boatIcon,
	3 : boatIcon,
	4 : StationIcon,
	8 : weatherIcon,
	21 : buoyIcon
}