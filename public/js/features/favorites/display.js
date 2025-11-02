/**
 * Favorites Display Management
 * مسؤول فقط عن: عرض المفضلات في واجهة المستخدم
 * SRP: Single Responsibility - Display operations only
 */

import favoritesState from './state.js';
import FavoritesValidator from './validators.js';
import { ANIMATIONS } from '../../core/constants.js';

class FavoritesDisplay {
    /**
     * Display favorites in grid
     */
    static display() {
        // Prevent concurrent display calls
        if (favoritesState.getIsDisplaying()) {
            return;
        }

        try {
            favoritesState.setIsDisplaying(true);

            const { favoritesSection, favoritesGrid } = favoritesState;
            
            if (!favoritesSection || !favoritesGrid) {
                return;
            }

            const favorites = favoritesState.getFavorites();

            // Show/hide section based on favorites count
            if (favorites.length === 0) {
                this.hideSection();
                return;
            }

            this.showSection();
            this.clearGrid();
            this.renderFavorites(favorites);
            
        } finally {
            favoritesState.setIsDisplaying(false);
        }
    }

    /**
     * Show favorites section
     */
    static showSection() {
        if (favoritesState.favoritesSection) {
            favoritesState.favoritesSection.style.display = 'block';
        }
    }

    /**
     * Hide favorites section
     */
    static hideSection() {
        if (favoritesState.favoritesSection) {
            favoritesState.favoritesSection.style.display = 'none';
        }
    }

    /**
     * Clear grid safely
     */
    static clearGrid() {
        const grid = favoritesState.favoritesGrid;
        if (!grid) return;

        try {
            grid.innerHTML = '';
        } catch (error) {
            // Fallback method
            while (grid.firstChild) {
                grid.removeChild(grid.firstChild);
            }
        }
    }

    /**
     * Render favorites
     */
    static renderFavorites(favorites) {
        const grid = favoritesState.favoritesGrid;
        if (!grid) return;

        favorites.forEach((favorite, index) => {
            if (FavoritesValidator.isValidFavorite(favorite)) {
                const card = this.createFavoriteCard(favorite, index);
                if (card) {
                    grid.appendChild(card);
                }
            }
        });
    }

    /**
     * Create favorite card element
     */
    static createFavoriteCard(favorite, index) {
        try {
            const card = document.createElement('div');
            card.className = `card ${favorite.category || ''}`;
            
            // Set data attributes
            this.setCardAttributes(card, favorite, index);
            
            // Create card content
            const button = this.createFavoriteButton();
            const link = this.createCardLink(favorite);
            
            card.appendChild(button);
            card.appendChild(link);
            
            return card;
        } catch (error) {
            return null;
        }
    }

    /**
     * Set card attributes
     */
    static setCardAttributes(card, favorite, index) {
        card.setAttribute('data-url', favorite.url);
        card.setAttribute('data-title', favorite.title);
        card.setAttribute('data-description', favorite.description || '');
        card.setAttribute('data-icon', favorite.icon || '');
        card.setAttribute('data-index', index);
        card.setAttribute('draggable', 'true');
    }

    /**
     * Create favorite button
     */
    static createFavoriteButton() {
        const button = document.createElement('button');
        button.className = 'favorite-btn favorited';
        button.title = 'إزالة من المفضلة';
        button.setAttribute('aria-label', 'إزالة من المفضلة');
        button.innerHTML = '<i class="fas fa-star"></i>';
        return button;
    }

    /**
     * Create card link
     */
    static createCardLink(favorite) {
        const link = document.createElement('a');
        link.href = favorite.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        // Add link content
        const img = this.createCardImage(favorite);
        const title = this.createCardTitle(favorite.title);
        const description = this.createCardDescription(favorite.description);

        link.appendChild(img);
        link.appendChild(title);
        link.appendChild(description);

        return link;
    }

    /**
     * Create card image
     */
    static createCardImage(favorite) {
        const img = document.createElement('img');
        img.src = FavoritesValidator.getSafeIconUrl(favorite.icon, favorite.title);
        img.alt = favorite.title;
        img.className = 'icon-image';
        img.loading = 'lazy';

        // Handle image load events
        img.addEventListener('load', () => img.classList.add('loaded'));
        img.addEventListener('error', function() {
            this.src = FavoritesValidator.getSafeIconUrl('', favorite.title);
            this.classList.add('loaded');
        });

        if (img.complete) {
            img.classList.add('loaded');
        }

        return img;
    }

    /**
     * Create card title
     */
    static createCardTitle(title) {
        const span = document.createElement('span');
        span.className = 'title';
        span.textContent = title;
        return span;
    }

    /**
     * Create card description
     */
    static createCardDescription(description) {
        const span = document.createElement('span');
        span.className = 'description';
        span.textContent = description || '';
        return span;
    }

    /**
     * Update favorites counter
     */
    static updateCounter() {
        const countBadge = document.getElementById('count-favorites');
        if (countBadge) {
            countBadge.textContent = favoritesState.getFavorites().length;
        }
    }
}

export default FavoritesDisplay;
