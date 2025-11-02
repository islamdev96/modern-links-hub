/**
 * Favorites Storage Management
 * مسؤول فقط عن: التعامل مع localStorage
 * SRP: Single Responsibility - Storage operations only
 */

import { safeLocalStorageGet, safeLocalStorageSet } from '../../utils/storage.js';
import { APP_CONFIG } from '../../core/config.js';

class FavoritesStorage {
    constructor() {
        this.storageKey = APP_CONFIG.storage.favorites;
    }

    /**
     * Load favorites from localStorage
     */
    load() {
        try {
            const stored = safeLocalStorageGet(this.storageKey, []);
            
            if (!Array.isArray(stored)) {
                return [];
            }
            
            return stored;
        } catch (error) {
            // Clear corrupted data
            this.clear();
            return [];
        }
    }

    /**
     * Save favorites to localStorage
     */
    save(favorites) {
        try {
            if (!Array.isArray(favorites)) {
                return false;
            }
            
            safeLocalStorageSet(this.storageKey, favorites);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Clear storage
     */
    clear() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Check if storage is available
     */
    isAvailable() {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get storage size
     */
    getSize() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? stored.length : 0;
        } catch (error) {
            return 0;
        }
    }
}

// Singleton instance
const favoritesStorage = new FavoritesStorage();

export default favoritesStorage;
export { FavoritesStorage };
