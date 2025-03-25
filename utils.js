/**
 * Utility functions for the application
 */

const Utils = {
    /**
     * Format a date object to a readable string
     * @param {Date} date - The date to format
     * @param {Object} options - Formatting options
     * @returns {string} - Formatted date string
     */
    formatDate: function(date, options = {}) {
        const defaultOptions = { 
            month: 'short', 
            day: 'numeric' 
        };
        const mergedOptions = Object.assign({}, defaultOptions, options);
        return new Date(date).toLocaleDateString('en-US', mergedOptions);
    },

    /**
     * Create an HTML element with attributes and content
     * @param {string} tag - The HTML tag name
     * @param {Object} attributes - Key-value pairs of attributes
     * @param {string|HTMLElement|Array} content - The content to append
     * @returns {HTMLElement} - The created element
     */
    createElement: function(tag, attributes = {}, content = null) {
        const element = document.createElement(tag);
        
        // Set attributes
        for (const key in attributes) {
            if (key === 'classNames') {
                if (Array.isArray(attributes[key])) {
                    element.classList.add(...attributes[key]);
                } else {
                    element.classList.add(attributes[key]);
                }
            } else {
                element.setAttribute(key, attributes[key]);
            }
        }
        
        // Set content
        if (content !== null) {
            if (Array.isArray(content)) {
                content.forEach(item => {
                    if (typeof item === 'string') {
                        element.appendChild(document.createTextNode(item));
                    } else if (item instanceof HTMLElement) {
                        element.appendChild(item);
                    }
                });
            } else if (typeof content === 'string') {
                element.textContent = content;
            } else if (content instanceof HTMLElement) {
                element.appendChild(content);
            }
        }
        
        return element;
    },

    /**
     * Make an API request
     * @param {string} url - The URL to fetch
     * @param {Object} options - Fetch options
     * @returns {Promise} - Promise with response data
     */
    fetchAPI: async function(url, options = {}) {
        try {
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    },

    /**
     * Display an error message
     * @param {string} message - The error message
     * @param {HTMLElement} container - The container to display the message
     */
    showError: function(message, container) {
        container.innerHTML = `
            <div class="error-message">
                <i class="ri-error-warning-line"></i>
                <p>${message}</p>
            </div>
        `;
    },

    /**
     * Get element by ID with error handling
     * @param {string} id - The element ID
     * @returns {HTMLElement} - The found element
     */
    getElement: function(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Element with ID "${id}" not found`);
        }
        return element;
    },

    /**
     * Get today's date at midnight
     * @returns {Date} - Today at midnight
     */
    getTodayAtMidnight: function() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    },

    /**
     * Check if a date is today
     * @param {Date} date - The date to check
     * @returns {boolean} - True if the date is today
     */
    isToday: function(date) {
        const today = this.getTodayAtMidnight();
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        
        return today.getTime() === checkDate.getTime();
    },

    /**
     * Get temperature color based on temperature value
     * @param {number} temp - Temperature in Fahrenheit
     * @returns {string} - CSS color class
     */
    getTemperatureColor: function(temp) {
        if (temp >= 90) return 'text-danger';
        if (temp >= 80) return 'text-warning';
        if (temp <= 32) return 'text-primary';
        return 'text-success';
    },

    /**
     * Show a toast notification
     * @param {string} message - The message to display
     * @param {string} type - The type of toast (success, warning, error)
     */
    showToast: function(message, type = 'success') {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Show toast with animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove toast after timeout
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    /**
     * Get icon for toast type
     * @param {string} type - Toast type
     * @returns {string} - Icon class
     */
    getToastIcon: function(type) {
        switch (type) {
            case 'success': return 'ri-checkbox-circle-line';
            case 'warning': return 'ri-error-warning-line';
            case 'error': return 'ri-close-circle-line';
            default: return 'ri-information-line';
        }
    },

    /**
     * Debounce function to limit function calls
     * @param {Function} func - The function to debounce
     * @param {number} wait - The debounce wait time in milliseconds
     * @returns {Function} - Debounced function
     */
    debounce: function(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
};