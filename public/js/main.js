/**
 * Main Entry Point
 * نقطة الدخول الرئيسية للتطبيق
 */

import { initializeTheme } from './modules/theme.js';
import { initializeCards } from './modules/cards.js';
import { initializeFavorites, getFavorites } from './modules/favorites.js';
import { initializeSearch, updateFavoritesCounter } from './modules/search.js';

/**
 * Initialize application
 * تهيئة التطبيق
 */
async function initializeApp() {
    try {
        // Initialize theme first (fastest)
        initializeTheme();

        // Initialize cards
        initializeCards();

        // Initialize search and filters
        initializeSearch();

        // Initialize favorites (depends on cards)
        initializeFavorites();

        // Update favorites counter
        const favorites = getFavorites();
        updateFavoritesCounter(favorites.length);

        // Initialize lazy loading for images
        initializeLazyLoading();

        // Setup service worker
        registerServiceWorker();

        // Setup scroll to top button
        setupScrollToTop();

        // Mark body as loaded
        document.body.classList.add('loaded');

        // Hide loading screen
        hideLoadingScreen();
    } catch (error) {
        console.error('Failed to initialize app:', error);
    }
}

/**
 * Initialize lazy loading for images
 * تهيئة التحميل الكسول للصور
 */
function initializeLazyLoading() {
    const images = document.querySelectorAll('.icon-image');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // Handle successful load
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    });

                    // Handle load errors
                    img.addEventListener('error', () => {
                        img.classList.add('loaded');
                        img.style.opacity = '0.5';
                    });

                    // If already loaded
                    if (img.complete) {
                        img.classList.add('loaded');
                    }

                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            img.addEventListener('error', () => {
                img.classList.add('loaded');
                img.style.opacity = '0.5';
            });
            if (img.complete) {
                img.classList.add('loaded');
            }
        });
    }


}

/**
 * Register service worker
 * تسجيل service worker
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ SW registered:', registration.scope);
                })
                .catch(error => {
                    console.warn('❌ SW registration failed:', error);
                });
        });
    }
}

/**
 * Setup scroll to top button
 * إعداد زر العودة للأعلى
 */
function setupScrollToTop() {
    const scrollBtn = document.querySelector('.scroll-top');
    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    console.log('✅ Scroll to top initialized');
}

/**
 * Hide loading screen
 * إخفاء شاشة التحميل
 */
function hideLoadingScreen() {
    const loading = document.querySelector('.loading');
    if (!loading) return;

    setTimeout(() => {
        loading.classList.add('hidden');
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500);
    }, 1000);
}

/**
 * Handle errors globally
 * معالجة الأخطاء عامة
 */
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Export for debugging
window.ModernLinksHub = {
    version: '2.0.0',
    initializeApp
};
