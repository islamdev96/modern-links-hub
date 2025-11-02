/**
 * Favorites Event Handling
 * مسؤول فقط عن: معالجة الأحداث المتعلقة بالمفضلات
 * SRP: Single Responsibility - Event handling only
 */

import favoritesState from './state.js';
import favoritesStorage from './storage.js';
import FavoritesDisplay from './display.js';
import FavoritesValidator from './validators.js';
import { showToast, openLink } from '../../utils/ui.js';
import { APP_CONFIG } from '../../core/config.js';

class FavoritesEvents {
    /**
     * Initialize all event listeners
     */
    static initialize() {
        this.setupStorageListener();
        this.setupCardClickHandlers();
        this.setupFavoriteButtonHandlers();
    }

    /**
     * Setup storage event listener for multi-tab sync
     */
    static setupStorageListener() {
        if (APP_CONFIG.features.multiTabSync) {
            window.addEventListener('storage', this.handleStorageChange.bind(this));
        }
    }

    /**
     * Handle storage changes
     */
    static handleStorageChange(event) {
        try {
            if (event.key === APP_CONFIG.storage.favorites) {
                // Reload favorites from storage
                const favorites = favoritesStorage.load();
                const cleanedFavorites = FavoritesValidator.cleanFavorites(favorites);
                favoritesState.setFavorites(cleanedFavorites);
                
                // Update display
                FavoritesDisplay.display();
                FavoritesDisplay.updateCounter();
                
                // Update all buttons
                this.updateAllFavoriteButtons();
            }
        } catch (error) {
            // Silent fail for storage sync
        }
    }

    /**
     * Setup card click handlers
     */
    static setupCardClickHandlers() {
        // Use event delegation on the favorites grid
        const grid = favoritesState.favoritesGrid;
        if (!grid) return;

        grid.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            if (!card) return;

            // If not clicking on favorite button, open the link
            if (!e.target.closest('.favorite-btn')) {
                const url = card.getAttribute('data-url');
                if (url) {
                    try {
                        openLink(url);
                    } catch (error) {
                        showToast('error', 'فشل فتح الرابط');
                    }
                }
            }
        });
    }

    /**
     * Setup favorite button handlers
     */
    static setupFavoriteButtonHandlers() {
        // Use event delegation on the favorites grid
        const grid = favoritesState.favoritesGrid;
        if (!grid) return;

        grid.addEventListener('click', (e) => {
            const button = e.target.closest('.favorite-btn');
            if (!button) return;

            e.stopPropagation();
            e.preventDefault();

            const card = button.closest('.card');
            if (card) {
                this.handleFavoriteButtonClick(card);
            }
        });
    }

    /**
     * Handle favorite button click
     */
    static handleFavoriteButtonClick(card) {
        const url = card.getAttribute('data-url');
        if (!url) return;

        try {
            // Remove from favorites
            if (favoritesState.removeFavorite(url)) {
                // Save to storage
                favoritesStorage.save(favoritesState.getFavorites());
                
                // Update display
                FavoritesDisplay.display();
                FavoritesDisplay.updateCounter();
                
                // Update original card buttons
                this.updateAllFavoriteButtons();
                
                showToast('info', 'تم إزالة من المفضلة');
            }
        } catch (error) {
            showToast('error', 'فشل إزالة من المفضلة');
        }
    }

    /**
     * Update all favorite buttons in the main grid
     */
    static updateAllFavoriteButtons() {
        // This will be called from the main cards module
        // Emit custom event for cards module to handle
        window.dispatchEvent(new CustomEvent('favoritesUpdated', {
            detail: { favorites: favoritesState.getFavorites() }
        }));
    }

    /**
     * Toggle favorite for a card
     */
    static toggleFavorite(cardElement, cardData) {
        try {
            if (!FavoritesValidator.isValidFavorite(cardData)) {
                return false;
            }

            const url = cardData.url;
            const isFavorited = favoritesState.isFavorite(url);

            if (isFavorited) {
                // Remove from favorites
                favoritesState.removeFavorite(url);
                showToast('info', 'تم إزالة من المفضلة');
            } else {
                // Add to favorites
                const normalizedData = FavoritesValidator.normalizeFavorite(cardData);
                favoritesState.addFavorite(normalizedData);
                showToast('success', 'تم الإضافة للمفضلة');
            }

            // Save to storage
            favoritesStorage.save(favoritesState.getFavorites());
            
            // Update display
            FavoritesDisplay.display();
            FavoritesDisplay.updateCounter();
            
            return true;
        } catch (error) {
            showToast('error', 'حدث خطأ في تعديل المفضلة');
            return false;
        }
    }
}

export default FavoritesEvents;
