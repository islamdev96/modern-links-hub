/**
 * Favorites Module
 * نظام المفضلة المحسّن
 */

import { safeLocalStorageGet, safeLocalStorageSet, showToast, openLink, getCardIcon } from './utils.js';
import { getCardData, getAllCards } from './cards.js';

const FAVORITES_KEY = 'linkHubFavorites';
let favorites = [];
let favoritesSection = null;
let favoritesGrid = null;

/**
 * Initialize favorites system
 * تهيئة نظام المفضلة
 */
export function initializeFavorites() {
    favoritesSection = document.getElementById('favoritesSection');
    favoritesGrid = document.getElementById('favoritesGrid');
    
    if (!favoritesSection || !favoritesGrid) return;

    // Load favorites from localStorage
    loadFavoritesFromStorage();

    // Add favorite buttons to all cards
    addFavoriteButtonsToCards();

    // Display favorites
    displayFavorites();

    // Listen to storage changes (for multi-tab sync)
    window.addEventListener('storage', handleStorageChange);
}

/**
 * Load favorites from localStorage
 * تحميل المفضلة من localStorage
 */
function loadFavoritesFromStorage() {
    const stored = safeLocalStorageGet(FAVORITES_KEY, []);
    
    // Validate it's an array
    if (Array.isArray(stored)) {
        favorites = stored;
    } else {
        favorites = [];
        saveFavoritesToStorage();
    }
}

/**
 * Save favorites to localStorage
 * حفظ المفضلة في localStorage
 */
function saveFavoritesToStorage() {
    safeLocalStorageSet(FAVORITES_KEY, favorites);
}

/**
 * Add favorite buttons to all cards
 * إضافة أزرار المفضلة لكل البطاقات
 */
function addFavoriteButtonsToCards() {
    const cards = getAllCards();
    
    cards.forEach(card => {
        addFavoriteButton(card);
    });
}

/**
 * Add favorite button to a card
 * إضافة زر المفضلة لبطاقة
 * @param {HTMLElement} card - Card element
 */
function addFavoriteButton(card) {
    // Check if button already exists
    let favoriteBtn = card.querySelector('.favorite-btn');
    
    if (!favoriteBtn) {
        favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        favoriteBtn.title = 'إضافة للمفضلة';
        favoriteBtn.setAttribute('aria-label', 'إضافة للمفضلة');
        favoriteBtn.innerHTML = '<i class="fas fa-star"></i>';
        card.insertBefore(favoriteBtn, card.firstChild);
    }

    // Update button state
    const url = card.getAttribute('data-url');
    const isFavorited = isFavorite(url);
    updateFavoriteButton(favoriteBtn, isFavorited);

    // Add event listener
    favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(card);
    });
}

/**
 * Toggle favorite status
 * تبديل حالة المفضلة
 * @param {HTMLElement} card - Card element
 */
export function toggleFavorite(card) {
    const cardData = getCardData(card);
    const { url } = cardData;
    if (!url) return;

    const isFavorited = isFavorite(url);

    if (isFavorited) {
        removeFavorite(url);
        showToast('info', 'تم إزالة من المفضلة');
    } else {
        // ✅ FIX: Get icon from actual image, not data-icon
        const iconElement = card.querySelector('.icon-image');
        if (iconElement && iconElement.src) {
            cardData.icon = iconElement.src;
        }
        
        addFavorite(cardData);
        showToast('success', 'تم الإضافة للمفضلة');
    }

    // Update UI
    const favoriteBtn = card.querySelector('.favorite-btn');
    updateFavoriteButton(favoriteBtn, !isFavorited);
    displayFavorites();
}

/**
 * Add to favorites
 * إضافة للمفضلة
 * @param {Object} cardData - Card data object
 */
function addFavorite(cardData) {
    // Check if already exists
    if (isFavorite(cardData.url)) {
        return;
    }

    favorites.push({
        ...cardData,
        id: Date.now(),
        addedAt: new Date().toISOString()
    });

    saveFavoritesToStorage();
}

/**
 * Remove from favorites
 * إزالة من المفضلة
 * @param {string} url - Card URL
 */
function removeFavorite(url) {
    favorites = favorites.filter(fav => fav.url !== url);
    saveFavoritesToStorage();
}

/**
 * Check if URL is in favorites
 * التحقق من وجود رابط في المفضلة
 * @param {string} url - URL to check
 * @returns {boolean} - Is favorite
 */
export function isFavorite(url) {
    return favorites.some(fav => fav.url === url);
}

/**
 * Update favorite button appearance
 * تحديث مظهر زر المفضلة
 * @param {HTMLElement} button - Button element
 * @param {boolean} isFavorited - Is favorited
 */
function updateFavoriteButton(button, isFavorited) {
    if (!button) return;

    if (isFavorited) {
        button.classList.add('favorited');
        button.title = 'إزالة من المفضلة';
        button.setAttribute('aria-label', 'إزالة من المفضلة');
    } else {
        button.classList.remove('favorited');
        button.title = 'إضافة للمفضلة';
        button.setAttribute('aria-label', 'إضافة للمفضلة');
    }
}

/**
 * Display favorites in grid
 * عرض المفضلة في الشبكة
 */
function displayFavorites() {
    if (!favoritesSection || !favoritesGrid) return;

    // Show/hide section
    if (favorites.length === 0) {
        favoritesSection.style.display = 'none';
        return;
    }

    favoritesSection.style.display = 'block';
    favoritesGrid.innerHTML = '';

    // Create cards for each favorite
    favorites.forEach((fav, index) => {
        const card = createFavoriteCard(fav, index);
        favoritesGrid.appendChild(card);
    });
}

/**
 * Create a favorite card element
 * إنشاء بطاقة مفضلة
 * @param {Object} favorite - Favorite data
 * @param {number} index - Index in array
 * @returns {HTMLElement} - Card element
 */
function createFavoriteCard(favorite, index) {
    const card = document.createElement('div');
    card.className = `card ${favorite.category || ''}`;
    card.setAttribute('data-url', favorite.url);
    card.setAttribute('data-title', favorite.title);
    card.setAttribute('data-description', favorite.description);
    card.setAttribute('data-icon', favorite.icon);
    card.setAttribute('data-index', index);
    card.setAttribute('draggable', 'true');

    card.innerHTML = `
        <button class="favorite-btn favorited" title="إزالة من المفضلة" aria-label="إزالة من المفضلة">
            <i class="fas fa-star"></i>
        </button>
        <a href="${favorite.url}" target="_blank" rel="noopener noreferrer">
            <img src="${favorite.icon}" alt="${favorite.title}" class="icon-image loaded" loading="lazy" />
            <span class="title">${favorite.title}</span>
            <span class="description">${favorite.description}</span>
        </a>
    `;

    // Add click handler to favorite button
    const favoriteBtn = card.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        removeFavorite(favorite.url);
        displayFavorites();
        showToast('info', 'تم إزالة من المفضلة');
        
        // Update original card button
        updateAllFavoriteButtons();
    });

    // Add click handler to card
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.favorite-btn')) {
            openLink(favorite.url);
        }
    });

    return card;
}

/**
 * Update all favorite buttons in page
 * تحديث جميع أزرار المفضلة
 */
function updateAllFavoriteButtons() {
    const cards = getAllCards();
    cards.forEach(card => {
        const url = card.getAttribute('data-url');
        const favoriteBtn = card.querySelector('.favorite-btn');
        const isFavorited = isFavorite(url);
        updateFavoriteButton(favoriteBtn, isFavorited);
    });
}

/**
 * Handle storage changes (multi-tab sync)
 * معالجة تغييرات localStorage (مزامنة التبويبات)
 * @param {StorageEvent} event - Storage event
 */
function handleStorageChange(event) {
    if (event.key === FAVORITES_KEY) {
        loadFavoritesFromStorage();
        displayFavorites();
        updateAllFavoriteButtons();
    }
}

/**
 * Get all favorites
 * الحصول على جميع المفضلة
 * @returns {Array} - Favorites array
 */
export function getFavorites() {
    return [...favorites];
}

/**
 * Clear all favorites
 * مسح جميع المفضلة
 */
export function clearFavorites() {
    favorites = [];
    saveFavoritesToStorage();
    displayFavorites();
    updateAllFavoriteButtons();
    showToast('info', 'تم مسح جميع المفضلة');
}

/**
 * Export favorites as JSON
 * تصدير المفضلة كـ JSON
 * @returns {string} - JSON string
 */
export function exportFavorites() {
    return JSON.stringify(favorites, null, 2);
}

/**
 * Import favorites from JSON
 * استيراد المفضلة من JSON
 * @param {string} jsonString - JSON string
 * @returns {boolean} - Success status
 */
export function importFavorites(jsonString) {
    try {
        const imported = JSON.parse(jsonString);
        if (!Array.isArray(imported)) {
            throw new Error('Invalid format');
        }
        favorites = imported;
        saveFavoritesToStorage();
        displayFavorites();
        updateAllFavoriteButtons();
        showToast('success', 'تم استيراد المفضلة');
        return true;
    } catch (error) {
        console.error('Failed to import favorites:', error);
        showToast('error', 'فشل استيراد المفضلة');
        return false;
    }
}

// Export all
export default {
    initializeFavorites,
    toggleFavorite,
    isFavorite,
    getFavorites,
    clearFavorites,
    exportFavorites,
    importFavorites
};
