/**
 * Favorites State Management
 * مسؤول فقط عن: إدارة حالة المفضلات
 * SRP: Single Responsibility - State management only
 */

class FavoritesState {
    constructor() {
        this.favorites = [];
        this.favoritesSection = null;
        this.favoritesGrid = null;
        this.isDisplaying = false;
    }

    /**
     * Initialize DOM references
     */
    initializeDOMReferences(selectors) {
        this.favoritesSection = document.querySelector(selectors.FAVORITES_SECTION);
        this.favoritesGrid = document.querySelector(selectors.FAVORITES_GRID);
    }

    /**
     * Set favorites array
     */
    setFavorites(favorites) {
        if (Array.isArray(favorites)) {
            this.favorites = favorites;
        }
    }

    /**
     * Get all favorites (immutable copy)
     */
    getFavorites() {
        return [...this.favorites];
    }

    /**
     * Add a favorite
     */
    addFavorite(favorite) {
        if (favorite && !this.isFavorite(favorite.url)) {
            this.favorites.push(favorite);
            return true;
        }
        return false;
    }

    /**
     * Remove a favorite by URL
     */
    removeFavorite(url) {
        const initialLength = this.favorites.length;
        this.favorites = this.favorites.filter(fav => fav.url !== url);
        return this.favorites.length !== initialLength;
    }

    /**
     * Check if URL is in favorites
     */
    isFavorite(url) {
        return this.favorites.some(fav => fav.url === url);
    }

    /**
     * Clear all favorites
     */
    clearAll() {
        this.favorites = [];
    }

    /**
     * Reorder favorites
     */
    reorderFavorites(fromIndex, toIndex) {
        if (fromIndex >= 0 && fromIndex < this.favorites.length &&
            toIndex >= 0 && toIndex < this.favorites.length) {
            const [movedItem] = this.favorites.splice(fromIndex, 1);
            this.favorites.splice(toIndex, 0, movedItem);
            return true;
        }
        return false;
    }

    /**
     * Set display flag
     */
    setIsDisplaying(value) {
        this.isDisplaying = value;
    }

    /**
     * Get display flag
     */
    getIsDisplaying() {
        return this.isDisplaying;
    }
}

// Singleton instance
const favoritesState = new FavoritesState();

export default favoritesState;
export { FavoritesState };
