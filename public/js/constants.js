/**
 * Application Constants
 * ثوابت التطبيق
 */

// Toast types
export const TOAST_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info'
};

// Toast icons
export const TOAST_ICONS = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    info: 'fas fa-info-circle'
};

// Theme values
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark'
};

// Category filters
export const CATEGORIES = {
    ALL: 'all',
    FAVORITES: 'favorites',
    STAR_FACTORY: 'star-factory',
    AI: 'ai',
    SOCIAL: 'social',
    DEVELOPMENT: 'development',
    TOOLS: 'tools'
};

// Animation classes
export const ANIMATIONS = {
    FADE_IN: 'fade-in',
    FADE_OUT: 'fade-out',
    FADE_UP: 'fadeUp',
    FADE_DOWN: 'fadeDown',
    SLIDE_UP: 'slideUp',
    HIDDEN: 'hidden',
    VISIBLE: 'visible',
    LOADED: 'loaded'
};

// Element selectors
export const SELECTORS = {
    LOADING: '.loading',
    SCROLL_TOP: '.scroll-top',
    TOAST_CONTAINER: '#toastContainer',
    THEME_TOGGLE: '#themeToggle',
    SEARCH_INPUT: '#searchInput',
    CLEAR_SEARCH: '#clearSearch',
    LINKS_GRID: '#linksGrid',
    FAVORITES_SECTION: '#favoritesSection',
    FAVORITES_GRID: '#favoritesGrid',
    FILTER_BUTTONS: '.filter-btn',
    CARDS: '.card',
    FAVORITE_BTN: '.favorite-btn',
    ICON_IMAGE: '.icon-image'
};

export default {
    TOAST_TYPES,
    TOAST_ICONS,
    THEMES,
    CATEGORIES,
    ANIMATIONS,
    SELECTORS
};
