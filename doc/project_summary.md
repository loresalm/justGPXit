# BikeRoute Planner - Project Summary

## Overview
A web-based bike route planning application that allows users to create, edit, and export GPX files for cycling routes. The app provides an intuitive map interface with drag-and-drop waypoint management and route visualization.

## Key Features

### Core Functionality
- **Interactive Map**: Pan, zoom, and navigate using Leaflet.js with OpenStreetMap tiles
- **Route Planning**: Create new routes or load existing GPX files
- **Waypoint Management**: Add start/end points and intermediate waypoints
- **Round Trip Support**: Option to create circular routes
- **Route Optimization**: Uses OpenRouteService API for bike-optimized routing

### User Interface
- **Drag & Drop Waypoints**: Reorder waypoints in the sidebar
- **Route Visualization**: Clear route lines with directional arrows
- **Elevation Profile**: Interactive chart showing route elevation changes
- **Route Statistics**: Distance, elevation gain/loss, and estimated time
- **Direction Inversion**: Reverse route direction with one click

### Import/Export
- **GPX Import**: Load existing routes from GPX files
- **GPX Export**: Save routes with custom naming
- **Route Modification**: Edit imported routes by adding waypoints

## Technical Stack

### Frontend Technologies
- **HTML5/CSS3**: Modern responsive design
- **Vanilla JavaScript**: No heavy frameworks, lightweight and fast
- **Leaflet.js**: Interactive mapping library
- **Chart.js**: Elevation profile visualization

### APIs & Services
- **OpenStreetMap**: Free map tiles
- **OpenRouteService**: Free routing API (5000 requests/day)
- **GitHub Pages**: Free hosting platform

### File Structure
```
├── index.html          # Main application page
├── css/
│   └── style.css      # Application styling
├── js/
│   ├── app.js         # Main application logic
│   ├── map.js         # Map and routing functionality
│   ├── waypoints.js   # Waypoint management
│   ├── gpx.js         # GPX import/export
│   └── utils.js       # Utility functions
└── README.md          # Documentation
```

## Architecture

### Modular Design
- **Separation of Concerns**: Each JavaScript file handles specific functionality
- **Event-Driven**: Components communicate through custom events
- **State Management**: Centralized route state with reactive updates
- **API Abstraction**: Routing service abstracted for easy provider switching

### Key Components
1. **MapManager**: Handles map initialization, markers, and route display
2. **WaypointManager**: Manages waypoint creation, ordering, and UI
3. **RouteCalculator**: Interfaces with routing APIs
4. **GPXHandler**: Parses and generates GPX files
5. **ElevationChart**: Creates and updates elevation profiles

## Deployment
The application is designed for GitHub Pages deployment with no build process required. Simply push to a repository and enable GitHub Pages to go live.