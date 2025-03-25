/**
 * Farming activities functionality
 */

const Activities = {
    /**
     * Default activities data
     */
    defaultActivities: [
        {
            id: 1,
            title: "Corn Harvesting",
            type: "harvesting",
            status: "In Progress",
            startDate: "2023-09-15",
            endDate: "2023-09-25",
            progress: 35,
            weatherSuitability: "Optimal"
        },
        {
            id: 2,
            title: "Winter Wheat Planting",
            type: "planting",
            status: "Scheduled",
            startDate: "2023-09-25",
            endDate: "2023-10-10",
            progress: 60,
            weatherSuitability: "Monitor conditions"
        },
        {
            id: 3,
            title: "Equipment Maintenance",
            type: "maintenance",
            status: "Planned",
            startDate: "2023-10-12",
            endDate: "2023-10-15",
            progress: 0,
            weatherSuitability: "None (Indoor activity)"
        }
    ],
    
    /**
     * Initialize activities functionality
     */
    init: function() {
        this.loadActivities();
        this.setupAddActivityModal();
    },
    
    /**
     * Load activities from API or defaults
     */
    loadActivities: function() {
        const activitiesList = document.getElementById('activities-list');
        if (!activitiesList) return;
        
        this.fetchActivities()
            .then(activities => {
                this.renderActivities(activities);
            })
            .catch(error => {
                console.error('Error fetching activities:', error);
                // Use default activities if API fails
                this.renderActivities(this.defaultActivities);
            });
    },
    
    /**
     * Fetch activities from API
     * @returns {Promise} - Promise with activities data
     */
    fetchActivities: async function() {
        try {
            // In a real app, you would fetch from API
            // return await Utils.fetchAPI('/api/users/1/activities');
            
            // For demo, return default activities
            return this.defaultActivities;
        } catch (error) {
            console.error('Error fetching activities:', error);
            throw error;
        }
    },
    
    /**
     * Render activities list
     * @param {Array} activities - Activities to render
     */
    renderActivities: function(activities) {
        const activitiesList = document.getElementById('activities-list');
        if (!activitiesList) return;
        
        // Clear previous content
        activitiesList.innerHTML = '';
        
        // Add activity items
        activities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.setAttribute('data-id', activity.id);
            
            // Format dates for display
            const startDate = Utils.formatDate(activity.startDate);
            const endDate = Utils.formatDate(activity.endDate);
            
            // Get status CSS class
            const statusClass = this.getStatusClass(activity.status);
            
            // Get weather suitability class
            const suitabilityClass = this.getWeatherSuitabilityClass(activity.weatherSuitability);
            
            activityItem.innerHTML = `
                <div class="activity-header">
                    <h3 class="activity-title">${activity.title}</h3>
                    <span class="activity-status ${statusClass}">${activity.status}</span>
                </div>
                <div class="activity-date">
                    <i class="ri-calendar-line"></i>
                    <span>${startDate} - ${endDate}</span>
                </div>
                ${activity.progress > 0 ? `
                <div class="activity-progress">
                    <div class="progress-header">
                        <span>Progress</span>
                        <span>${activity.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${this.getProgressColorClass(activity.progress)}" style="width: ${activity.progress}%"></div>
                    </div>
                </div>
                ` : ''}
                <div class="activity-footer">
                    <div class="weather-suitability">
                        <span class="suitability-label">Weather suitability:</span>
                        <span class="suitability-value ${suitabilityClass}">${activity.weatherSuitability}</span>
                    </div>
                    <button class="btn-text view-details-btn" data-id="${activity.id}">
                        View Details
                    </button>
                </div>
            `;
            
            // Add to list
            activitiesList.appendChild(activityItem);
        });
        
        // Add event listeners to View Details buttons
        const detailButtons = activitiesList.querySelectorAll('.view-details-btn');
        detailButtons.forEach(button => {
            button.addEventListener('click', this.viewActivityDetails.bind(this));
        });
    },
    
    /**
     * Set up the add activity modal
     */
    setupAddActivityModal: function() {
        const addBtn = document.getElementById('add-activity-btn');
        const modal = document.getElementById('add-activity-modal');
        const closeBtn = modal?.querySelector('.modal-close');
        const form = document.getElementById('add-activity-form');
        
        if (!addBtn || !modal || !form) return;
        
        // Open modal on button click
        addBtn.addEventListener('click', () => {
            modal.classList.add('show');
        });
        
        // Close modal on close button click
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('show');
            });
        }
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
        
        // Form submission
        form.addEventListener('submit', this.handleAddActivity.bind(this));
    },
    
    /**
     * Handle add activity form submission
     * @param {Event} e - Form submit event
     */
    handleAddActivity: function(e) {
        e.preventDefault();
        
        const form = e.target;
        const modal = document.getElementById('add-activity-modal');
        
        // Get form values
        const formData = {
            title: form.querySelector('#activity-title').value,
            type: form.querySelector('#activity-type').value,
            status: form.querySelector('#activity-status').value,
            startDate: form.querySelector('#activity-start-date').value,
            endDate: form.querySelector('#activity-end-date').value,
            notes: form.querySelector('#activity-notes').value,
            progress: form.querySelector('#activity-status').value === 'in_progress' ? 50 : 0,
            weatherSuitability: 'To be determined'
        };
        
        // Validate dates
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        
        if (endDate < startDate) {
            alert('End date cannot be earlier than start date');
            return;
        }
        
        // In a real app, you would submit to API
        // Utils.fetchAPI('/api/activities', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // })
        
        // For demo, add to local activities
        const newActivity = {
            id: this.defaultActivities.length + 1,
            ...formData,
            weatherSuitability: this.determineWeatherSuitability(formData.type)
        };
        
        this.defaultActivities.push(newActivity);
        this.renderActivities(this.defaultActivities);
        
        // Reset form and close modal
        form.reset();
        modal.classList.remove('show');
        
        // Show success message
        Utils.showToast('Activity added successfully!', 'success');
    },
    
    /**
     * View activity details
     * @param {Event} e - Click event
     */
    viewActivityDetails: function(e) {
        const activityId = e.target.getAttribute('data-id');
        const activity = this.defaultActivities.find(a => a.id == activityId);
        
        if (!activity) return;
        
        // In a real app, you would navigate to a details page or open a modal
        alert(`Details for activity: ${activity.title}\nType: ${activity.type}\nStatus: ${activity.status}\nDates: ${Utils.formatDate(activity.startDate)} - ${Utils.formatDate(activity.endDate)}`);
    },
    
    /**
     * Get CSS class for status
     * @param {string} status - Activity status
     * @returns {string} - CSS class
     */
    getStatusClass: function(status) {
        const statusLower = status.toLowerCase();
        if (statusLower.includes('progress')) return 'bg-success';
        if (statusLower.includes('scheduled')) return 'bg-warning';
        if (statusLower.includes('completed')) return 'bg-secondary';
        return '';
    },
    
    /**
     * Get CSS class for progress color
     * @param {number} progress - Progress percentage
     * @returns {string} - CSS class
     */
    getProgressColorClass: function(progress) {
        if (progress >= 80) return 'bg-success';
        if (progress >= 40) return 'bg-warning';
        return 'bg-secondary';
    },
    
    /**
     * Get CSS class for weather suitability
     * @param {string} suitability - Weather suitability
     * @returns {string} - CSS class
     */
    getWeatherSuitabilityClass: function(suitability) {
        const suitabilityLower = suitability.toLowerCase();
        if (suitabilityLower.includes('optimal')) return 'text-success';
        if (suitabilityLower.includes('monitor')) return 'text-warning';
        if (suitabilityLower.includes('not')) return 'text-danger';
        return '';
    },
    
    /**
     * Determine weather suitability based on activity type
     * This is just for demo purposes
     * @param {string} type - Activity type
     * @returns {string} - Suitability text
     */
    determineWeatherSuitability: function(type) {
        // In a real app, this would check current weather conditions
        switch (type) {
            case 'planting':
                return 'Monitor conditions';
            case 'harvesting':
                return 'Optimal';
            case 'maintenance':
                return 'None (Indoor activity)';
            case 'fertilizing':
                return 'Not recommended (Rain expected)';
            case 'irrigation':
                return 'Not needed (Rain expected)';
            default:
                return 'Check weather forecast';
        }
    }
};