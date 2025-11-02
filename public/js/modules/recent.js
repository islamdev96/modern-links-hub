/**
 * Recent Links Module
 * نظام تتبع آخر الروابط المفتوحة
 */

import { safeLocalStorageGet, safeLocalStorageSet, openLink } from './utils.js';
import { APP_CONFIG } from '../config.js';

const STORAGE_KEY = 'linkHubRecent';
const MAX_RECENT = 10;
let recentLinks = [];

/**
 * Initialize recent links system
 * تهيئة نظام الروابط الأخيرة
 */
export function initializeRecent() {
    loadRecentFromStorage();
    setupLinkTracking();
}

/**
 * Load recent links from localStorage
 * تحميل الروابط الأخيرة من التخزين
 */
function loadRecentFromStorage() {
    const stored = safeLocalStorageGet(STORAGE_KEY, []);
    recentLinks = Array.isArray(stored) ? stored : [];
}

/**
 * Save recent links to localStorage
 * حفظ الروابط الأخيرة
 */
function saveRecentToStorage() {
    safeLocalStorageSet(STORAGE_KEY, recentLinks);
}

/**
 * Setup link tracking on all cards
 * إعداد تتبع النقرات على الروابط
 */
function setupLinkTracking() {
    const linksGrid = document.getElementById('linksGrid');
    if (!linksGrid) return;
    
    linksGrid.addEventListener('click', (event) => {
        const card = event.target.closest('.card');
        if (!card || event.target.closest('.favorite-btn')) return;
        
        const url = card.getAttribute('data-url');
        const title = card.getAttribute('data-title');
        const icon = card.getAttribute('data-icon');
        const description = card.getAttribute('data-description');
        
        if (url) {
            addToRecent({
                url,
                title,
                icon,
                description,
                timestamp: Date.now()
            });
        }
    });
}

/**
 * Add link to recent history
 * إضافة رابط للسجل
 * @param {Object} linkData - Link data
 */
export function addToRecent(linkData) {
    // Remove if already exists
    recentLinks = recentLinks.filter(link => link.url !== linkData.url);
    
    // Add to beginning
    recentLinks.unshift(linkData);
    
    // Keep only MAX_RECENT items
    if (recentLinks.length > MAX_RECENT) {
        recentLinks = recentLinks.slice(0, MAX_RECENT);
    }
    
    saveRecentToStorage();
}

/**
 * Get recent links
 * الحصول على الروابط الأخيرة
 * @param {number} limit - Maximum number of links
 * @returns {Array} - Recent links
 */
export function getRecent(limit = MAX_RECENT) {
    return recentLinks.slice(0, limit);
}

/**
 * Clear recent history
 * مسح السجل
 */
export function clearRecent() {
    recentLinks = [];
    saveRecentToStorage();
}

/**
 * Remove specific link from recent
 * إزالة رابط محدد من السجل
 * @param {string} url - URL to remove
 */
export function removeFromRecent(url) {
    recentLinks = recentLinks.filter(link => link.url !== url);
    saveRecentToStorage();
}

/**
 * Display recent links in UI
 * عرض الروابط الأخيرة في الواجهة
 * @param {HTMLElement} container - Container element
 */
export function displayRecent(container) {
    if (!container) return;
    
    const recent = getRecent(5);
    
    if (recent.length === 0) {
        container.innerHTML = '<p class="empty-state">لا توجد روابط حديثة</p>';
        return;
    }
    
    container.innerHTML = recent.map(link => `
        <div class="recent-item" data-url="${link.url}">
            <img src="${link.icon}" alt="${link.title}" class="recent-icon" loading="lazy" />
            <div class="recent-info">
                <span class="recent-title">${link.title}</span>
                <span class="recent-time">${formatTime(link.timestamp)}</span>
            </div>
        </div>
    `).join('');
    
    // Add click handlers
    container.querySelectorAll('.recent-item').forEach(item => {
        item.addEventListener('click', () => {
            const url = item.getAttribute('data-url');
            if (url) openLink(url);
        });
    });
}

/**
 * Format timestamp to relative time
 * تنسيق الوقت النسبي
 * @param {number} timestamp - Timestamp in milliseconds
 * @returns {string} - Formatted time
 */
function formatTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 7) return `منذ ${days} يوم`;
    
    return new Date(timestamp).toLocaleDateString('ar-EG');
}

/**
 * Export recent links as JSON
 * تصدير الروابط الأخيرة
 * @returns {string} - JSON string
 */
export function exportRecent() {
    return JSON.stringify(recentLinks, null, 2);
}

// Export all
export default {
    initializeRecent,
    addToRecent,
    getRecent,
    clearRecent,
    removeFromRecent,
    displayRecent,
    exportRecent
};
