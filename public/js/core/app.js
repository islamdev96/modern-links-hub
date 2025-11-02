/**
 * Main Application Entry Point
 * نقطة الدخول الرئيسية للتطبيق
 * Pattern: Module Pattern with Clean Architecture
 * SRP: Coordinates initialization of all modules
 */

// Core imports
import { APP_CONFIG } from './config.js';
import { SELECTORS, ANIMATIONS } from './constants.js';

// Feature imports
import FavoritesManager from '../features/favorites/index.js';
import * as ThemeManager from '../modules/theme.js';
import * as SearchManager from '../modules/search.js';
import * as KeyboardManager from '../modules/keyboard.js';
import * as CardsManager from '../modules/cards.js';
import * as RecentManager from '../modules/recent.js';

// Utilities
import { showToast } from '../utils/ui.js';
import { isLocalStorageAvailable } from '../utils/storage.js';
import { sleep } from '../utils/functions.js';

/**
 * Application Manager
 */
class Application {
    constructor() {
        this.modules = new Map();
        this.isInitialized = false;
    }

    /**
     * Initialize application
     */
    async initialize() {
        try {
            // Check environment
            if (!this.checkEnvironment()) {
                throw new Error('Environment check failed');
            }

            // Show loading
            this.showLoading();

            // Initialize modules in order
            await this.initializeModules();

            // Setup global error handler
            this.setupErrorHandler();

            // Hide loading
            await this.hideLoading();

            this.isInitialized = true;
            return true;
        } catch (error) {
            // Application initialization failed
            showToast('error', 'فشل تحميل التطبيق');
            return false;
        }
    }

    /**
     * Check environment requirements
     */
    checkEnvironment() {
        // Check localStorage availability
        if (!isLocalStorageAvailable()) {
            showToast('error', 'التخزين المحلي غير متاح');
            return false;
        }

        // Check required DOM elements
        const requiredSelectors = [
            SELECTORS.LOADING,
            SELECTORS.TOAST_CONTAINER,
            SELECTORS.LINKS_GRID
        ];

        for (const selector of requiredSelectors) {
            if (!document.querySelector(selector)) {
                // Required element not found
                return false;
            }
        }

        return true;
    }

    /**
     * Initialize all modules
     */
    async initializeModules() {
        // 1. Initialize theme first (affects UI)
        this.modules.set('theme', await this.initializeModule('Theme', ThemeManager));

        // 2. Initialize cards (base for other features)
        this.modules.set('cards', await this.initializeModule('Cards', CardsManager));

        // 3. Initialize favorites (depends on cards)
        this.modules.set('favorites', await this.initializeModule('Favorites', FavoritesManager));

        // 4. Initialize search (depends on cards)
        this.modules.set('search', await this.initializeModule('Search', SearchManager));

        // 5. Initialize keyboard shortcuts
        this.modules.set('keyboard', await this.initializeModule('Keyboard', KeyboardManager));

        // 6. Initialize recent links tracker
        this.modules.set('recent', await this.initializeModule('Recent', RecentManager));

        // 7. Initialize service worker
        if (APP_CONFIG.features.serviceWorker && 'serviceWorker' in navigator) {
            await this.registerServiceWorker();
        }
    }

    /**
     * Initialize a single module
     */
    async initializeModule(name, Module) {
        try {
            if (Module.initialize) {
                await Module.initialize();
            } else if (Module.default && Module.default.initialize) {
                await Module.default.initialize();
            }
            // Module initialized successfully
            return Module;
        } catch (error) {
            // Module initialization failed
            throw error;
        }
    }

    /**
     * Register service worker
     */
    async registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            // Service Worker registered successfully
        } catch (error) {
            // Service Worker registration failed
        }
    }

    /**
     * Setup global error handler
     */
    setupErrorHandler() {
        window.addEventListener('error', (event) => {
            // Global error occurred
            // Don't show toast for every error to avoid spam
        });

        window.addEventListener('unhandledrejection', (event) => {
            // Unhandled promise rejection
            // Don't show toast for every rejection to avoid spam
        });
    }

    /**
     * Show loading screen
     */
    showLoading() {
        const loading = document.querySelector(SELECTORS.LOADING);
        if (loading) {
            loading.classList.add(ANIMATIONS.VISIBLE);
        }
    }

    /**
     * Hide loading screen
     */
    async hideLoading() {
        await sleep(APP_CONFIG.defaults.loadingDelay);
        
        const loading = document.querySelector(SELECTORS.LOADING);
        if (loading) {
            loading.classList.add(ANIMATIONS.FADE_OUT);
            await sleep(300);
            loading.classList.remove(ANIMATIONS.VISIBLE);
            loading.classList.add(ANIMATIONS.HIDDEN);
        }
    }

    /**
     * Get module by name
     */
    getModule(name) {
        return this.modules.get(name);
    }

    /**
     * Check if application is initialized
     */
    isReady() {
        return this.isInitialized;
    }

    /**
     * Reload application
     */
    async reload() {
        window.location.reload();
    }

    /**
     * Destroy application (cleanup)
     */
    destroy() {
        // Cleanup modules
        this.modules.forEach((module, name) => {
            if (module.destroy) {
                module.destroy();
            } else if (module.default && module.default.destroy) {
                module.default.destroy();
            }
            // Module destroyed successfully
        });

        this.modules.clear();
        this.isInitialized = false;
    }
}

// Create singleton instance
const app = new Application();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.initialize());
} else {
    app.initialize();
}

// Export for global access
window.App = app;

export default app;
export { Application };
