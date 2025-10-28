/**
 * Theme Module
 * إدارة الثيم (الوضع الداكن/المضيء)
 */

import { safeLocalStorageGet, safeLocalStorageSet } from './utils.js';

const THEME_KEY = 'theme';
let currentTheme = 'light';
let themeToggleBtn = null;

/**
 * Initialize theme system
 * تهيئة نظام الثيم
 */
export function initializeTheme() {
    themeToggleBtn = document.getElementById('themeToggle');
    if (!themeToggleBtn) return;

    // Load saved theme
    currentTheme = safeLocalStorageGet(THEME_KEY, 'light');
    applyTheme(currentTheme);

    // Setup event listener
    themeToggleBtn.addEventListener('click', toggleTheme);
}

/**
 * Toggle between light and dark theme
 * التبديل بين الوضع المضيء والداكن
 */
export function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

/**
 * Set theme
 * تعيين الثيم
 * @param {string} theme - 'light' or 'dark'
 */
export function setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') {
        console.error('Invalid theme:', theme);
        return;
    }

    currentTheme = theme;
    applyTheme(theme);
    safeLocalStorageSet(THEME_KEY, theme);
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
 * تحديث أيقونة زر الثيم
 * @param {string} theme - Current theme
 */
function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;

    const icon = themeToggleBtn.querySelector('i');
    if (!icon) return;

    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        themeToggleBtn.title = 'تبديل للوضع المضيء';
        themeToggleBtn.setAttribute('aria-label', 'تبديل للوضع المضيء');
    } else {
        icon.className = 'fas fa-moon';
        themeToggleBtn.title = 'تبديل للوضع المظلم';
        themeToggleBtn.setAttribute('aria-label', 'تبديل للوضع المظلم');
    }
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
 * التحقق من تفعيل الوضع الداكن
 * @returns {boolean} - Is dark mode active
 */
export function isDarkMode() {
    return currentTheme === 'dark';
}

/**
 * Auto-detect system theme preference
 * اكتشاف تفضيل النظام تلقائياً
 * @returns {string} - 'light' or 'dark'
 */
export function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
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
