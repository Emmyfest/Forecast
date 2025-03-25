/**
 * Weather map functionality
 */

const WeatherMap = {
    /**
     * Leaflet map instance
     */
    map: null,
    
    /**
     * Current weather overlay
     */
    currentOverlay: null,
    
    /**
     * Current map type
     */
    currentMapType: 'precipitation',
    
    /**
     * Whether the map is in fullscreen mode
     */
    isFullscreen: false,
    
    /**
     * Initialize the weather map
     */
    init: function() {
        this.initMap();
        this.setupMapControls();
    },
    
    /**
     * Initialize the Leaflet map
     */
    initMap: function() {
        const mapContainer = document.getElementById('weather-map');
        if (!mapContainer) return;
        
        // Check if Leaflet is loaded
        if (typeof L === 'undefined') {
            mapContainer.innerHTML = `
                <div class="map-loading">
                    <i class="ri-map-2-line"></i>
                    <p>Loading map...</p>
                </div>
            `;
            return;
        }
        
        // Initialize the map
        this.map = L.map(mapContainer).setView([41.878, -93.097], 7); // Iowa coordinates
        
        // Add base tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        
        // Add demo farm marker
        L.marker([41.9, -93.5]).addTo(this.map)
            .bindPopup('Heartland Farm')
            .openPopup();
        
        // Add initial weather overlay
        this.updateWeatherOverlay(this.currentMapType);
    },
    
    /**
     * Set up map controls
     */
    setupMapControls: function() {
        const mapTypeButtons = document.querySelectorAll('[data-map-type]');
        const fullscreenButton = document.getElementById('toggle-fullscreen');
        
        // Map type buttons
        mapTypeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const mapType = button.getAttribute('data-map-type');
                this.changeMapType(mapType);
                
                // Update active button
                mapTypeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
        
        // Fullscreen toggle
        if (fullscreenButton) {
            fullscreenButton.addEventListener('click', this.toggleFullscreen.bind(this));
        }
    },
    
    /**
     * Change the map type and update overlay
     * @param {string} mapType - The map type
     */
    changeMapType: function(mapType) {
        this.currentMapType = mapType;
        this.updateWeatherOverlay(mapType);
    },
    
    /**
     * Update the weather overlay based on map type
     * @param {string} type - The map type
     */
    updateWeatherOverlay: function(type) {
        if (!this.map) return;
        
        // Remove existing overlay
        if (this.currentOverlay) {
            this.map.removeLayer(this.currentOverlay);
            this.currentOverlay = null;
        }
        
        // Create new overlay based on type
        let overlay;
        
        switch (type) {
            case 'precipitation':
                overlay = L.rectangle([[40, -95], [43, -91]], {
                    color: '#1976D2',
                    fillOpacity: 0.3,
                    weight: 1
                });
                break;
                
            case 'temperature':
                overlay = L.rectangle([[40, -95], [43, -91]], {
                    color: '#F59E0B',
                    fillOpacity: 0.3,
                    weight: 1
                });
                break;
                
            case 'wind':
                overlay = L.rectangle([[40, -95], [43, -91]], {
                    color: '#10B981',
                    fillOpacity: 0.3,
                    weight: 1
                });
                break;
                
            default:
                break;
        }
        
        // Add overlay to map
        if (overlay) {
            overlay.addTo(this.map);
            this.currentOverlay = overlay;
        }
    },
    
    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen: function() {
        const mapCard = document.getElementById('weather-map-card');
        const button = document.getElementById('toggle-fullscreen');
        
        if (!mapCard || !button) return;
        
        this.isFullscreen = !this.isFullscreen;
        
        if (this.isFullscreen) {
            mapCard.classList.add('fullscreen');
            button.textContent = 'Exit Fullscreen';
        } else {
            mapCard.classList.remove('fullscreen');
            button.textContent = 'View Fullscreen';
        }
        
        // Resize the map to fit its container
        setTimeout(() => {
            if (this.map) this.map.invalidateSize();
        }, 100);
    }
};