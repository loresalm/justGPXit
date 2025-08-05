// Map and routing functionality for justGPXit
// Implements: map init, OSM tiles, view/zoom, waypoint creation, marker icons, drag, popups

// Waypoint icon colors
const ICONS = {
    start: L.icon({
        iconUrl: 'assets/marker-icon-2x-green.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
    }),
    end: L.icon({
        iconUrl: 'assets/marker-icon-2x-red.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
    }),
    waypoint: L.icon({
        iconUrl: 'assets/marker-icon-2x-blue.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
    })
};

let map, waypoints = [], markers = [], selectedMarkerIdx = null;

function updateMarkerIcons() {
    markers.forEach((marker, i) => {
        if (i === 0) marker.setIcon(ICONS.start);
        else if (i === markers.length - 1) marker.setIcon(ICONS.end);
        else marker.setIcon(ICONS.waypoint);
    });
}

function removeWaypoint(idx) {
    if (markers[idx]) {
        map.removeLayer(markers[idx]);
        markers.splice(idx, 1);
        waypoints.splice(idx, 1);
        updateMarkerIcons();
    }
}

function addWaypoint(latlng) {
    waypoints.push(latlng);
    const idx = waypoints.length - 1;
    const marker = L.marker(latlng, {
        draggable: true,
        icon: idx === 0 ? ICONS.start : (idx === waypoints.length - 1 ? ICONS.end : ICONS.waypoint)
    }).addTo(map);
    marker.on('dragend', function (e) {
        waypoints[idx] = e.target.getLatLng();
        marker.setLatLng(waypoints[idx]);
        // Optionally: trigger route recalculation
    });
    marker.on('click', function () {
        selectedMarkerIdx = idx;
        marker.bindPopup(
            `<b>Waypoint ${idx + 1}</b><br>Lat: ${latlng.lat.toFixed(5)}<br>Lng: ${latlng.lng.toFixed(5)}<br><button id='delete-waypoint-btn'>Delete</button>`
        ).openPopup();
        setTimeout(() => {
            const btn = document.getElementById('delete-waypoint-btn');
            if (btn) {
                btn.onclick = function (e) {
                    e.stopPropagation();
                    removeWaypoint(idx);
                    map.closePopup();
                };
            }
        }, 0);
    });
    markers.push(marker);
    updateMarkerIcons();
}

document.addEventListener('DOMContentLoaded', function () {
    map = L.map('map', {
        zoomControl: true
    }).setView([45.4642, 9.19], 13); // Milan, Italy

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Hide the loading overlay if present
    var loading = document.getElementById('map-loading');
    if (loading) loading.classList.add('hidden');

    // Map click handler: add waypoint
    map.on('click', function (e) {
        addWaypoint(e.latlng);
    });

    // Keyboard delete handler
    document.addEventListener('keydown', function (e) {
        if ((e.key === 'Delete' || e.key === 'Backspace') && selectedMarkerIdx !== null) {
            removeWaypoint(selectedMarkerIdx);
            map.closePopup();
            selectedMarkerIdx = null;
        }
    });

    // Expose for debugging
    window._justGPXitMap = map;
    window._justGPXitWaypoints = waypoints;
});
