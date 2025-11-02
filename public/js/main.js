import { initializeTheme } from './modules/theme.js';
import { initializeCards } from './modules/cards.js';
import { initializeFavorites, getFavorites } from './modules/favorites.js';
import { initializeSearch, updateFavoritesCounter } from './modules/search.js';
import { initializeKeyboardShortcuts } from './modules/keyboard.js';
import { initializeRecent } from './modules/recent.js';

async function initializeApp() {
    try {
        initializeTheme();
        initializeCards();

        await new Promise(resolve => setTimeout(resolve, 50));
        initializeSearch();

        try {
            setTimeout(() => {
                try {
                    initializeFavorites();

                    const favorites = getFavorites();
                    if (favorites && Array.isArray(favorites)) {
                        updateFavoritesCounter(favorites.length);
                    }
                } catch (favoritesError) {}
            }, 100);
        } catch (favoritesError) {}

        initializeKeyboardShortcuts();
        initializeRecent();
        initializeLazyLoading();
        registerServiceWorker();
        setupScrollToTop();
        document.body.classList.add('loaded');
        hideLoadingScreen();
    } catch (error) {hideLoadingScreen();
    }
}

function initializeLazyLoading() {
    const images = document.querySelectorAll('.icon-image');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
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

                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
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

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
        });
    }
}

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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

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

window.addEventListener('error', (event) => {});

window.addEventListener('unhandledrejection', (event) => {});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

window.ModernLinksHub = {
    version: '2.0.0',
    initializeApp
};
