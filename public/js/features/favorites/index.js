/**
 * Favorites Module Facade
 * الواجهة الرئيسية لنظام المفضلات
 * Pattern: Facade - Provides simplified interface to complex subsystem
 * SRP: Coordinates between all favorites sub-modules
 */

import favoritesState from './state.js';
import favoritesStorage from './storage.js';
import FavoritesValidator from './validators.js';
import FavoritesDisplay from './display.js';
import FavoritesEvents from './events.js';
import favoritesDragDrop from './drag-drop.js';
import FavoritesButtons from './buttons.js';
import FavoritesExportImport from './export-import.js';
import { SELECTORS } from '../../core/constants.js';
import { showToast } from '../../utils/ui.js';
import { getCardData, getAllCards } from '../../modules/cards.js';

class FavoritesManager {
    /**
     * Initialize favorites system
     */
    static initialize() {
        try {
            // Initialize DOM references
            favoritesState.initializeDOMReferences(SELECTORS);
            
            // Check if favorites section exists
            if (!favoritesState.favoritesSection || !favoritesState.favoritesGrid) {
                return false;
            }

            // Load favorites from storage
            this.loadFavorites();
            
            // Add favorite buttons to all cards
            this.addFavoriteButtons();
            
            // Display favorites
            FavoritesDisplay.display();
            
            // Initialize event handlers
            FavoritesEvents.initialize();
            
            // Initialize drag and drop
            favoritesDragDrop.initializeForGrid();
            
            // Update counter
            FavoritesDisplay.updateCounter();
            
            return true;
        } catch (error) {
            // Silent fail - don't break the page
            return false;
        }
    }

    /**
     * Load favorites from storage
     */
    static loadFavorites() {
        const stored = favoritesStorage.load();
        const cleaned = FavoritesValidator.cleanFavorites(stored);
        favoritesState.setFavorites(cleaned);
        
        // Save cleaned data back if changed
        if (cleaned.length !== stored.length) {
            favoritesStorage.save(cleaned);
        }
    }

    /**
     * Add favorite buttons to all cards
     */
    static addFavoriteButtons() {
        const cards = getAllCards();
        if (!Array.isArray(cards)) return;
        
        cards.forEach(card => {
            try {
                if (card && card.nodeType === Node.ELEMENT_NODE) {
                    const button = FavoritesButtons.addToCard(card);
                    
                    // Add click handler
                    if (button) {
                        FavoritesButtons.addClickHandler(button, () => {
                            this.toggleFavorite(card);
                        });
                    }
                }
            } catch (error) {
                // Continue with other cards
            }
        });
    }

    /**
     * Toggle favorite status for a card
     */
    static toggleFavorite(card) {
        try {
            // Get card data
            const cardData = getCardData(card);
            if (!FavoritesValidator.isValidFavorite(cardData)) {
                return false;
            }

            const url = cardData.url;
            const isFavorited = favoritesState.isFavorite(url);

            if (isFavorited) {
                // Remove from favorites
                this.removeFavorite(url);
                showToast('info', 'تم إزالة من المفضلة');
            } else {
                // Prepare card data with icon
                const iconElement = card.querySelector('.icon-image');
                if (iconElement && iconElement.src) {
                    cardData.icon = iconElement.src;
                } else {
                    cardData.icon = card.getAttribute('data-icon') || '';
                }
                
                // Normalize icon URL
                cardData.icon = FavoritesValidator.getSafeIconUrl(cardData.icon, cardData.title);
                
                // Add to favorites
                this.addFavorite(cardData);
                showToast('success', 'تم الإضافة للمفضلة');
            }

            // Update button state
            const button = FavoritesButtons.getButtonFromCard(card);
            if (button) {
                FavoritesButtons.updateButtonState(button, !isFavorited);
            }

            // Update display and counter
            FavoritesDisplay.display();
            FavoritesDisplay.updateCounter();
            
            return true;
        } catch (error) {
            showToast('error', 'حدث خطأ في تعديل المفضلة');
            return false;
        }
    }

    /**
     * Add to favorites
     */
    static addFavorite(cardData) {
        const normalized = FavoritesValidator.normalizeFavorite(cardData);
        
        if (favoritesState.addFavorite(normalized)) {
            favoritesStorage.save(favoritesState.getFavorites());
            return true;
        }
        return false;
    }

    /**
     * Remove from favorites
     */
    static removeFavorite(url) {
        if (favoritesState.removeFavorite(url)) {
            favoritesStorage.save(favoritesState.getFavorites());
            return true;
        }
        return false;
    }

    /**
     * Check if URL is in favorites
     */
    static isFavorite(url) {
        return favoritesState.isFavorite(url);
    }

    /**
     * Get all favorites
     */
    static getFavorites() {
        return favoritesState.getFavorites();
    }

    /**
     * Clear all favorites
     */
    static clearFavorites() {
        favoritesState.clearAll();
        favoritesStorage.save([]);
        FavoritesDisplay.display();
        FavoritesDisplay.updateCounter();
        FavoritesButtons.updateAllButtons(getAllCards());
        showToast('info', 'تم مسح جميع المفضلة');
    }

    /**
     * Display favorites
     */
    static displayFavorites() {
        FavoritesDisplay.display();
    }

    /**
     * Export favorites as JSON
     */
    static exportFavorites() {
        return FavoritesExportImport.exportAsJson();
    }

    /**
     * Export favorites as JSON file
     */
    static exportFavoritesAsFile() {
        FavoritesExportImport.exportAsJsonFile();
    }

    /**
     * Export favorites as CSV
     */
    static exportFavoritesAsCSV() {
        FavoritesExportImport.exportAsCsv();
    }

    /**
     * Import favorites from JSON
     */
    static importFavorites(jsonString) {
        const result = FavoritesExportImport.importFromJson(jsonString);
        if (result) {
            FavoritesButtons.updateAllButtons(getAllCards());
        }
        return result;
    }

    /**
     * Import favorites from file
     */
    static importFavoritesFromFile() {
        FavoritesExportImport.importFromFile();
    }

    /**
     * Merge import favorites
     */
    static mergeImportFavorites(jsonString) {
        const result = FavoritesExportImport.mergeImport(jsonString);
        if (result) {
            FavoritesButtons.updateAllButtons(getAllCards());
        }
        return result;
    }

    /**
     * Update all favorite buttons
     */
    static updateAllButtons() {
        FavoritesButtons.updateAllButtons(getAllCards());
    }

    /**
     * Get export statistics
     */
    static getStatistics() {
        return FavoritesExportImport.getExportStats();
    }
}

// Export main class and public methods
export default FavoritesManager;

// Named exports for specific functionality
export {
    FavoritesManager as Favorites,
    favoritesState as state,
    FavoritesValidator as validator,
    FavoritesDisplay as display,
    FavoritesEvents as events,
    FavoritesButtons as buttons,
    FavoritesExportImport as exportImport
};

// Public API
export const initializeFavorites = () => FavoritesManager.initialize();
export const toggleFavorite = (card) => FavoritesManager.toggleFavorite(card);
export const isFavorite = (url) => FavoritesManager.isFavorite(url);
export const getFavorites = () => FavoritesManager.getFavorites();
export const clearFavorites = () => FavoritesManager.clearFavorites();
export const displayFavorites = () => FavoritesManager.displayFavorites();
export const exportFavorites = () => FavoritesManager.exportFavorites();
export const exportFavoritesAsFile = () => FavoritesManager.exportFavoritesAsFile();
export const exportFavoritesAsCSV = () => FavoritesManager.exportFavoritesAsCSV();
export const importFavorites = (json) => FavoritesManager.importFavorites(json);
export const importFavoritesFromFile = () => FavoritesManager.importFavoritesFromFile();
