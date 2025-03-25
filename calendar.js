/**
 * Calendar functionality for planting and harvesting
 */

const Calendar = {
    /**
     * Current displayed month and year
     */
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    
    /**
     * Calendar events data
     */
    calendarEvents: [
        {
            date: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
            type: 'planting',
            title: 'Winter Wheat Planting'
        },
        {
            date: new Date(new Date().getFullYear(), new Date().getMonth(), 8),
            type: 'harvesting',
            title: 'Corn Harvesting'
        },
        {
            date: new Date(new Date().getFullYear(), new Date().getMonth(), 22),
            type: 'maintenance',
            title: 'Equipment Maintenance'
        }
    ],
    
    /**
     * Planting windows data
     */
    plantingWindows: [
        {
            crop: 'Winter Wheat',
            dateRange: 'Sept 10 - Oct 10',
            status: 'optimal',
            color: 'success'
        },
        {
            crop: 'Cover Crops',
            dateRange: 'Sept 15 - Oct 15',
            status: 'watch',
            color: 'warning'
        },
        {
            crop: 'Spring Planning',
            dateRange: 'Nov 1 - Dec 31',
            status: 'planning',
            color: 'primary'
        }
    ],
    
    /**
     * Initialize the calendar
     */
    init: function() {
        this.renderCalendar();
        this.renderPlantingWindows();
        this.setupCalendarNavigation();
    },
    
    /**
     * Render the calendar
     */
    renderCalendar: function() {
        const calendarGrid = document.getElementById('calendar-grid');
        const monthDisplay = document.getElementById('calendar-month');
        
        if (!calendarGrid || !monthDisplay) return;
        
        // Update month display
        const monthName = new Date(this.currentYear, this.currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        monthDisplay.textContent = monthName;
        
        // Clear previous calendar
        calendarGrid.innerHTML = '';
        
        // Get first day of the month
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Get number of days in the month
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        
        // Get days of the previous month to display
        const daysInPrevMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();
        
        // Add days of week headers
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        weekdays.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day weekday';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });
        
        // Add days from previous month
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const dayNum = daysInPrevMonth - i;
            const dayEl = this.createDayElement(dayNum, true);
            calendarGrid.appendChild(dayEl);
        }
        
        // Add days of current month
        const today = new Date();
        const isCurrentMonth = today.getMonth() === this.currentMonth && today.getFullYear() === this.currentYear;
        
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = isCurrentMonth && today.getDate() === i;
            const dayEl = this.createDayElement(i, false, isToday);
            
            // Check if there are events on this day
            const dayEvents = this.getEventsForDay(i);
            if (dayEvents.length > 0) {
                dayEl.classList.add('has-event');
                dayEl.classList.add(`event-${dayEvents[0].type}`);
                dayEl.setAttribute('title', dayEvents[0].title);
            }
            
            calendarGrid.appendChild(dayEl);
        }
        
        // Add days from next month to fill the grid
        const totalDaysDisplayed = calendarGrid.children.length;
        const daysToAdd = 42 - totalDaysDisplayed; // 6 rows x 7 days = 42 total slots
        
        for (let i = 1; i <= daysToAdd; i++) {
            const dayEl = this.createDayElement(i, true);
            calendarGrid.appendChild(dayEl);
        }
    },
    
    /**
     * Create a calendar day element
     * @param {number} day - Day number
     * @param {boolean} isOutsideMonth - Whether the day is outside the current month
     * @param {boolean} isToday - Whether the day is today
     * @returns {HTMLElement} - The created day element
     */
    createDayElement: function(day, isOutsideMonth = false, isToday = false) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.textContent = day;
        
        if (isOutsideMonth) {
            dayEl.classList.add('outside-month');
        }
        
        if (isToday) {
            dayEl.classList.add('today');
        }
        
        return dayEl;
    },
    
    /**
     * Get events for a specific day
     * @param {number} day - Day number
     * @returns {Array} - Events for the day
     */
    getEventsForDay: function(day) {
        return this.calendarEvents.filter(event => {
            return event.date.getFullYear() === this.currentYear &&
                   event.date.getMonth() === this.currentMonth &&
                   event.date.getDate() === day;
        });
    },
    
    /**
     * Render planting windows
     */
    renderPlantingWindows: function() {
        const windowsList = document.getElementById('planting-windows-list');
        if (!windowsList) return;
        
        // Clear previous content
        windowsList.innerHTML = '';
        
        // Add planting windows
        this.plantingWindows.forEach(window => {
            const windowEl = document.createElement('div');
            windowEl.className = 'planting-window';
            
            windowEl.innerHTML = `
                <div>
                    <div class="window-crop">${window.crop}</div>
                    <div class="window-date">${window.dateRange}</div>
                </div>
                <div class="window-status ${window.status}">${this.getStatusText(window.status)}</div>
            `;
            
            windowsList.appendChild(windowEl);
        });
    },
    
    /**
     * Setup calendar navigation
     */
    setupCalendarNavigation: function() {
        const prevBtn = document.getElementById('prev-month');
        const nextBtn = document.getElementById('next-month');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.changeMonth(-1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.changeMonth(1);
            });
        }
    },
    
    /**
     * Change the displayed month
     * @param {number} change - Number of months to change (-1 for previous, 1 for next)
     */
    changeMonth: function(change) {
        const newDate = new Date(this.currentYear, this.currentMonth + change, 1);
        this.currentMonth = newDate.getMonth();
        this.currentYear = newDate.getFullYear();
        
        this.renderCalendar();
    },
    
    /**
     * Get readable text for status
     * @param {string} status - Status code
     * @returns {string} - Status text
     */
    getStatusText: function(status) {
        switch (status) {
            case 'optimal': return 'Optimal';
            case 'watch': return 'Watch Conditions';
            case 'planning': return 'Planning';
            default: return status;
        }
    }
};