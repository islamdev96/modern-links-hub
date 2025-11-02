/**
 * Favorites Button Management
 * مسؤول فقط عن: إدارة أزرار المفضلة
 * SRP: Single Responsibility - Button operations only
 */

import favoritesState from './state.js';
import { SELECTORS } from '../../core/constants.js';

class FavoritesButtons {
    /**
     * Add favorite button to a card
     */
    static addToCard(card) {
        try {
            if (!card || card.nodeType !== Node.ELEMENT_NODE) {
                return null;
            }

            // Check if button already exists
            let favoriteBtn = card.querySelector(SELECTORS.FAVORITE_BTN);
            
            if (!favoriteBtn) {
                favoriteBtn = this.createButton();
                this.insertButton(card, favoriteBtn);
            }

            // Update button state
            const url = card.getAttribute('data-url');
            if (url) {
                const isFavorited = favoritesState.isFavorite(url);
                this.updateButtonState(favoriteBtn, isFavorited);
            }

            return favoriteBtn;
        } catch (error) {
            return null;
        }
    }

    /**
     * Create favorite button element
     */
    static createButton() {
        const button = document.createElement('button');
        button.className = 'favorite-btn';
        button.title = 'إضافة للمفضلة';
        button.setAttribute('aria-label', 'إضافة للمفضلة');
        button.innerHTML = '<i class="fas fa-star"></i>';
        return button;
    }

    /**
     * Insert button into card
     */
    static insertButton(card, button) {
        if (card.firstChild) {
            card.insertBefore(button, card.firstChild);
        } else {
            card.appendChild(button);
        }
    }

    /**
     * Update button state
     */
    static updateButtonState(button, isFavorited) {
        if (!button || button.nodeType !== Node.ELEMENT_NODE) {
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
    }

    /**
     * Update all favorite buttons in the page
     */
    static updateAllButtons(cards) {
        if (!Array.isArray(cards)) return;
        
        cards.forEach(card => {
            try {
                if (!card || card.nodeType !== Node.ELEMENT_NODE) {
                    return;
                }
                
                const url = card.getAttribute('data-url');
                if (!url) return;
                
                const favoriteBtn = card.querySelector('.favorite-btn');
                if (favoriteBtn) {
                    const isFavorited = favoritesState.isFavorite(url);
                    this.updateButtonState(favoriteBtn, isFavorited);
                }
            } catch (error) {
                // Continue with other cards
            }
        });
    }

    /**
     * Remove event listeners from button (cleanup)
     */
    static cleanupButton(button) {
        if (!button) return;
        
        // Clone node to remove all event listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        return newButton;
    }

    /**
     * Add click handler to button
     */
    static addClickHandler(button, handler) {
        if (!button || typeof handler !== 'function') return;
        
        // Remove old listeners first
        const cleanButton = this.cleanupButton(button);
        
        // Add new handler
        cleanButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            handler(e);
        });
        
        return cleanButton;
    }

    /**
     * Get button from card
     */
    static getButtonFromCard(card) {
        if (!card) return null;
        return card.querySelector(SELECTORS.FAVORITE_BTN);
    }

    /**
     * Check if button is favorited
     */
    static isButtonFavorited(button) {
        if (!button) return false;
        return button.classList.contains('favorited');
    }
}

export default FavoritesButtons;
