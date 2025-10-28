/**
 * Search and Filter Module
 * نظام البحث والتصفية
 */

import { debounce } from './utils.js';
import { getAllCards, setCardVisibility, filterCardsBySearch, getCardsByCategory } from './cards.js';

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

    // Get cards matching search
    let matchingCards = currentSearch 
        ? filterCardsBySearch(currentSearch)
        : allCards;

    // Get cards matching category
    if (currentFilter !== 'all' && currentFilter !== 'favorites') {
        matchingCards = matchingCards.filter(card => 
            card.getAttribute('data-category') === currentFilter
        );
    }

    // Update visibility
    allCards.forEach(card => {
        const isVisible = matchingCards.includes(card);
        setCardVisibility(card, isVisible);
    });

    // Animate results
    animateResults(matchingCards);
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
            // Will be updated by favorites module
            count = 0;
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
