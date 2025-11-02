/**
 * Favorites Module
 * نظام المفضلة المحسّن
 */

import { safeLocalStorageGet, safeLocalStorageSet, showToast, openLink, getCardIcon } from './utils.js';
import { getCardData, getAllCards } from './cards.js';
import { SELECTORS, ANIMATIONS } from '../constants.js';
import { APP_CONFIG } from '../config.js';

let favorites = [];
let favoritesSection = null;
let favoritesGrid = null;
let isDisplaying = false; // Flag to prevent concurrent display calls

/**
 * Initialize favorites system
 * تهيئة نظام المفضلة
 */
export function initializeFavorites() {
    try {
        favoritesSection = document.querySelector(SELECTORS.FAVORITES_SECTION);
        favoritesGrid = document.querySelector(SELECTORS.FAVORITES_GRID);
        
        if (!favoritesSection || !favoritesGrid) {return;
        }

        loadFavoritesFromStorage();
        addFavoriteButtonsToCards();
        displayFavorites();

        if (APP_CONFIG.features.multiTabSync) {
            window.addEventListener('storage', handleStorageChange);
        }
    } catch (error) {// Don't break the page if favorites fail
    }
}

/**
 * Load favorites from localStorage
 */
function loadFavoritesFromStorage() {
    try {
        const stored = safeLocalStorageGet(APP_CONFIG.storage.favorites, []);
        
        // ✅ FIX: Validate and clean favorites data
        if (!Array.isArray(stored)) {
            favorites = [];
            saveFavoritesToStorage();
            return;
        }
        
        // Clean invalid favorites (must have url and title)
        favorites = stored.filter(fav => {
            return fav && 
                   typeof fav === 'object' && 
                   fav.url && 
                   typeof fav.url === 'string' && 
                   fav.url.trim() !== '' &&
                   fav.title && 
                   typeof fav.title === 'string' && 
                   fav.title.trim() !== '';
        }).map(fav => {
            // Ensure all required fields exist
            return {
                url: String(fav.url).trim(),
                title: String(fav.title).trim(),
                description: fav.description ? String(fav.description).trim() : '',
                icon: fav.icon ? String(fav.icon).trim() : '',
                category: fav.category ? String(fav.category).trim() : '',
                id: fav.id || Date.now() + Math.random(),
                addedAt: fav.addedAt || new Date().toISOString()
            };
        });
        
        // Save cleaned data back if any were removed
        if (favorites.length !== stored.length) {
            saveFavoritesToStorage();
        }
    } catch (error) {favorites = [];
        // Try to clear corrupted data
        try {
            localStorage.removeItem(APP_CONFIG.storage.favorites);
        } catch (e) {}
    }
}

/**
 * Save favorites to localStorage
 */
function saveFavoritesToStorage() {
    try {
        // ✅ FIX: Validate before saving
        if (!Array.isArray(favorites)) {favorites = [];
        }
        safeLocalStorageSet(APP_CONFIG.storage.favorites, favorites);
    } catch (error) {showToast('error', 'فشل حفظ المفضلة');
    }
}

/**
 * Add favorite buttons to all cards
 * إضافة أزرار المفضلة لكل البطاقات
 */
function addFavoriteButtonsToCards() {
    try {
        const cards = getAllCards();
        
        if (!Array.isArray(cards)) {return;
        }
        
        cards.forEach(card => {
            try {
                if (card && card.nodeType === Node.ELEMENT_NODE) {
                    addFavoriteButton(card);
                }
            } catch (cardError) {// Continue with other cards even if one fails
            }
        });
    } catch (error) {// Don't break the page if this fails
    }
}

/**
 * Add favorite button to a card
 * @param {HTMLElement} card - Card element
 */
function addFavoriteButton(card) {
    try {
        if (!card || !card.nodeType || card.nodeType !== Node.ELEMENT_NODE) {return;
        }

        let favoriteBtn = card.querySelector(SELECTORS.FAVORITE_BTN);
        
        if (!favoriteBtn) {
            favoriteBtn = document.createElement('button');
            favoriteBtn.className = 'favorite-btn';
            favoriteBtn.title = 'إضافة للمفضلة';
            favoriteBtn.setAttribute('aria-label', 'إضافة للمفضلة');
            favoriteBtn.innerHTML = '<i class="fas fa-star"></i>';
            
            // ✅ FIX: Safe insertion
            if (card.firstChild) {
                card.insertBefore(favoriteBtn, card.firstChild);
            } else {
                card.appendChild(favoriteBtn);
            }
        }

        const url = card.getAttribute('data-url');
        if (url) {
            updateFavoriteButton(favoriteBtn, isFavorite(url));
        }

        // ✅ FIX: Remove old listeners and add new one
        const newFavoriteBtn = favoriteBtn.cloneNode(true);
        favoriteBtn.parentNode.replaceChild(newFavoriteBtn, favoriteBtn);
        
        newFavoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            try {
                toggleFavorite(card);
            } catch (toggleError) {showToast('error', 'فشل تعديل المفضلة');
            }
        });
    } catch (error) {// Don't break the page if button creation fails
    }
}

/**
 * Toggle favorite status
 * تبديل حالة المفضلة
 * @param {HTMLElement} card - Card element
 */
export function toggleFavorite(card) {
    try {
        if (!card || !card.nodeType || card.nodeType !== Node.ELEMENT_NODE) {return;
        }

        const cardData = getCardData(card);
        if (!cardData) {return;
        }

        const { url } = cardData;
        if (!url || typeof url !== 'string' || url.trim() === '') {return;
        }

        const isFavorited = isFavorite(url);

        if (isFavorited) {
            try {
                removeFavorite(url);
                showToast('info', 'تم إزالة من المفضلة');
            } catch (removeError) {showToast('error', 'فشل إزالة من المفضلة');
                return;
            }
        } else {
            try {
                // ✅ FIX: Get icon directly from img element for accurate URL
                const iconElement = card.querySelector('.icon-image');
                if (iconElement && iconElement.src) {
                    // Get the actual loaded image URL (full URL)
                    cardData.icon = iconElement.src;
                } else {
                    // Fallback to getCardIcon
                    cardData.icon = getCardIcon(card);
                }
                
                // Validate and fix icon URL
                if (!cardData.icon || typeof cardData.icon !== 'string' || cardData.icon.trim() === '') {
                    // Try to get from data-icon as last resort
                    cardData.icon = card.getAttribute('data-icon') || '';
                }
                
                // ✅ FIX: Ensure icon is a full URL, not a relative path
                if (cardData.icon && !cardData.icon.startsWith('http') && !cardData.icon.startsWith('data:')) {
                    // If it's a relative path, make it absolute
                    if (cardData.icon.startsWith('/')) {
                        cardData.icon = window.location.origin + cardData.icon;
                    } else {
                        cardData.icon = window.location.origin + '/' + cardData.icon;
                    }
                }
                
                addFavorite(cardData);
                showToast('success', 'تم الإضافة للمفضلة');
            } catch (addError) {showToast('error', 'فشل الإضافة للمفضلة');
                return;
            }
        }

        // Update button state
        try {
            const favoriteBtn = card.querySelector(SELECTORS.FAVORITE_BTN);
            if (favoriteBtn) {
                updateFavoriteButton(favoriteBtn, !isFavorited);
            }
        } catch (btnError) {}

        // Refresh favorites display and update counter
        try {
            displayFavorites();
            
            // Update favorites counter in filter button
            const countBadge = document.getElementById('count-favorites');
            if (countBadge) {
                countBadge.textContent = getFavorites().length;
            }
        } catch (displayError) {// Continue even if display fails
        }
    } catch (error) {showToast('error', 'حدث خطأ في تعديل المفضلة');
    }
}

/**
 * Add to favorites
 * @param {Object} cardData - Card data object
 */
function addFavorite(cardData) {
    // ✅ FIX: Validate cardData before adding
    if (!cardData || !cardData.url || !cardData.title) {return;
    }
    
    if (isFavorite(cardData.url)) return;

    // ✅ FIX: Ensure all fields are strings and cleaned
    const cleanCardData = {
        url: String(cardData.url).trim(),
        title: String(cardData.title).trim(),
        description: cardData.description ? String(cardData.description).trim() : '',
        icon: cardData.icon ? String(cardData.icon).trim() : '',
        category: cardData.category ? String(cardData.category).trim() : '',
        id: Date.now() + Math.random(),
        addedAt: new Date().toISOString()
    };
    
    favorites.push(cleanCardData);
    saveFavoritesToStorage();
}

/**
 * Remove from favorites
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
    try {
        if (!button || !button.nodeType || button.nodeType !== Node.ELEMENT_NODE) {
            return;
        }

        if (isFavorited) {
            button.classList.add('favorited');
            button.title = 'إزالة من المفضلة';
            button.setAttribute('aria-label', 'إزالة من المفضلة');
        } else {
            button.classList.remove('favorited');
            button.title = 'إضافة للمفضلة';
            button.setAttribute('aria-label', 'إضافة للمفضلة');
        }
    } catch (error) {// Don't break if button update fails
    }
}

/**
 * Display favorites in grid
 * عرض المفضلة في الشبكة
 */
export function displayFavorites() {
    // ✅ FIX: Prevent concurrent calls
    if (isDisplaying) {return;
    }

    try {
        isDisplaying = true;

        if (!favoritesSection || !favoritesGrid) {
            isDisplaying = false;
            return;
        }

        // Show/hide section based on favorites count
        if (favorites.length === 0) {
            favoritesSection.style.display = 'none';
            isDisplaying = false;
            return;
        }

        favoritesSection.style.display = 'block';
        
        // ✅ FIX: Clear grid safely
        try {
            favoritesGrid.innerHTML = '';
        } catch (clearError) {// Try alternative method
            while (favoritesGrid.firstChild) {
                favoritesGrid.removeChild(favoritesGrid.firstChild);
            }
        }

        // Create cards for each favorite
        favorites.forEach((fav, index) => {
            try {
                // ✅ FIX: Double-check favorite validity before creating card
                if (!fav || !fav.url || !fav.title) {return;
                }
                
                const card = createFavoriteCard(fav, index);
                if (card) {
                    favoritesGrid.appendChild(card);
                }
            } catch (error) {// Continue with other favorites even if one fails
            }
        });
    } catch (error) {// Hide section on error to prevent page break
        if (favoritesSection) {
            favoritesSection.style.display = 'none';
        }
    } finally {
        // Always reset the flag
        isDisplaying = false;
    }
}

/**
 * Create a favorite card element
 * إنشاء بطاقة مفضلة
 * @param {Object} favorite - Favorite data
 * @param {number} index - Index in array
 * @returns {HTMLElement} - Card element
 */
function createFavoriteCard(favorite, index) {
    // ✅ FIX: Validate favorite data before creating card
    if (!favorite || !favorite.url || !favorite.title) {return null;
    }
    
    try {
        const card = document.createElement('div');
        card.className = `card ${favorite.category || ''}`;
        card.setAttribute('data-url', favorite.url);
        card.setAttribute('data-title', favorite.title);
        card.setAttribute('data-description', favorite.description || '');
        card.setAttribute('data-icon', favorite.icon || '');
        card.setAttribute('data-index', index);
        card.setAttribute('draggable', 'true');

        // ✅ FIX: Use fallback icon if icon is missing or broken
        const iconUrl = favorite.icon && favorite.icon.trim() 
            ? favorite.icon.trim() 
            : `https://via.placeholder.com/32x32?text=${encodeURIComponent((favorite.title.charAt(0) || '?').toUpperCase())}`;
        const fallbackIcon = `https://via.placeholder.com/32x32?text=${encodeURIComponent((favorite.title.charAt(0) || '?').toUpperCase())}`;

        // ✅ FIX: Escape HTML to prevent XSS
        const escapeHtml = (str) => {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        };

        const safeTitle = escapeHtml(favorite.title);
        const safeDescription = escapeHtml(favorite.description || '');
        
        // ✅ FIX: Validate and escape URL to prevent XSS and HTML injection
        let safeUrl = '';
        try {
            // Try to create a URL object to validate
            new URL(favorite.url);
            safeUrl = escapeHtml(favorite.url);
        } catch (e) {
            // If URL is invalid, use a safe placeholdersafeUrl = '#';
        }

        // ✅ FIX: Don't escape icon URLs - they are URLs not HTML text
        // URLs should be validated but not escaped as HTML
        const safeIconUrl = iconUrl; // Use URL directly, not escaped
        const safeFallbackIcon = fallbackIcon; // Use URL directly

        // ✅ FIX: Use safer method to create elements instead of innerHTML
        const button = document.createElement('button');
        button.className = 'favorite-btn favorited';
        button.title = 'إزالة من المفضلة';
        button.setAttribute('aria-label', 'إزالة من المفضلة');
        button.innerHTML = '<i class="fas fa-star"></i>';

        const link = document.createElement('a');
        link.href = safeUrl === '#' ? '#' : favorite.url; // Use original URL, not escaped
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        const img = document.createElement('img');
        // ✅ FIX: Set src directly without escaping - it's a URL attribute
        img.src = safeIconUrl;
        img.alt = safeTitle;
        img.className = 'icon-image';
        img.loading = 'lazy';
        
        // Handle image load
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
        
        img.addEventListener('error', function() {
            // Try fallback icon
            if (this.src !== safeFallbackIcon) {
                this.src = safeFallbackIcon;
            } else {
                // If fallback also fails, use placeholder
                this.src = `https://via.placeholder.com/32x32?text=${encodeURIComponent((favorite.title.charAt(0) || '?').toUpperCase())}`;
                this.classList.add('loaded');
            }
        });
        
        // Check if image is already loaded
        if (img.complete) {
            img.classList.add('loaded');
        }

        const titleSpan = document.createElement('span');
        titleSpan.className = 'title';
        titleSpan.textContent = safeTitle;

        const descSpan = document.createElement('span');
        descSpan.className = 'description';
        descSpan.textContent = safeDescription;

        link.appendChild(img);
        link.appendChild(titleSpan);
        link.appendChild(descSpan);

        card.appendChild(button);
        card.appendChild(link);

        // Add click handler to favorite button
        const favoriteBtn = card.querySelector('.favorite-btn');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                try {
                    removeFavorite(favorite.url);
                    displayFavorites();
                    showToast('info', 'تم إزالة من المفضلة');
                    
                    // Update original card button
                    updateAllFavoriteButtons();
                } catch (error) {showToast('error', 'فشل إزالة من المفضلة');
                }
            });
        }

        // Add click handler to card
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.favorite-btn')) {
                try {
                    openLink(favorite.url);
                } catch (error) {showToast('error', 'فشل فتح الرابط');
                }
            }
        });

        // Add drag and drop handlers (with error handling)
        try {
            setupDragAndDrop(card, index);
        } catch (dragError) {// Continue without drag and drop if it fails
        }

        return card;
    } catch (error) {return null;
    }
}

/**
 * Setup drag and drop for a favorite card
 * إعداد السحب والإفلات لبطاقة مفضلة
 * @param {HTMLElement} card - Card element
 * @param {number} index - Card index
 */
function setupDragAndDrop(card, index) {
    let draggedElement = null;
    let draggedIndex = null;

    // Drag start
    card.addEventListener('dragstart', (e) => {
        draggedElement = card;
        draggedIndex = index;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', card.innerHTML);
        
        // Make card semi-transparent while dragging
        setTimeout(() => {
            card.style.opacity = '0.5';
        }, 0);
    });

    // Drag end
    card.addEventListener('dragend', (e) => {
        card.classList.remove('dragging');
        card.style.opacity = '1';
        
        // Remove all drag-over classes
        document.querySelectorAll('.drag-over').forEach(el => {
            el.classList.remove('drag-over');
        });
    });

    // Drag over - ✅ FIX: Instant reordering with error handling
    card.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        if (draggedElement && draggedElement !== card) {
            try {
                const targetIndex = parseInt(card.getAttribute('data-index'));
                const currentDraggedIndex = parseInt(draggedElement.getAttribute('data-index'));
                
                // Validate indices
                if (isNaN(targetIndex) || isNaN(currentDraggedIndex)) {
                    return;
                }
                
                // ✅ Reorder immediately while dragging
                if (targetIndex !== currentDraggedIndex && 
                    targetIndex >= 0 && targetIndex < favorites.length &&
                    currentDraggedIndex >= 0 && currentDraggedIndex < favorites.length) {
                    
                    // Reorder in array
                    const [movedItem] = favorites.splice(currentDraggedIndex, 1);
                    favorites.splice(targetIndex, 0, movedItem);
                    
                    // Update display instantly (with error handling)
                    try {
                        displayFavorites();
                        
                        // Update references
                        draggedElement = favoritesGrid.querySelector(`[data-index="${targetIndex}"]`);
                        if (draggedElement) {
                            draggedElement.classList.add('dragging');
                            draggedElement.style.opacity = '0.5';
                        }
                    } catch (displayError) {// Revert the array change if display fails
                        favorites.splice(targetIndex, 1);
                        favorites.splice(currentDraggedIndex, 0, movedItem);
                    }
                }
            } catch (error) {}
        }
    });

    // Drag leave
    card.addEventListener('dragleave', (e) => {
        card.classList.remove('drag-over');
    });

    // Drop - ✅ Just save, no need to reorder again
    card.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            card.classList.remove('drag-over');
            
            // Save the final order
            saveFavoritesToStorage();
            showToast('success', 'تم إعادة الترتيب');
        } catch (error) {showToast('error', 'فشل إعادة الترتيب');
        }
    });
}

/**
 * Update all favorite buttons in page
 * تحديث جميع أزرار المفضلة
 */
function updateAllFavoriteButtons() {
    try {
        const cards = getAllCards();
        if (!Array.isArray(cards)) return;
        
        cards.forEach(card => {
            try {
                if (!card || !card.nodeType || card.nodeType !== Node.ELEMENT_NODE) {
                    return;
                }
                const url = card.getAttribute('data-url');
                if (!url) return;
                
                const favoriteBtn = card.querySelector('.favorite-btn');
                if (favoriteBtn) {
                    const isFavorited = isFavorite(url);
                    updateFavoriteButton(favoriteBtn, isFavorited);
                }
            } catch (cardError) {// Continue with other cards
            }
        });
    } catch (error) {// Don't break the page
    }
}

/**
 * Handle storage changes (multi-tab sync)
 * @param {StorageEvent} event - Storage event
 */
function handleStorageChange(event) {
    try {
        if (event.key === APP_CONFIG.storage.favorites) {
            loadFavoritesFromStorage();
            displayFavorites();
            updateAllFavoriteButtons();
        }
    } catch (error) {// Don't break the page if storage sync fails
    }
}

/**
 * Get all favorites
 * الحصول على جميع المفضلة
 * @returns {Array} - Favorites array
 */
export function getFavorites() {
    try {
        if (!Array.isArray(favorites)) {
            favorites = [];
        }
        return [...favorites];
    } catch (error) {return [];
    }
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
 * Export favorites as JSON file
 * تصدير المفضلة كملف JSON
 */
export function exportFavoritesAsFile() {
    const data = exportFavorites();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `favorites-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('success', 'تم تصدير المفضلة');
}

/**
 * Export favorites as CSV
 * تصدير المفضلة كـ CSV
 */
export function exportFavoritesAsCSV() {
    const headers = ['Title', 'URL', 'Description', 'Category', 'Added At'];
    const rows = favorites.map(fav => [
        fav.title,
        fav.url,
        fav.description,
        fav.category || '',
        fav.addedAt || ''
    ]);
    
    const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `favorites-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('success', 'تم تصدير المفضلة كـ CSV');
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
    } catch (error) {showToast('error', 'فشل استيراد المفضلة');
        return false;
    }
}

/**
 * Import favorites from file
 * استيراد المفضلة من ملف
 */
export function importFavoritesFromFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            importFavorites(event.target.result);
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// Export all
export default {
    initializeFavorites,
    toggleFavorite,
    isFavorite,
    getFavorites,
    clearFavorites,
    exportFavorites,
    exportFavoritesAsFile,
    exportFavoritesAsCSV,
    importFavorites,
    importFavoritesFromFile
};
