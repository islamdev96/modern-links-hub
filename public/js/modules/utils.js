/**
 * Shared Utility Functions
 * دوال مشتركة لتقليل التكرار في الكود
 */

import { TOAST_ICONS, SELECTORS } from '../constants.js';
import { APP_CONFIG } from '../config.js';

/**
 * Open a link safely in a new tab
 * @param {string} url - The URL to open
 * @returns {boolean} - Success status
 */
export function openLink(url) {
    if (!url) return false;

    try {
        const win = window.open(url, '_blank', 'noopener,noreferrer');
        if (win) {
            win.opener = null;
            return true;
        }
        return false;
    } catch (error) {
        showToast('error', 'غير قادر على فتح الرابط');
        return false;
    }
}

/**
 * Show a toast notification
 * @param {string} type - Type of toast: 'success', 'error', 'info'
 * @param {string} message - Message to display
 * @param {number} duration - Duration in milliseconds
 */
export function showToast(type = 'info', message = '', duration = APP_CONFIG.defaults.toastDuration) {
    const container = document.querySelector(SELECTORS.TOAST_CONTAINER);
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="${TOAST_ICONS[type] || TOAST_ICONS.info}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Safely parse JSON from localStorage
 * @param {string} key - localStorage key
 * @param {*} defaultValue - Default value if parsing fails
 * @returns {*} - Parsed value or default
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
 * @param {string} key - localStorage key
 * @param {*} value - Value to save
 * @returns {boolean} - Success status
 */
export function safeLocalStorageSet(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            showToast('error', 'مساحة التخزين ممتلئة');
        }
        return false;
    }
}

/**
 * Debounce function to limit execution rate
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait = APP_CONFIG.defaults.searchDebounce) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Get icon URL from card
 * @param {HTMLElement} card - Card element
 * @returns {string} - Icon URL
 */
export function getCardIcon(card) {
    // ✅ FIX: ONLY use img.src - ignore data-icon completely
    const imgElement = card.querySelector(SELECTORS.ICON_IMAGE);
    if (imgElement?.src) {
        return imgElement.src;
    }
    
    // Fallback only if no img element found
    return 'https://via.placeholder.com/32x32?text=?';
}

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid
 */
export function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} - Is valid
 */
export function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Format date to Arabic
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date
 */
export function formatDateArabic(date) {
    return new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

/**
 * Animate element with CSS class
 * @param {HTMLElement} element - Element to animate
 * @param {string} animation - Animation class name
 * @param {Function} callback - Callback after animation
 */
export function animate(element, animation, callback) {
    element.classList.add(animation);
    
    function handleAnimationEnd() {
        element.classList.remove(animation);
        element.removeEventListener('animationend', handleAnimationEnd);
        if (callback) callback();
    }
    
    element.addEventListener('animationend', handleAnimationEnd);
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('success', 'تم النسخ بنجاح');
        return true;
    } catch (error) {showToast('error', 'فشل النسخ');
        return false;
    }
}

/**
 * Get random item from array
 * @param {Array} array - Array to pick from
 * @returns {*} - Random item
 */
export function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Shuffle array
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array
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
 * Sleep/delay function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Promise that resolves after delay
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Export all as default object too
export default {
    openLink,
    showToast,
    safeLocalStorageGet,
    safeLocalStorageSet,
    debounce,
    getCardIcon,
    isValidEmail,
    isValidURL,
    formatDateArabic,
    animate,
    copyToClipboard,
    getRandomItem,
    shuffleArray,
    sleep
};
