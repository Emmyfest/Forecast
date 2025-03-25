/**
 * Main application functionality
 */

const App = {
    /**
     * Initialize the application
     */
    init: function() {
        // Setup page navigation
        this.setupNavigation();
        
        // Initialize components
        Weather.init();
        SoilConditions.init();
        Activities.init();
        Calendar.init();
        
        // Initialize map (wait for Leaflet to load)
        this.loadLeaflet().then(() => {
            WeatherMap.init();
        }).catch(error => {
            console.error('Error loading Leaflet:', error);
        });
        
        // Add theme toggle functionality
        this.setupThemeToggle();
        
        // Add toast notification styles
        this.addToastStyles();
    },
    
    /**
     * Setup navigation between pages
     */
    setupNavigation: function() {
        const navLinks = document.querySelectorAll('.main-nav a[data-page]');
        const pages = document.querySelectorAll('.page');
        
        if (!navLinks.length || !pages.length) return;
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const pageId = link.getAttribute('data-page');
                
                // Toggle active class on nav links
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                link.classList.add('active');
                
                // Show selected page, hide others
                pages.forEach(page => {
                    if (page.id === `${pageId}-page`) {
                        page.classList.remove('hidden');
                    } else {
                        page.classList.add('hidden');
                    }
                });
            });
        });
    },
    
    /**
     * Load Leaflet library
     * @returns {Promise} - Promise that resolves when Leaflet is loaded
     */
    loadLeaflet: function() {
        return new Promise((resolve, reject) => {
            // Check if Leaflet is already loaded
            if (typeof L !== 'undefined') {
                resolve();
                return;
            }
            
            // Load Leaflet script
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js';
            script.integrity = 'sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=';
            script.crossOrigin = '';
            
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Leaflet'));
            
            document.body.appendChild(script);
        });
    },
    
    /**
     * Setup theme toggle functionality
     */
    setupThemeToggle: function() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;
        
        // Check for saved preference
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        
        // Set initial theme
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="ri-moon-line"></i>';
        }
        
        // Toggle theme on click
        themeToggle.addEventListener('click', () => {
            const currentIsDark = document.body.classList.contains('dark-mode');
            
            if (currentIsDark) {
                document.body.classList.remove('dark-mode');
                themeToggle.innerHTML = '<i class="ri-sun-line"></i>';
                localStorage.setItem('darkMode', 'false');
            } else {
                document.body.classList.add('dark-mode');
                themeToggle.innerHTML = '<i class="ri-moon-line"></i>';
                localStorage.setItem('darkMode', 'true');
            }
        });
    },
    
    /**
     * Add toast notification styles
     */
    addToastStyles: function() {
        const style = document.createElement('style');
        style.textContent = `
            .toast-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .toast {
                background-color: white;
                border-left: 4px solid var(--success-color);
                padding: 12px 16px;
                border-radius: 4px;
                box-shadow: var(--shadow-md);
                min-width: 250px;
                max-width: 350px;
                transform: translateX(120%);
                opacity: 0;
                transition: transform 0.3s ease, opacity 0.3s ease;
            }
            
            .toast.show {
                transform: translateX(0);
                opacity: 1;
            }
            
            .toast-success {
                border-color: var(--success-color);
            }
            
            .toast-warning {
                border-color: var(--warning-color);
            }
            
            .toast-error {
                border-color: var(--danger-color);
            }
            
            .toast-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .toast-content i {
                font-size: 18px;
            }
            
            .toast-success i {
                color: var(--success-color);
            }
            
            .toast-warning i {
                color: var(--warning-color);
            }
            
            .toast-error i {
                color: var(--danger-color);
            }
            
            .dark-mode {
                --primary-color: #60a5fa;
                --primary-dark: #3b82f6;
                --primary-light: #93c5fd;
                --secondary-color: #34d399;
                --secondary-dark: #10b981;
                --secondary-light: #6ee7b7;
                --accent-color: #fbbf24;
                --accent-dark: #f59e0b;
                --accent-light: #fcd34d;
                --neutral-50: #1f1f1f;
                --neutral-100: #2e2e2e;
                --neutral-200: #424242;
                --neutral-300: #616161;
                --neutral-400: #888888;
                --neutral-500: #a0a0a0;
                --neutral-600: #d1d1d1;
                --neutral-700: #e0e0e0;
                --neutral-800: #f1f1f1;
                --neutral-900: #ffffff;
                background-color: var(--neutral-100);
                color: var(--neutral-700);
            }
            
            .dark-mode .app-header,
            .dark-mode .location-bar,
            .dark-mode .app-footer,
            .dark-mode .card {
                background-color: var(--neutral-50);
            }
            
            .dark-mode .progress-bar {
                background-color: var(--neutral-300);
            }
            
            .dark-mode .main-nav a {
                color: var(--neutral-500);
            }
            
            .dark-mode .main-nav a.active {
                color: var(--primary-color);
            }
            
            .dark-mode .modal-content {
                background-color: var(--neutral-50);
            }
            
            .dark-mode .toast {
                background-color: var(--neutral-50);
            }
            
            .dark-mode .forecast-day {
                background-color: var(--neutral-200);
            }
            
            .dark-mode .soil-metric,
            .dark-mode .soil-temperature {
                background-color: var(--neutral-200);
            }
            
            .dark-mode .activity-item {
                border-color: var(--neutral-300);
            }
            
            .dark-mode .btn-small {
                background-color: var(--neutral-200);
                border-color: var(--neutral-300);
                color: var(--neutral-600);
            }
            
            .dark-mode .calendar-day {
                background-color: var(--neutral-100);
            }
        `;
        
        document.head.appendChild(style);
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    App.init();
});