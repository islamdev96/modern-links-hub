/**
 * Cards Module
 * إدارة البطاقات والتفاعل معها
 */

import { openLink, getCardIcon, animate } from './utils.js';

let cards = [];

/**
 * Initialize all cards
 * تهيئة جميع البطاقات
 */
export function initializeCards() {
    cards = Array.from(document.querySelectorAll('.card'));
    
    // Add data attributes if missing
    cards.forEach(card => {
        ensureCardData(card);
    });
    
    // Add event listeners using delegation
    setupCardListeners();
    
    // Initialize animations
    addCardAnimations();
}

/**
 * Ensure card has all required data attributes
 * التأكد من وجود جميع البيانات المطلوبة
 * @param {HTMLElement} card - Card element
 */
function ensureCardData(card) {
    const link = card.querySelector('a');
    if (!link) return;
    
    const title = card.querySelector('.title')?.textContent || '';
    const description = card.querySelector('.description')?.textContent || '';
    const url = link.getAttribute('href') || '';
    
    // ✅ FIX: Get icon from actual img src, not data-icon
    const icon = getCardIcon(card);
    
    // Set attributes only if missing
    if (!card.getAttribute('data-url')) {
        card.setAttribute('data-url', url);
    }
    if (!card.getAttribute('data-title')) {
        card.setAttribute('data-title', title);
    }
    if (!card.getAttribute('data-description')) {
        card.setAttribute('data-description', description);
    }
    // ✅ FIX: Update data-icon to match actual icon
    if (icon) {
        card.setAttribute('data-icon', icon);
    }
}

/**
 * Setup event listeners for cards using delegation
 * إعداد مستمعات الأحداث باستخدام Event Delegation
 */
function setupCardListeners() {
    const linksGrid = document.getElementById('linksGrid');
    if (!linksGrid) return;
    
    // Single event listener for all cards (Event Delegation)
    linksGrid.addEventListener('click', handleCardClick);
    linksGrid.addEventListener('keydown', handleCardKeydown);
}

/**
 * Handle card click event
 * معالجة النقر على البطاقة
 * @param {Event} event - Click event
 */
function handleCardClick(event) {
    // Don't open link if clicking on favorite button
    if (event.target.closest('.favorite-btn')) {
        return;
    }
    
    const card = event.target.closest('.card');
    if (!card) return;
    
    const url = card.getAttribute('data-url');
    if (url) {
        openLink(url);
    }
}

/**
 * Handle keyboard navigation
 * معالجة التنقل بلوحة المفاتيح
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleCardKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        const card = event.target.closest('.card');
        if (card) {
            event.preventDefault();
            const url = card.getAttribute('data-url');
            if (url) {
                openLink(url);
            }
        }
    }
}

/**
 * Add animations to cards
 * إضافة الحركات للبطاقات
 */
function addCardAnimations() {
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.05}s`;
        card.classList.add('fade-in');
    });
}

/**
 * Add hover effects
 * إضافة تأثيرات التمرير
 */
export function setupHoverEffects() {
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('hidden')) {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/**
 * Get card by URL
 * الحصول على بطاقة من خلال الرابط
 * @param {string} url - Card URL
 * @returns {HTMLElement|null} - Card element or null
 */
export function getCardByUrl(url) {
    return cards.find(card => card.getAttribute('data-url') === url) || null;
}

/**
 * Get all cards
 * الحصول على جميع البطاقات
 * @returns {Array<HTMLElement>} - Array of card elements
 */
export function getAllCards() {
    return cards;
}

/**
 * Get cards by category
 * الحصول على بطاقات حسب الفئة
 * @param {string} category - Category name
 * @returns {Array<HTMLElement>} - Array of card elements
 */
export function getCardsByCategory(category) {
    if (category === 'all') {
        return cards;
    }
    return cards.filter(card => card.getAttribute('data-category') === category);
}

/**
 * Update card visibility
 * تحديث ظهور البطاقة
 * @param {HTMLElement} card - Card element
 * @param {boolean} visible - Should be visible
 */
export function setCardVisibility(card, visible) {
    if (visible) {
        card.classList.remove('hidden', 'fade-out');
        card.classList.add('fade-in');
    } else {
        card.classList.add('hidden', 'fade-out');
        card.classList.remove('fade-in');
    }
}

/**
 * Filter cards by search term
 * تصفية البطاقات حسب البحث
 * @param {string} searchTerm - Search term
 * @returns {Array<HTMLElement>} - Matching cards
 */
export function filterCardsBySearch(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    
    if (!term) {
        return cards;
    }
    
    return cards.filter(card => {
        const title = (card.getAttribute('data-title') || '').toLowerCase();
        const description = (card.getAttribute('data-description') || '').toLowerCase();
        const url = (card.getAttribute('data-url') || '').toLowerCase();
        
        return title.includes(term) || 
               description.includes(term) || 
               url.includes(term);
    });
}

/**
 * Highlight search term in card
 * تمييز مصطلح البحث في البطاقة
 * @param {HTMLElement} card - Card element
 * @param {string} searchTerm - Search term to highlight
 */
export function highlightSearchTerm(card, searchTerm) {
    if (!searchTerm) return;
    
    const title = card.querySelector('.title');
    const description = card.querySelector('.description');
    
    [title, description].forEach(element => {
        if (!element) return;
        
        const text = element.textContent;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const highlighted = text.replace(regex, '<span class="highlight">$1</span>');
        element.innerHTML = highlighted;
    });
}

/**
 * Remove search highlighting
 * إزالة التمييز من البحث
 * @param {HTMLElement} card - Card element
 */
export function removeHighlight(card) {
    const title = card.querySelector('.title');
    const description = card.querySelector('.description');
    
    [title, description].forEach(element => {
        if (!element) return;
        // Remove HTML tags and restore text
        element.textContent = element.textContent;
    });
}

/**
 * Sort cards by criteria
 * ترتيب البطاقات
 * @param {string} criteria - Sort criteria: 'name', 'category', 'date'
 * @param {boolean} ascending - Sort direction
 * @returns {Array<HTMLElement>} - Sorted cards
 */
export function sortCards(criteria = 'name', ascending = true) {
    const sorted = [...cards].sort((a, b) => {
        let valueA, valueB;
        
        switch (criteria) {
            case 'name':
                valueA = a.getAttribute('data-title') || '';
                valueB = b.getAttribute('data-title') || '';
                break;
            case 'category':
                valueA = a.getAttribute('data-category') || '';
                valueB = b.getAttribute('data-category') || '';
                break;
            default:
                return 0;
        }
        
        const comparison = valueA.localeCompare(valueB, 'ar');
        return ascending ? comparison : -comparison;
    });
    
    return sorted;
}

/**
 * Get card data as object
 * الحصول على بيانات البطاقة كـ object
 * @param {HTMLElement} card - Card element
 * @returns {Object} - Card data
 */
export function getCardData(card) {
    return {
        url: card.getAttribute('data-url') || '',
        title: card.getAttribute('data-title') || '',
        description: card.getAttribute('data-description') || '',
        icon: card.getAttribute('data-icon') || '',
        category: card.getAttribute('data-category') || ''
    };
}

/**
 * Export cards data as JSON
 * تصدير بيانات البطاقات كـ JSON
 * @returns {string} - JSON string
 */
export function exportCardsAsJSON() {
    const cardsData = cards.map(card => getCardData(card));
    return JSON.stringify(cardsData, null, 2);
}

// Export all
export default {
    initializeCards,
    setupHoverEffects,
    getCardByUrl,
    getAllCards,
    getCardsByCategory,
    setCardVisibility,
    filterCardsBySearch,
    highlightSearchTerm,
    removeHighlight,
    sortCards,
    getCardData,
    exportCardsAsJSON
};
