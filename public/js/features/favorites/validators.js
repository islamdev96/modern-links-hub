/**
 * Favorites Data Validation
 * مسؤول فقط عن: التحقق من صحة البيانات
 * SRP: Single Responsibility - Validation only
 */

class FavoritesValidator {
    /**
     * Validate favorite object structure
     */
    static isValidFavorite(favorite) {
        return favorite && 
               typeof favorite === 'object' && 
               this.isValidUrl(favorite.url) && 
               this.isValidTitle(favorite.title);
    }

    /**
     * Validate URL
     */
    static isValidUrl(url) {
        return url && 
               typeof url === 'string' && 
               url.trim() !== '';
    }

    /**
     * Validate title
     */
    static isValidTitle(title) {
        return title && 
               typeof title === 'string' && 
               title.trim() !== '';
    }

    /**
     * Clean and validate favorites array
     */
    static cleanFavorites(favorites) {
        if (!Array.isArray(favorites)) {
            return [];
        }

        return favorites
            .filter(fav => this.isValidFavorite(fav))
            .map(fav => this.normalizeFavorite(fav));
    }

    /**
     * Normalize favorite object
     */
    static normalizeFavorite(favorite) {
        return {
            url: String(favorite.url).trim(),
            title: String(favorite.title).trim(),
            description: favorite.description ? String(favorite.description).trim() : '',
            icon: favorite.icon ? String(favorite.icon).trim() : '',
            category: favorite.category ? String(favorite.category).trim() : '',
            id: favorite.id || Date.now() + Math.random(),
            addedAt: favorite.addedAt || new Date().toISOString()
        };
    }

    /**
     * Validate icon URL
     */
    static isValidIconUrl(url) {
        if (!url || typeof url !== 'string') {
            return false;
        }

        const trimmedUrl = url.trim();
        
        // Check if it's a data URL or HTTP(S) URL
        return trimmedUrl.startsWith('data:') || 
               trimmedUrl.startsWith('http://') || 
               trimmedUrl.startsWith('https://') ||
               trimmedUrl.startsWith('/');
    }

    /**
     * Get safe icon URL
     */
    static getSafeIconUrl(icon, title = '') {
        if (this.isValidIconUrl(icon)) {
            // Convert relative URLs to absolute
            if (icon.startsWith('/')) {
                return window.location.origin + icon;
            }
            return icon;
        }

        // Return placeholder icon
        const initial = (title.charAt(0) || '?').toUpperCase();
        return `https://via.placeholder.com/32x32?text=${encodeURIComponent(initial)}`;
    }

    /**
     * Escape HTML to prevent XSS
     */
    static escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Validate drag indices
     */
    static areValidDragIndices(fromIndex, toIndex, arrayLength) {
        return fromIndex >= 0 && 
               fromIndex < arrayLength &&
               toIndex >= 0 && 
               toIndex < arrayLength &&
               fromIndex !== toIndex;
    }
}

export default FavoritesValidator;
