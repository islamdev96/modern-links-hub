/**
 * Formatting Utilities
 * مسؤول فقط عن: تنسيق البيانات
 * ISP: Interface Segregation - Formatting operations only
 */

/**
 * Format date to Arabic
 */
export function formatDateArabic(date) {
    return new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

/**
 * Format date to English
 */
export function formatDateEnglish(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

/**
 * Format time
 */
export function formatTime(date) {
    return new Intl.DateTimeFormat('ar-EG', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

/**
 * Format number with commas
 */
export function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format file size
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format currency
 */
export function formatCurrency(amount, currency = 'EGP') {
    return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(value, decimals = 0) {
    return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Truncate text
 */
export function truncateText(text, maxLength, suffix = '...') {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitalize first letter
 */
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Title case
 */
export function titleCase(str) {
    return str.replace(/\w\S*/g, txt => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
}

/**
 * Snake case to camel case
 */
export function snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Camel case to snake case
 */
export function camelToSnake(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Format duration
 */
export function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
    
    return parts.join(' ');
}

/**
 * Format relative time
 */
export function formatRelativeTime(date) {
    const rtf = new Intl.RelativeTimeFormat('ar', { numeric: 'auto' });
    const diff = (date - new Date()) / 1000;
    
    if (Math.abs(diff) < 60) return rtf.format(Math.round(diff), 'second');
    if (Math.abs(diff) < 3600) return rtf.format(Math.round(diff / 60), 'minute');
    if (Math.abs(diff) < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
    if (Math.abs(diff) < 2592000) return rtf.format(Math.round(diff / 86400), 'day');
    if (Math.abs(diff) < 31536000) return rtf.format(Math.round(diff / 2592000), 'month');
    return rtf.format(Math.round(diff / 31536000), 'year');
}

/**
 * Escape HTML
 */
export function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Unescape HTML
 */
export function unescapeHtml(str) {
    const doc = new DOMParser().parseFromString(str, 'text/html');
    return doc.documentElement.textContent;
}

export default {
    formatDateArabic,
    formatDateEnglish,
    formatTime,
    formatNumber,
    formatFileSize,
    formatCurrency,
    formatPercentage,
    truncateText,
    capitalize,
    titleCase,
    snakeToCamel,
    camelToSnake,
    formatDuration,
    formatRelativeTime,
    escapeHtml,
    unescapeHtml
};
