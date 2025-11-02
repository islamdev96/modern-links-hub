/**
 * Storage Utilities
 * مسؤول فقط عن: عمليات التخزين المحلي
 * ISP: Interface Segregation - Storage operations only
 */

/**
 * Safely parse JSON from localStorage
 */
export function safeLocalStorageGet(key, defaultValue = null) {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
        try {
            localStorage.removeItem(key);
        } catch (e) {}
        return defaultValue;
    }
}

/**
 * Safely save JSON to localStorage
 */
export function safeLocalStorageSet(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        // Storage quota exceeded
        return false;
    }
}

/**
 * Remove item from localStorage
 */
export function safeLocalStorageRemove(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Clear all localStorage
 */
export function safeLocalStorageClear() {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable() {
    try {
        const testKey = '__test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Get storage size in bytes
 */
export function getStorageSize() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length + key.length;
        }
    }
    return total * 2; // UTF-16
}

export default {
    safeLocalStorageGet,
    safeLocalStorageSet,
    safeLocalStorageRemove,
    safeLocalStorageClear,
    isLocalStorageAvailable,
    getStorageSize
};
