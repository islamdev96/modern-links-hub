/**
 * Application Configuration
 * إعدادات التطبيق
 */

export const APP_CONFIG = {
    name: 'Modern Links Hub',
    version: '2.0.0',
    author: 'Islam Glab',
    
    // Storage keys
    storage: {
        theme: 'theme',
        favorites: 'linkHubFavorites'
    },
    
    // Default values
    defaults: {
        theme: 'light',
        searchDebounce: 300,
        toastDuration: 3000,
        loadingDelay: 1000
    },
    
    // Animation settings
    animations: {
        cardDelay: 0.05,
        fadeInDuration: 300,
        scrollThreshold: 300
    },
    
    // Feature flags
    features: {
        serviceWorker: true,
        lazyLoading: true,
        multiTabSync: true
    }
};

export default APP_CONFIG;
