/**
 * Keyboard Shortcuts Module
 * اختصارات لوحة المفاتيح
 */

import { showToast } from './utils.js';

const shortcuts = new Map();
let isEnabled = true;

/**
 * Initialize keyboard shortcuts
 * تهيئة اختصارات لوحة المفاتيح
 */
export function initializeKeyboardShortcuts() {
    // Register default shortcuts
    registerShortcut('ctrl+k', openSearch, 'فتح البحث');
    registerShortcut('ctrl+/', showShortcutsHelp, 'عرض الاختصارات');
    registerShortcut('escape', closeModals, 'إغلاق النوافذ');
    registerShortcut('ctrl+h', goHome, 'العودة للرئيسية');
    registerShortcut('ctrl+d', toggleDarkMode, 'تبديل الوضع المظلم');
    
    // Listen to keyboard events
    document.addEventListener('keydown', handleKeyDown);}

/**
 * Register a keyboard shortcut
 * تسجيل اختصار جديد
 * @param {string} combo - Key combination (e.g., 'ctrl+k')
 * @param {Function} handler - Handler function
 * @param {string} description - Description for help
 */
export function registerShortcut(combo, handler, description = '') {
    shortcuts.set(combo.toLowerCase(), { handler, description });
}

/**
 * Unregister a keyboard shortcut
 * إلغاء تسجيل اختصار
 * @param {string} combo - Key combination
 */
export function unregisterShortcut(combo) {
    shortcuts.delete(combo.toLowerCase());
}

/**
 * Handle keydown events
 * معالجة أحداث الضغط على المفاتيح
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeyDown(event) {
    if (!isEnabled) return;
    
    // Don't trigger shortcuts when typing in inputs
    const target = event.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        // Allow Escape to work in inputs
        if (event.key !== 'Escape') return;
    }
    
    const combo = buildCombo(event);
    const shortcut = shortcuts.get(combo);
    
    if (shortcut) {
        event.preventDefault();
        shortcut.handler(event);
    }
}

/**
 * Build key combination string from event
 * بناء نص الاختصار من الحدث
 * @param {KeyboardEvent} event - Keyboard event
 * @returns {string} - Key combination
 */
function buildCombo(event) {
    const parts = [];
    
    if (event.ctrlKey) parts.push('ctrl');
    if (event.altKey) parts.push('alt');
    if (event.shiftKey) parts.push('shift');
    if (event.metaKey) parts.push('meta');
    
    const key = event.key.toLowerCase();
    if (key !== 'control' && key !== 'alt' && key !== 'shift' && key !== 'meta') {
        parts.push(key);
    }
    
    return parts.join('+');
}

/**
 * Open search input
 * فتح حقل البحث
 */
function openSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.focus();
        searchInput.select();
    }
}

/**
 * Show shortcuts help modal
 * عرض نافذة مساعدة الاختصارات
 */
function showShortcutsHelp() {
    const helpText = Array.from(shortcuts.entries())
        .map(([combo, { description }]) => `${combo.toUpperCase()}: ${description}`)
        .join('\n');
    
    showToast('info', 'اضغط Ctrl+K للبحث، Ctrl+D للوضع المظلم', 5000);
}

/**
 * Close all modals and overlays
 * إغلاق جميع النوافذ
 */
function closeModals() {
    // Clear search
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchInput.value) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.blur();
    }
    
    // Remove focus from any focused element
    if (document.activeElement) {
        document.activeElement.blur();
    }
}

/**
 * Go to home / reset filters
 * العودة للرئيسية
 */
function goHome() {
    // Reset filters
    const allButton = document.querySelector('.filter-btn[data-category="all"]');
    if (allButton) {
        allButton.click();
    }
    
    // Clear search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    showToast('info', 'تم إعادة التعيين');
}

/**
 * Toggle dark mode
 * تبديل الوضع المظلم
 */
function toggleDarkMode() {
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.click();
    }
}

/**
 * Enable keyboard shortcuts
 * تفعيل الاختصارات
 */
export function enableShortcuts() {
    isEnabled = true;
}

/**
 * Disable keyboard shortcuts
 * تعطيل الاختصارات
 */
export function disableShortcuts() {
    isEnabled = false;
}

/**
 * Get all registered shortcuts
 * الحصول على جميع الاختصارات المسجلة
 * @returns {Map} - Shortcuts map
 */
export function getShortcuts() {
    return new Map(shortcuts);
}

// Export all
export default {
    initializeKeyboardShortcuts,
    registerShortcut,
    unregisterShortcut,
    enableShortcuts,
    disableShortcuts,
    getShortcuts
};
