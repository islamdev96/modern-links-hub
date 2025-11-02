/**
 * Theme Module
 * إدارة الثيم (الوضع الداكن/المضيء)
 */

import { safeLocalStorageGet, safeLocalStorageSet } from '../utils/storage.js';
import { THEMES, SELECTORS } from '../core/constants.js';
import { APP_CONFIG } from '../core/config.js';

let currentTheme = THEMES.LIGHT;
let themeToggleBtn = null;

/**
 * Initialize theme system
 * تهيئة نظام الثيم
 */
export function initializeTheme() {
    themeToggleBtn = document.querySelector(SELECTORS.THEME_TOGGLE);
    if (!themeToggleBtn) return;

    currentTheme = safeLocalStorageGet(APP_CONFIG.storage.theme, THEMES.LIGHT);
    applyTheme(currentTheme);
    themeToggleBtn.addEventListener('click', toggleTheme);
}

/**
 * Toggle between light and dark theme
 */
export function toggleTheme() {
    setTheme(currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK);
}

/**
 * Set theme
 * @param {string} theme - 'light' or 'dark'
 */
export function setTheme(theme) {
    if (theme !== THEMES.LIGHT && theme !== THEMES.DARK) return;

    currentTheme = theme;
    applyTheme(theme);
    safeLocalStorageSet(APP_CONFIG.storage.theme, theme);
}

/**
 * Apply theme to document
 * تطبيق الثيم على الصفحة
 * @param {string} theme - Theme to apply
 */
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

/**
 * Update theme toggle icon
 * @param {string} theme - Current theme
 */
function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;

    const icon = themeToggleBtn.querySelector('i');
    if (!icon) return;

    const isDark = theme === THEMES.DARK;
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    const label = isDark ? 'تبديل للوضع المضيء' : 'تبديل للوضع المظلم';
    themeToggleBtn.title = label;
    themeToggleBtn.setAttribute('aria-label', label);
}

/**
 * Get current theme
 * الحصول على الثيم الحالي
 * @returns {string} - Current theme ('light' or 'dark')
 */
export function getCurrentTheme() {
    return currentTheme;
}

/**
 * Check if dark mode is active
 * @returns {boolean} - Is dark mode active
 */
export function isDarkMode() {
    return currentTheme === THEMES.DARK;
}

/**
 * Auto-detect system theme preference
 * @returns {string} - 'light' or 'dark'
 */
export function getSystemTheme() {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches 
        ? THEMES.DARK 
        : THEMES.LIGHT;
}

/**
 * Use system theme preference
 * استخدام تفضيل النظام
 */
export function useSystemTheme() {
    const systemTheme = getSystemTheme();
    setTheme(systemTheme);
}

/**
 * Listen to system theme changes
 * الاستماع لتغييرات ثيم النظام
 */
export function watchSystemTheme() {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
    });
}

// Export all
export default {
    initializeTheme,
    toggleTheme,
    setTheme,
    getCurrentTheme,
    isDarkMode,
    getSystemTheme,
    useSystemTheme,
    watchSystemTheme
};
