/**
 * Favorites Export/Import Management
 * مسؤول فقط عن: تصدير واستيراد المفضلات
 * SRP: Single Responsibility - Export/Import operations only
 */

import favoritesState from './state.js';
import favoritesStorage from './storage.js';
import FavoritesDisplay from './display.js';
import FavoritesValidator from './validators.js';
import { showToast } from '../../utils/ui.js';

class FavoritesExportImport {
    /**
     * Export favorites as JSON string
     */
    static exportAsJson() {
        const favorites = favoritesState.getFavorites();
        return JSON.stringify(favorites, null, 2);
    }

    /**
     * Export favorites as JSON file
     */
    static exportAsJsonFile() {
        try {
            const data = this.exportAsJson();
            const filename = this.generateFilename('json');
            this.downloadFile(data, filename, 'application/json');
            showToast('success', 'تم تصدير المفضلة');
        } catch (error) {
            showToast('error', 'فشل تصدير المفضلة');
        }
    }

    /**
     * Export favorites as CSV
     */
    static exportAsCsv() {
        try {
            const csvContent = this.convertToCSV();
            const filename = this.generateFilename('csv');
            this.downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
            showToast('success', 'تم تصدير المفضلة كـ CSV');
        } catch (error) {
            showToast('error', 'فشل تصدير المفضلة كـ CSV');
        }
    }

    /**
     * Convert favorites to CSV format
     */
    static convertToCSV() {
        const favorites = favoritesState.getFavorites();
        const headers = ['Title', 'URL', 'Description', 'Category', 'Added At'];
        
        const rows = favorites.map(fav => [
            fav.title,
            fav.url,
            fav.description,
            fav.category || '',
            fav.addedAt || ''
        ]);
        
        return [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
    }

    /**
     * Import favorites from JSON string
     */
    static importFromJson(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            
            if (!Array.isArray(imported)) {
                throw new Error('Invalid format: Expected array');
            }
            
            // Validate and clean imported data
            const cleanedFavorites = FavoritesValidator.cleanFavorites(imported);
            
            // Update state
            favoritesState.setFavorites(cleanedFavorites);
            
            // Save to storage
            favoritesStorage.save(cleanedFavorites);
            
            // Update display
            FavoritesDisplay.display();
            FavoritesDisplay.updateCounter();
            
            showToast('success', 'تم استيراد المفضلة');
            return true;
            
        } catch (error) {
            showToast('error', 'فشل استيراد المفضلة: ' + error.message);
            return false;
        }
    }

    /**
     * Import favorites from file
     */
    static importFromFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                this.importFromJson(event.target.result);
            };
            reader.onerror = () => {
                showToast('error', 'فشل قراءة الملف');
            };
            reader.readAsText(file);
        };
        
        input.click();
    }

    /**
     * Merge imported favorites with existing ones
     */
    static mergeImport(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            
            if (!Array.isArray(imported)) {
                throw new Error('Invalid format: Expected array');
            }
            
            const cleanedImported = FavoritesValidator.cleanFavorites(imported);
            const currentFavorites = favoritesState.getFavorites();
            
            // Merge unique favorites only (by URL)
            const mergedFavorites = [...currentFavorites];
            
            cleanedImported.forEach(importedFav => {
                if (!favoritesState.isFavorite(importedFav.url)) {
                    mergedFavorites.push(importedFav);
                }
            });
            
            // Update state
            favoritesState.setFavorites(mergedFavorites);
            
            // Save and update
            favoritesStorage.save(mergedFavorites);
            FavoritesDisplay.display();
            FavoritesDisplay.updateCounter();
            
            const addedCount = mergedFavorites.length - currentFavorites.length;
            showToast('success', `تم دمج ${addedCount} مفضلة جديدة`);
            return true;
            
        } catch (error) {
            showToast('error', 'فشل دمج المفضلة');
            return false;
        }
    }

    /**
     * Generate filename with timestamp
     */
    static generateFilename(extension) {
        const date = new Date().toISOString().split('T')[0];
        return `favorites-${date}.${extension}`;
    }

    /**
     * Download file
     */
    static downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }

    /**
     * Get export statistics
     */
    static getExportStats() {
        const favorites = favoritesState.getFavorites();
        const categories = {};
        
        favorites.forEach(fav => {
            const category = fav.category || 'uncategorized';
            categories[category] = (categories[category] || 0) + 1;
        });
        
        return {
            total: favorites.length,
            categories: categories,
            exportDate: new Date().toISOString()
        };
    }
}

export default FavoritesExportImport;
