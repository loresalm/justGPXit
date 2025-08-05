// Waypoint object model, array management, unique ID, type classification, and sidebar UI

// Waypoint types: 'start', 'waypoint', 'end'
function Waypoint({ id, lat, lng, type }) {
    this.id = id; // unique string
    this.lat = lat;
    this.lng = lng;
    this.type = type; // 'start', 'waypoint', 'end'
}

function WaypointManager(sidebarSelector) {
    this.waypoints = [];
    this.nextId = 1;
    this.sidebar = document.querySelector(sidebarSelector || '#waypoints-list');
    this.onChange = function () {};
}

WaypointManager.prototype.setOnChange = function (cb) { this.onChange = cb; };

WaypointManager.prototype.add = function (lat, lng) {
    var type = this._getType(this.waypoints.length);
    var wp = new Waypoint({ id: 'wp-' + this.nextId++, lat: lat, lng: lng, type: type });
    this.waypoints.push(wp);
    this._updateTypes();
    this.render();
    this.onChange(this.waypoints);
    return wp;
};

WaypointManager.prototype.remove = function (id) {
    this.waypoints = this.waypoints.filter(function (wp) { return wp.id !== id; });
    this._updateTypes();
    this.render();
    this.onChange(this.waypoints);
};

WaypointManager.prototype.reorder = function (fromIdx, toIdx) {
    var moved = this.waypoints.splice(fromIdx, 1)[0];
    this.waypoints.splice(toIdx, 0, moved);
    this._updateTypes();
    this.render();
    this.onChange(this.waypoints);
};

WaypointManager.prototype._getType = function (idx) {
    if (idx === 0) return 'start';
    if (idx === this.waypoints.length - 1) return 'end';
    return 'waypoint';
};

WaypointManager.prototype._updateTypes = function () {
    var self = this;
    this.waypoints.forEach(function (wp, i) {
        wp.type = (i === 0) ? 'start' : (i === self.waypoints.length - 1 ? 'end' : 'waypoint');
    });
};

WaypointManager.prototype.render = function () {
    if (!this.sidebar) return;
    this.sidebar.innerHTML = '';
    if (this.waypoints.length === 0) {
        this.sidebar.innerHTML = '<div class="empty-state"><p>Click on the map to add waypoints</p><small>Start planning your route by clicking anywhere on the map</small></div>';
        return;
    }
    var ul = document.createElement('ul');
    ul.className = 'waypoint-list';
    var self = this;
    this.waypoints.forEach(function (wp, i) {
        var li = document.createElement('li');
        li.className = 'waypoint-item ' + wp.type;
        li.setAttribute('draggable', 'true');
        li.dataset.id = wp.id;
        li.innerHTML =
            '<span class="waypoint-type">' + (wp.type.charAt(0).toUpperCase() + wp.type.slice(1)) + '</span>' +
            '<span class="waypoint-coords">' + wp.lat.toFixed(5) + ', ' + wp.lng.toFixed(5) + '</span>' +
            '<button class="waypoint-delete" title="Delete">&times;</button>';
        // Delete button
        li.querySelector('.waypoint-delete').onclick = function () { self.remove(wp.id); };
        // Drag events
        li.ondragstart = function (e) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', i);
            li.classList.add('dragging');
        };
        li.ondragend = function () { li.classList.remove('dragging'); };
        li.ondragover = function (e) { e.preventDefault(); li.classList.add('dragover'); };
        li.ondragleave = function () { li.classList.remove('dragover'); };
        li.ondrop = function (e) {
            e.preventDefault();
            li.classList.remove('dragover');
            var fromIdx = +e.dataTransfer.getData('text/plain');
            var toIdx = i;
            if (fromIdx !== toIdx) self.reorder(fromIdx, toIdx);
        };
        ul.appendChild(li);
    });
    this.sidebar.appendChild(ul);
};

WaypointManager.prototype.getAll = function () { return this.waypoints.slice(); };
WaypointManager.prototype.getById = function (id) { return this.waypoints.find(function (wp) { return wp.id === id; }); };
WaypointManager.prototype.clear = function () { this.waypoints = []; this.render(); this.onChange(this.waypoints); };

// Make available globally
window.Waypoint = Waypoint;
window.WaypointManager = WaypointManager;
