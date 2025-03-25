/**
 * Soil conditions functionality
 */

const SoilConditions = {
    /**
     * Default soil data values
     */
    defaultSoilData: {
        moistureLevel: 68,
        phLevel: 6.5,
        temperatureHistory: [62, 63, 64, 65, 67, 66, 65]
    },
    
    /**
     * Initialize soil conditions
     */
    init: function() {
        this.loadSoilData();
    },
    
    /**
     * Load soil data from API or use defaults
     */
    loadSoilData: function() {
        const soilCard = document.getElementById('soil-conditions-card');
        if (!soilCard) return;
        
        this.fetchSoilData()
            .then(data => {
                this.renderSoilConditions(data);
            })
            .catch(error => {
                console.error('Error fetching soil data:', error);
                // Use default data if API fails
                this.renderSoilConditions(this.defaultSoilData);
            });
    },
    
    /**
     * Fetch soil data from API
     * @returns {Promise} - Promise with soil data
     */
    fetchSoilData: async function() {
        try {
            // In a real app, you would fetch from API
            // return await Utils.fetchAPI('/api/users/1/soil');
            
            // For demo, return default data
            return this.defaultSoilData;
        } catch (error) {
            console.error('Error fetching soil data:', error);
            throw error;
        }
    },
    
    /**
     * Render soil conditions with data
     * @param {Object} data - Soil data to render
     */
    renderSoilConditions: function(data) {
        this.updateMoistureMeter(data.moistureLevel);
        this.updatePhMeter(data.phLevel);
        this.renderTemperatureChart(data.temperatureHistory);
    },
    
    /**
     * Update the moisture meter
     * @param {number} level - Moisture level percentage
     */
    updateMoistureMeter: function(level) {
        const soilMetrics = document.querySelector('.soil-metrics');
        if (!soilMetrics) return;
        
        const moistureMetric = soilMetrics.children[0];
        if (!moistureMetric) return;
        
        const valueElement = moistureMetric.querySelector('.metric-value');
        const fillElement = moistureMetric.querySelector('.progress-fill');
        
        if (valueElement) valueElement.textContent = `${level}%`;
        
        if (fillElement) {
            fillElement.style.width = `${level}%`;
            
            // Update color based on optimal range
            if (level >= 60 && level <= 75) {
                fillElement.className = 'progress-fill bg-success';
            } else if ((level >= 50 && level < 60) || (level > 75 && level <= 85)) {
                fillElement.className = 'progress-fill bg-warning';
            } else {
                fillElement.className = 'progress-fill bg-danger';
            }
        }
    },
    
    /**
     * Update the pH meter
     * @param {number} level - pH level
     */
    updatePhMeter: function(level) {
        const soilMetrics = document.querySelector('.soil-metrics');
        if (!soilMetrics) return;
        
        const phMetric = soilMetrics.children[1];
        if (!phMetric) return;
        
        const valueElement = phMetric.querySelector('.metric-value');
        const fillElement = phMetric.querySelector('.progress-fill');
        
        if (valueElement) valueElement.textContent = level.toFixed(1);
        
        if (fillElement) {
            // Convert pH scale (typically 4-9) to percentage (0-100%)
            const percentage = (level - 4) * 20;
            fillElement.style.width = `${percentage}%`;
            
            // Update color based on optimal range
            if (level >= 6.0 && level <= 7.0) {
                fillElement.className = 'progress-fill bg-success';
            } else if ((level >= 5.5 && level < 6.0) || (level > 7.0 && level <= 7.5)) {
                fillElement.className = 'progress-fill bg-warning';
            } else {
                fillElement.className = 'progress-fill bg-danger';
            }
        }
    },
    
    /**
     * Render the soil temperature chart
     * @param {Array} temperatures - Array of temperature readings
     */
    renderTemperatureChart: function(temperatures) {
        const chartContainer = document.getElementById('soil-temp-chart');
        if (!chartContainer) return;
        
        // Clear previous content
        chartContainer.innerHTML = '';
        
        // Create chart container with grid lines
        const chart = document.createElement('div');
        chart.className = 'soil-temp-chart';
        chart.style.display = 'flex';
        chart.style.height = '100%';
        chart.style.alignItems = 'flex-end';
        chart.style.position = 'relative';
        
        // Add temperature bars
        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container';
        barContainer.style.display = 'flex';
        barContainer.style.width = '100%';
        barContainer.style.height = '100%';
        barContainer.style.alignItems = 'flex-end';
        barContainer.style.justifyContent = 'space-between';
        barContainer.style.position = 'relative';
        barContainer.style.zIndex = '2';
        
        // Create days labels
        const daysContainer = document.createElement('div');
        daysContainer.className = 'days-container';
        daysContainer.style.display = 'flex';
        daysContainer.style.width = '100%';
        daysContainer.style.justifyContent = 'space-between';
        daysContainer.style.marginTop = '10px';
        
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Today'];
        
        // Add bars and labels
        temperatures.forEach((temp, index) => {
            // Convert temperature to percentage height (assuming range 50-80°F)
            const height = ((temp - 50) / 30) * 100;
            
            // Create bar
            const bar = document.createElement('div');
            bar.className = 'temp-bar';
            bar.style.height = `${height}%`;
            bar.style.width = '20px';
            bar.style.backgroundColor = 'var(--secondary-color)';
            bar.style.borderRadius = '2px 2px 0 0';
            bar.style.position = 'relative';
            
            // Add temperature tooltip
            bar.setAttribute('title', `${temp}°F`);
            
            // Add to container
            barContainer.appendChild(bar);
            
            // Add day label
            const dayLabel = document.createElement('div');
            dayLabel.className = 'day-label';
            dayLabel.textContent = days[index];
            dayLabel.style.fontSize = '0.75rem';
            dayLabel.style.color = 'var(--neutral-500)';
            
            daysContainer.appendChild(dayLabel);
        });
        
        // Add grid lines
        const gridContainer = document.createElement('div');
        gridContainer.className = 'grid-container';
        gridContainer.style.position = 'absolute';
        gridContainer.style.inset = '0';
        gridContainer.style.display = 'flex';
        gridContainer.style.flexDirection = 'column';
        gridContainer.style.justifyContent = 'space-between';
        gridContainer.style.pointerEvents = 'none';
        
        // Add grid lines for specific temperatures
        [75, 70, 65, 60, 55, 50].forEach(temp => {
            const line = document.createElement('div');
            line.className = 'grid-line';
            line.style.display = 'flex';
            line.style.alignItems = 'center';
            line.style.width = '100%';
            
            const lineEl = document.createElement('div');
            lineEl.style.height = '1px';
            lineEl.style.width = '100%';
            lineEl.style.backgroundColor = 'var(--neutral-200)';
            
            const tempLabel = document.createElement('span');
            tempLabel.textContent = `${temp}°F`;
            tempLabel.style.fontSize = '0.75rem';
            tempLabel.style.color = 'var(--neutral-400)';
            tempLabel.style.marginLeft = '5px';
            
            line.appendChild(lineEl);
            line.appendChild(tempLabel);
            gridContainer.appendChild(line);
        });
        
        // Add all elements to chart
        chart.appendChild(gridContainer);
        chart.appendChild(barContainer);
        chartContainer.appendChild(chart);
        chartContainer.appendChild(daysContainer);
    }
};