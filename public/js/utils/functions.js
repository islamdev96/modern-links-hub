/**
 * General Utility Functions
 * مسؤول فقط عن: الوظائف العامة المساعدة
 * ISP: Interface Segregation - General helper functions only
 */

import { APP_CONFIG } from '../core/config.js';

/**
 * Debounce function to limit execution rate
 */
export function debounce(func, wait = APP_CONFIG.defaults.searchDebounce) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Throttle function
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Sleep/delay function
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get random item from array
 */
export function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Shuffle array
 */
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Generate unique ID
 */
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Deep clone object
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    
    const cloned = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
}

/**
 * Merge objects deeply
 */
export function deepMerge(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                deepMerge(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return deepMerge(target, ...sources);
}

/**
 * Check if value is object
 */
export function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Group array by key
 */
export function groupBy(array, key) {
    return array.reduce((result, item) => {
        const group = item[key];
        if (!result[group]) result[group] = [];
        result[group].push(item);
        return result;
    }, {});
}

/**
 * Remove duplicates from array
 */
export function uniqueArray(array) {
    return [...new Set(array)];
}

/**
 * Remove duplicates from array of objects by key
 */
export function uniqueByKey(array, key) {
    const seen = new Set();
    return array.filter(item => {
        const val = item[key];
        if (seen.has(val)) {
            return false;
        }
        seen.add(val);
        return true;
    });
}

/**
 * Chunk array into smaller arrays
 */
export function chunkArray(array, size) {
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
        chunked.push(array.slice(i, i + size));
    }
    return chunked;
}

/**
 * Flatten nested array
 */
export function flattenArray(array, depth = 1) {
    return depth > 0
        ? array.reduce((acc, val) => acc.concat(
            Array.isArray(val) ? flattenArray(val, depth - 1) : val
        ), [])
        : array.slice();
}

/**
 * Pipe functions
 */
export function pipe(...fns) {
    return (x) => fns.reduce((v, f) => f(v), x);
}

/**
 * Compose functions
 */
export function compose(...fns) {
    return (x) => fns.reduceRight((v, f) => f(v), x);
}

/**
 * Memoize function
 */
export function memoize(fn) {
    const cache = new Map();
    return function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

/**
 * Retry function with exponential backoff
 */
export async function retry(fn, maxAttempts = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === maxAttempts) throw error;
            await sleep(delay * Math.pow(2, attempt - 1));
        }
    }
}

export default {
    debounce,
    throttle,
    sleep,
    getRandomItem,
    shuffleArray,
    generateId,
    deepClone,
    deepMerge,
    isObject,
    groupBy,
    uniqueArray,
    uniqueByKey,
    chunkArray,
    flattenArray,
    pipe,
    compose,
    memoize,
    retry
};
