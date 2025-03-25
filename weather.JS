/**
 * Weather functionality
 */

const Weather = {
    /**
     * Initialize the weather components
     */
    init: function() {
        this.initCurrentWeather();
        this.initForecast();
    },

    /**
     * Initialize the current weather display
     */
    initCurrentWeather: function() {
        const weatherCard = document.getElementById('current-weather-card');
        if (!weatherCard) return;

        this.fetchCurrentWeather('Iowa')
            .then(data => {
                this.renderCurrentWeather(data);
            })
            .catch(error => {
                console.error('Error fetching current weather:', error);
                const cardContent = weatherCard.querySelector('.card-content');
                Utils.showError('Unable to fetch current weather data. Please try again later.', cardContent);
            });
    },

    /**
     * Fetch current weather data
     * @param {string} location - The location to fetch weather for
     * @returns {Promise} - Promise with weather data
     */
    fetchCurrentWeather: async function(location) {
        try {
            // In a real app, you would fetch this from an API
            // return await Utils.fetchAPI(`/api/weather/${encodeURIComponent(location)}`);
            
            // For demo purposes, return mock data
            return {
                temperature: 72,
                conditions: 'Partly Cloudy',
                humidity: 65,
                windSpeed: 8,
                precipitation: 10,
                soilTemperature: 65,
                date: new Date().toISOString(),
                icon: 'sun-cloudy'
            };
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw error;
        }
    },

    /**
     * Render the current weather data
     * @param {Object} data - The weather data to render
     */
    renderCurrentWeather: function(data) {
        const weatherCard = document.getElementById('current-weather-card');
        if (!weatherCard) return;

        const cardContent = weatherCard.querySelector('.card-content');
        
        // Update temperature and conditions
        const temperatureEl = cardContent.querySelector('.temperature');
        const conditionsEl = cardContent.querySelector('.conditions');
        const iconEl = cardContent.querySelector('.weather-icon i');
        
        if (temperatureEl) temperatureEl.textContent = `${Math.round(data.temperature)}°F`;
        if (conditionsEl) conditionsEl.textContent = data.conditions;
        if (iconEl) {
            // Update icon based on conditions
            const iconClass = this.getWeatherIconClass(data.icon);
            iconEl.className = iconClass;
        }
        
        // Update weather details
        const details = cardContent.querySelectorAll('.weather-detail');
        if (details.length >= 4) {
            // Humidity
            details[0].querySelector('.detail-value').textContent = `${data.humidity}%`;
            
            // Wind
            details[1].querySelector('.detail-value').textContent = `${data.windSpeed} mph`;
            
            // Precipitation
            details[2].querySelector('.detail-value').textContent = `${data.precipitation}%`;
            
            // Soil Temp
            details[3].querySelector('.detail-value').textContent = `${data.soilTemperature}°F`;
        }
        
        // Update farming recommendation
        const recommendation = this.getFarmingRecommendation(data);
        const recommendationEl = cardContent.querySelector('.farming-recommendation');
        if (recommendationEl) {
            recommendationEl.querySelector('span').textContent = recommendation;
        }
    },

    /**
     * Initialize the weather forecast display
     */
    initForecast: function() {
        const forecastContainer = document.getElementById('forecast-container');
        if (!forecastContainer) return;

        this.fetchForecast('Iowa')
            .then(data => {
                this.renderForecast(data);
            })
            .catch(error => {
                console.error('Error fetching forecast:', error);
                Utils.showError('Unable to fetch forecast data. Please try again later.', forecastContainer);
            });
    },

    /**
     * Fetch forecast data
     * @param {string} location - The location to fetch forecast for
     * @returns {Promise} - Promise with forecast data
     */
    fetchForecast: async function(location) {
        try {
            // In a real app, you would fetch this from an API
            // return await Utils.fetchAPI(`/api/forecast/${encodeURIComponent(location)}`);
            
            // For demo purposes, return mock data
            const today = new Date();
            return [
                {
                    date: new Date(today).toISOString(),
                    icon: 'sun-cloudy',
                    conditions: 'Partly Cloudy',
                    highTemp: 75,
                    lowTemp: 58,
                    precipitation: 10,
                    farmingCondition: 'Optimal'
                },
                {
                    date: new Date(today.setDate(today.getDate() + 1)).toISOString(),
                    icon: 'sun',
                    conditions: 'Sunny',
                    highTemp: 80,
                    lowTemp: 62,
                    precipitation: 0,
                    farmingCondition: 'Optimal'
                },
                {
                    date: new Date(today.setDate(today.getDate() + 1)).toISOString(),
                    icon: 'cloud',
                    conditions: 'Cloudy',
                    highTemp: 72,
                    lowTemp: 60,
                    precipitation: 20,
                    farmingCondition: 'Watch'
                },
                {
                    date: new Date(today.setDate(today.getDate() + 1)).toISOString(),
                    icon: 'rainy',
                    conditions: 'Rainy',
                    highTemp: 68,
                    lowTemp: 55,
                    precipitation: 80,
                    farmingCondition: 'Not Recommended'
                },
                {
                    date: new Date(today.setDate(today.getDate() + 1)).toISOString(),
                    icon: 'cloudy',
                    conditions: 'Partly Cloudy',
                    highTemp: 70,
                    lowTemp: 56,
                    precipitation: 30,
                    farmingCondition: 'Watch'
                }
            ];
        } catch (error) {
            console.error('Error fetching forecast data:', error);
            throw error;
        }
    },

    /**
     * Render the forecast data
     * @param {Array} data - The forecast data to render
     */
    renderForecast: function(data) {
        const forecastContainer = document.getElementById('forecast-container');
        if (!forecastContainer) return;

        // Clear previous content
        forecastContainer.innerHTML = '';
        
        // Create forecast day cards
        data.forEach(day => {
            const date = new Date(day.date);
            const isToday = Utils.isToday(date);
            
            const dayName = isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
            
            const forecastDay = document.createElement('div');
            forecastDay.className = 'forecast-day';
            
            forecastDay.innerHTML = `
                <div class="forecast-date">${dayName}</div>
                <div class="forecast-icon">
                    <i class="${this.getWeatherIconClass(day.icon)}"></i>
                </div>
                <div class="forecast-temp">${Math.round(day.highTemp)}° / ${Math.round(day.lowTemp)}°</div>
                <div class="forecast-condition">${day.conditions}</div>
                <div class="forecast-farm-condition ${this.getFarmingConditionClass(day.farmingCondition)}">
                    ${day.farmingCondition}
                </div>
            `;
            
            forecastContainer.appendChild(forecastDay);
        });
    },

    /**
     * Get the appropriate weather icon class
     * @param {string} condition - Weather condition or icon name
     * @returns {string} - Icon class
     */
    getWeatherIconClass: function(condition) {
        const iconMap = {
            'sun': 'ri-sun-line',
            'sun-cloudy': 'ri-sun-cloudy-line',
            'cloudy': 'ri-cloudy-line',
            'cloud': 'ri-cloud-line',
            'rainy': 'ri-rainy-line',
            'showers': 'ri-showers-line',
            'thunderstorms': 'ri-thunderstorms-line',
            'snowy': 'ri-snowy-line',
            'foggy': 'ri-mist-line',
            'windy': 'ri-windy-line'
        };
        
        return iconMap[condition.toLowerCase()] || 'ri-cloud-line';
    },

    /**
     * Get appropriate CSS class for farming condition
     * @param {string} condition - The farming condition
     * @returns {string} - CSS class
     */
    getFarmingConditionClass: function(condition) {
        if (condition.toLowerCase() === 'optimal') return '';
        if (condition.toLowerCase() === 'watch') return 'warning';
        if (condition.toLowerCase().includes('not')) return 'danger';
        return '';
    },

    /**
     * Get farming recommendation based on weather data
     * @param {Object} data - Weather data
     * @returns {string} - Recommendation text
     */
    getFarmingRecommendation: function(data) {
        if (data.precipitation > 50) {
            return 'Not suitable for field operations due to precipitation';
        }
        
        if (data.windSpeed > 15) {
            return 'High winds may impact spraying operations';
        }
        
        if (data.temperature > 85) {
            return 'Hot conditions - monitor crops for heat stress';
        }
        
        if (data.temperature < 45) {
            return 'Cold conditions - limited growth expected';
        }
        
        return 'Good conditions for farming activities';
    }
};