/**
 * Favorites Drag and Drop Management
 * مسؤول فقط عن: وظائف السحب والإفلات
 * SRP: Single Responsibility - Drag and drop operations only
 */

import favoritesState from './state.js';
import favoritesStorage from './storage.js';
import FavoritesDisplay from './display.js';
import FavoritesValidator from './validators.js';
import { showToast } from '../../utils/ui.js';

class FavoritesDragDrop {
    constructor() {
        this.draggedElement = null;
        this.draggedIndex = null;
    }

    /**
     * Initialize drag and drop for all cards
     */
    initializeForGrid() {
        const grid = favoritesState.favoritesGrid;
        if (!grid) return;

        // Use event delegation for better performance
        grid.addEventListener('dragstart', this.handleDragStart.bind(this));
        grid.addEventListener('dragend', this.handleDragEnd.bind(this));
        grid.addEventListener('dragover', this.handleDragOver.bind(this));
        grid.addEventListener('dragleave', this.handleDragLeave.bind(this));
        grid.addEventListener('drop', this.handleDrop.bind(this));
    }

    /**
     * Handle drag start
     */
    handleDragStart(e) {
        const card = e.target.closest('.card[draggable="true"]');
        if (!card) return;

        this.draggedElement = card;
        this.draggedIndex = parseInt(card.getAttribute('data-index'));
        
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', card.innerHTML);
        
        // Make card semi-transparent while dragging
        setTimeout(() => {
            card.style.opacity = '0.5';
        }, 0);
    }

    /**
     * Handle drag end
     */
    handleDragEnd(e) {
        const card = e.target.closest('.card[draggable="true"]');
        if (!card) return;

        card.classList.remove('dragging');
        card.style.opacity = '1';
        
        // Remove all drag-over classes
        document.querySelectorAll('.drag-over').forEach(el => {
            el.classList.remove('drag-over');
        });

        // Reset drag state
        this.draggedElement = null;
        this.draggedIndex = null;
    }

    /**
     * Handle drag over
     */
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const card = e.target.closest('.card[draggable="true"]');
        if (!card || !this.draggedElement || this.draggedElement === card) return;

        try {
            const targetIndex = parseInt(card.getAttribute('data-index'));
            const currentDraggedIndex = parseInt(this.draggedElement.getAttribute('data-index'));
            
            // Validate indices
            if (!FavoritesValidator.areValidDragIndices(
                currentDraggedIndex, 
                targetIndex, 
                favoritesState.getFavorites().length
            )) {
                return;
            }
            
            // Reorder immediately while dragging
            this.performReorder(currentDraggedIndex, targetIndex);
            
        } catch (error) {
            // Silent fail during drag
        }
    }

    /**
     * Handle drag leave
     */
    handleDragLeave(e) {
        const card = e.target.closest('.card[draggable="true"]');
        if (card) {
            card.classList.remove('drag-over');
        }
    }

    /**
     * Handle drop
     */
    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const card = e.target.closest('.card[draggable="true"]');
        if (card) {
            card.classList.remove('drag-over');
        }

        try {
            // Save the final order
            favoritesStorage.save(favoritesState.getFavorites());
            showToast('success', 'تم إعادة الترتيب');
        } catch (error) {
            showToast('error', 'فشل إعادة الترتيب');
        }
    }

    /**
     * Perform reorder operation
     */
    performReorder(fromIndex, toIndex) {
        // Reorder in state
        if (favoritesState.reorderFavorites(fromIndex, toIndex)) {
            // Update display instantly
            try {
                FavoritesDisplay.display();
                
                // Update dragged element reference
                const grid = favoritesState.favoritesGrid;
                if (grid) {
                    this.draggedElement = grid.querySelector(`[data-index="${toIndex}"]`);
                    if (this.draggedElement) {
                        this.draggedElement.classList.add('dragging');
                        this.draggedElement.style.opacity = '0.5';
                    }
                }
            } catch (error) {
                // Revert on display error
                favoritesState.reorderFavorites(toIndex, fromIndex);
            }
        }
    }

    /**
     * Enable drag and drop for a specific card
     */
    static setupCardDragDrop(card, index) {
        card.setAttribute('draggable', 'true');
        card.setAttribute('data-index', index);
    }

    /**
     * Disable drag and drop for a card
     */
    static disableCardDragDrop(card) {
        card.setAttribute('draggable', 'false');
        card.removeAttribute('data-index');
    }
}

// Singleton instance
const favoritesDragDrop = new FavoritesDragDrop();

export default favoritesDragDrop;
export { FavoritesDragDrop };
