/**
 * Search and Filter Module
 * نظام البحث والتصفية
 */

import { debounce } from '../utils/functions.js';
import { getAllCards, setCardVisibility, filterCardsBySearch, getCardsByCategory } from './cards.js';
import { getFavorites, displayFavorites } from '../features/favorites/index.js';

let searchInput = null;
let clearSearchBtn = null;
let filterButtons = [];
let currentFilter = 'all';
let currentSearch = '';

/**
 * Initialize search and filter system
 * تهيئة نظام البحث والتصفية
 */
export function initializeSearch() {
    searchInput = document.getElementById('searchInput');
    clearSearchBtn = document.getElementById('clearSearch');
    filterButtons = Array.from(document.querySelectorAll('.filter-btn'));

    if (!searchInput) return;

    // Setup search input
    searchInput.addEventListener('input', debounce(handleSearch, 300));

    // Setup clear button
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', clearSearch);
    }

    // Setup filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => handleFilterClick(btn));
    });

    // Update counters
    updateCardCounters();
}

/**
 * Handle search input
 * معالجة البحث
 * @param {Event} event - Input event
 */
function handleSearch(event) {
    currentSearch = event.target.value.toLowerCase().trim();
    
    // Show/hide clear button
    if (clearSearchBtn) {
        clearSearchBtn.style.display = currentSearch ? 'block' : 'none';
    }

    // Apply filters
    applyFilters();
}

/**
 * Clear search
 * مسح البحث
 */
function clearSearch() {
    if (searchInput) {
        searchInput.value = '';
        currentSearch = '';
    }
    
    if (clearSearchBtn) {
        clearSearchBtn.style.display = 'none';
    }

    applyFilters();
}

/**
 * Handle filter button click
 * معالجة النقر على زر التصفية
 * @param {HTMLElement} button - Clicked button
 */
function handleFilterClick(button) {
    // Remove active class from all buttons
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });

    // Add active class to clicked button
    button.classList.add('active');
    button.setAttribute('aria-selected', 'true');

    // Update current filter
    currentFilter = button.getAttribute('data-category');

    // Apply filters
    applyFilters();
}

/**
 * Apply search and category filters
 * تطبيق البحث والتصفية
 */
function applyFilters() {
    const allCards = getAllCards();
    const linksGrid = document.getElementById('linksGrid');
    const favoritesSection = document.getElementById('favoritesSection');

    // ✅ FIX: Always hide the separate favorites section
    if (favoritesSection) favoritesSection.style.display = 'none';
    
    // ✅ FIX: Always show main grid
    if (linksGrid) linksGrid.style.display = 'grid';

    // Get cards matching search
    let matchingCards = currentSearch 
        ? filterCardsBySearch(currentSearch)
        : allCards;

    // ✅ FIX: Special handling for favorites filter
    if (currentFilter === 'favorites') {
        // Show only favorited cards
        try {
            const favorites = getFavorites();
            const favoriteUrls = favorites.map(fav => fav.url);
            
            matchingCards = matchingCards.filter(card => 
                favoriteUrls.includes(card.getAttribute('data-url'))
            );
        } catch (e) {matchingCards = [];
        }
    } else if (currentFilter !== 'all') {
        // Get cards matching category
        matchingCards = matchingCards.filter(card => 
            card.getAttribute('data-category') === currentFilter
        );
    }

    // Update visibility
    allCards.forEach(card => {
        const isVisible = matchingCards.includes(card);
        setCardVisibility(card, isVisible);
    });

    // Show/hide empty state
    showEmptyState(matchingCards.length === 0);

    // Animate results
    animateResults(matchingCards);
}

/**
 * Show or hide empty state message
 * عرض أو إخفاء رسالة عدم وجود نتائج
 * @param {boolean} show - Should show empty state
 */
function showEmptyState(show) {
    const linksGrid = document.getElementById('linksGrid');
    if (!linksGrid) return;
    
    let emptyState = linksGrid.querySelector('.empty-state');
    
    if (show) {
        if (!emptyState) {
            emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <div class="empty-state-content">
                    <i class="fas fa-search empty-state-icon"></i>
                    <h3>لا توجد نتائج</h3>
                    <p>جرب البحث بكلمات مختلفة أو غيّر الفئة</p>
                </div>
            `;
            linksGrid.appendChild(emptyState);
        }
        emptyState.style.display = 'flex';
    } else {
        if (emptyState) {
            emptyState.style.display = 'none';
        }
    }
}

/**
 * Animate search results
 * تحريك نتائج البحث
 * @param {Array<HTMLElement>} cards - Visible cards
 */
function animateResults(cards) {
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'fadeUp 0.3s ease-out';
        }, index * 30);
    });
}

/**
 * Update card counters on filter buttons
 * تحديث عدادات البطاقات
 */
function updateCardCounters() {
    filterButtons.forEach(btn => {
        const category = btn.getAttribute('data-category');
        let count = 0;

        if (category === 'all') {
            count = getAllCards().length;
        } else if (category === 'favorites') {
            // Get favorites count
            try {
                count = getFavorites().length;
            } catch (e) {
                count = 0;
            }
        } else {
            count = getCardsByCategory(category).length;
        }

        // Update or create badge
        let badge = btn.querySelector('.badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'badge';
            btn.appendChild(badge);
        }
        badge.textContent = count;
    });
}

/**
 * Update favorites counter
 * تحديث عداد المفضلة
 * @param {number} count - Favorites count
 */
export function updateFavoritesCounter(count) {
    const favoritesBtn = filterButtons.find(btn => 
        btn.getAttribute('data-category') === 'favorites'
    );

    if (favoritesBtn) {
        let badge = favoritesBtn.querySelector('.badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'badge';
            favoritesBtn.appendChild(badge);
        }
        badge.textContent = count;
    }
}

/**
 * Get current filter
 * الحصول على التصفية الحالية
 * @returns {string} - Current filter category
 */
export function getCurrentFilter() {
    return currentFilter;
}

/**
 * Get current search term
 * الحصول على مصطلح البحث الحالي
 * @returns {string} - Current search term
 */
export function getCurrentSearch() {
    return currentSearch;
}

/**
 * Set filter programmatically
 * تعيين التصفية برمجياً
 * @param {string} category - Category to filter
 */
export function setFilter(category) {
    const button = filterButtons.find(btn => 
        btn.getAttribute('data-category') === category
    );

    if (button) {
        handleFilterClick(button);
    }
}

/**
 * Reset all filters
 * إعادة تعيين جميع التصفيات
 */
export function resetFilters() {
    clearSearch();
    setFilter('all');
}

// Export all
export default {
    initializeSearch,
    updateCardCounters,
    updateFavoritesCounter,
    getCurrentFilter,
    getCurrentSearch,
    setFilter,
    resetFilters
};
