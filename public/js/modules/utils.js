/**
 * Shared Utility Functions
 * دوال مشتركة لتقليل التكرار في الكود
 */

/**
 * Open a link safely in a new tab
 * دالة موحدة لفتح الروابط بشكل آمن
 * 
 * @param {string} url - The URL to open
 * @returns {boolean} - Success status
 */
export function openLink(url) {
    if (!url) {
        console.error('No URL provided');
        return false;
    }

    try {
        const win = window.open(url, '_blank', 'noopener,noreferrer');
        if (win) {
            win.opener = null;
            return true;
        } else {
            console.warn('Popup blocked or window not opened');
            return false;
        }
    } catch (error) {
        console.error('Error opening link:', error);
        showToast('error', 'غير قادر على فتح الرابط');
        return false;
    }
}

/**
 * Show a toast notification
 * عرض إشعار مؤقت
 * 
 * @param {string} type - Type of toast: 'success', 'error', 'info'
 * @param {string} message - Message to display
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
export function showToast(type = 'info', message = '', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = getToastIcon(type);
    toast.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Auto remove after duration
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Get icon class for toast type
 * @private
 */
function getToastIcon(type) {
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

/**
 * Safely parse JSON from localStorage
 * قراءة آمنة من localStorage مع معالجة الأخطاء
 * 
 * @param {string} key - localStorage key
 * @param {*} defaultValue - Default value if parsing fails
 * @returns {*} - Parsed value or default
 */
export function safeLocalStorageGet(key, defaultValue = null) {
    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            const parsed = JSON.parse(stored);
            return parsed;
        }
        return defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage (${key}):`, error);
        // Clean up corrupted data
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Cannot remove corrupted localStorage item:', e);
        }
        return defaultValue;
    }
}

/**
 * Safely save JSON to localStorage
 * حفظ آمن في localStorage
 * 
 * @param {string} key - localStorage key
 * @param {*} value - Value to save
 * @returns {boolean} - Success status
 */
export function safeLocalStorageSet(key, value) {
    try {
        const json = JSON.stringify(value);
        localStorage.setItem(key, json);
        return true;
    } catch (error) {
        console.error(`Error writing to localStorage (${key}):`, error);
        if (error.name === 'QuotaExceededError') {
            showToast('error', 'مساحة التخزين ممتلئة');
        }
        return false;
    }
}

/**
 * Debounce function to limit execution rate
 * تأخير تنفيذ الدالة لتقليل الأداء الزائد
 * 
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Get icon URL from card
 * الحصول على رابط الأيقونة من البطاقة
 * 
 * @param {HTMLElement} card - Card element
 * @returns {string} - Icon URL
 */
export function getCardIcon(card) {
    // Try to get from img src first (most reliable)
    const imgElement = card.querySelector('.icon-image');
    if (imgElement && imgElement.src) {
        return imgElement.src;
    }
    
    // Fallback to data-icon attribute
    const dataIcon = card.getAttribute('data-icon');
    if (dataIcon) {
        // If it's a relative path, convert to absolute
        if (!dataIcon.startsWith('http')) {
            return new URL(dataIcon, window.location.origin).href;
        }
        return dataIcon;
    }
    
    // Fallback to default icon
    return '/icons/default.svg';
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
    } catch (error) {
        console.error('Failed to copy:', error);
        showToast('error', 'فشل النسخ');
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
