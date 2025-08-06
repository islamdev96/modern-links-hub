// Favorites functionality for Islam Glab Link Hub
document.addEventListener('DOMContentLoaded', () => {
    // Get all necessary elements
    const cards = document.querySelectorAll('.card');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const linksGrid = document.getElementById('linksGrid');
    const favoritesSection = document.getElementById('favoritesSection');
    const favoritesGrid = document.getElementById('favoritesGrid');

    let currentFilter = 'all';
    let currentSearch = '';
    let favorites = JSON.parse(localStorage.getItem('linkHubFavorites')) || [];

    // Initialize favorites system
    initializeFavorites();

    // Add favorite buttons to all cards
    addFavoriteButtons();

    // Load and display favorites
    loadFavorites();

    // Card click functionality (prevent click when clicking favorite button)
    cards.forEach(card => {
        card.addEventListener('click', (event) => {
            // Don't open link if clicking on favorite button
            if (event.target.closest('.favorite-btn')) {
                return;
            }
            
            const link = card.querySelector('a');
            if (link) {
                const url = link.getAttribute('href');
                try {
                    window.open(url, '_blank');
                } catch (error) {
                    console.error('Error opening link:', error);
                    alert('Unable to open the website. Please check your internet connection.');
                }
            }
        });
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase();
        clearSearchBtn.style.display = currentSearch ? 'block' : 'none';
        filterCards();
    });

    // Clear search
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        currentSearch = '';
        clearSearchBtn.style.display = 'none';
        filterCards();
    });

    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            // Add active class to clicked button
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            currentFilter = btn.getAttribute('data-category');
            filterCards();
        });
    });

    // Initialize favorites system
    function initializeFavorites() {
        // Add data attributes to all cards for favorites functionality
        cards.forEach(card => {
            const link = card.querySelector('a');
            const title = card.querySelector('.title').textContent;
            const description = card.querySelector('.description').textContent;
            const icon = card.querySelector('.icon-image') ? card.querySelector('.icon-image').src : '';
            const url = link.getAttribute('href');
            
            // Only set attributes if they don't already exist
            if (!card.getAttribute('data-url')) card.setAttribute('data-url', url);
            if (!card.getAttribute('data-title')) card.setAttribute('data-title', title);
            if (!card.getAttribute('data-description')) card.setAttribute('data-description', description);
            if (!card.getAttribute('data-icon')) card.setAttribute('data-icon', icon);
        });
    }

    // Add favorite buttons to all cards
    function addFavoriteButtons() {
        cards.forEach(card => {
            let favoriteBtn = card.querySelector('.favorite-btn');
            
            // If button doesn't exist, create it
            if (!favoriteBtn) {
                favoriteBtn = document.createElement('button');
                favoriteBtn.className = 'favorite-btn';
                favoriteBtn.title = 'إضافة للمفضلة';
                favoriteBtn.innerHTML = '<i class="fas fa-star"></i>';
                
                // Insert button as first child
                card.insertBefore(favoriteBtn, card.firstChild);
            }
            
            // Add click event (remove existing listeners first)
            favoriteBtn.replaceWith(favoriteBtn.cloneNode(true));
            favoriteBtn = card.querySelector('.favorite-btn');
            
            favoriteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(card);
            });
        });
    }

    // Toggle favorite status
    function toggleFavorite(card) {
        const url = card.getAttribute('data-url');
        const title = card.getAttribute('data-title');
        const description = card.getAttribute('data-description');
        const icon = card.getAttribute('data-icon');
        const category = card.getAttribute('data-category');
        
        console.log('Toggle favorite for:', { url, title, description, icon, category });
        
        const favoriteBtn = card.querySelector('.favorite-btn');
        const isFavorited = favorites.some(fav => fav.url === url);
        
        if (isFavorited) {
            // Remove from favorites
            favorites = favorites.filter(fav => fav.url !== url);
            favoriteBtn.classList.remove('favorited');
            favoriteBtn.title = 'إضافة للمفضلة';
            card.classList.remove('favorite');
        } else {
            // Add to favorites
            favorites.push({
                url,
                title,
                description,
                icon,
                category,
                id: Date.now() // Simple ID generation
            });
            favoriteBtn.classList.add('favorited');
            favoriteBtn.title = 'إزالة من المفضلة';
            card.classList.add('favorite');
        }
        
        // Save to localStorage
        localStorage.setItem('linkHubFavorites', JSON.stringify(favorites));
        
        // Update favorites display
        loadFavorites();
        
        // If currently showing favorites filter, update the view
        if (currentFilter === 'favorites') {
            filterCards();
        }
    }

    // Load and display favorites
    function loadFavorites() {
        // Update favorite buttons state
        cards.forEach(card => {
            const url = card.getAttribute('data-url');
            const favoriteBtn = card.querySelector('.favorite-btn');
            const isFavorited = favorites.some(fav => fav.url === url);
            
            if (isFavorited) {
                favoriteBtn.classList.add('favorited');
                favoriteBtn.title = 'إزالة من المفضلة';
                card.classList.add('favorite');
            } else {
                favoriteBtn.classList.remove('favorited');
                favoriteBtn.title = 'إضافة للمفضلة';
                card.classList.remove('favorite');
            }
        });

        // Display favorites section
        if (favorites.length > 0) {
            favoritesSection.style.display = 'block';
            displayFavoritesGrid();
        } else {
            favoritesSection.style.display = 'none';
        }
    }

    // Display favorites in the dedicated grid
    function displayFavoritesGrid() {
        if (favorites.length === 0) {
            favoritesGrid.innerHTML = `
                <div class="empty-favorites">
                    <i class="fas fa-star"></i>
                    لم تقم بإضافة أي مواقع للمفضلة بعد
                </div>
            `;
            return;
        }

        favoritesGrid.innerHTML = favorites.map(favorite => `
            <div class="card favorite ${favorite.category}" data-category="${favorite.category}" data-url="${favorite.url}" data-title="${favorite.title}" data-description="${favorite.description}" data-icon="${favorite.icon}">
                <button class="favorite-btn favorited" title="إزالة من المفضلة">
                    <i class="fas fa-star"></i>
                </button>
                <a href="${favorite.url}" target="_blank">
                    <img src="${favorite.icon}" alt="${favorite.title}" class="icon-image">
                    <span class="title">${favorite.title}</span>
                    <span class="description">${favorite.description}</span>
                </a>
            </div>
        `).join('');

        // Add event listeners to favorite cards
        const favoriteCards = favoritesGrid.querySelectorAll('.card');
        favoriteCards.forEach(card => {
            // Card click functionality
            card.addEventListener('click', (event) => {
                if (event.target.closest('.favorite-btn')) {
                    return;
                }
                
                const link = card.querySelector('a');
                if (link) {
                    const url = link.getAttribute('href');
                    try {
                        window.open(url, '_blank');
                    } catch (error) {
                        console.error('Error opening link:', error);
                        alert('Unable to open the website. Please check your internet connection.');
                    }
                }
            });

            // Favorite button functionality
            const favoriteBtn = card.querySelector('.favorite-btn');
            favoriteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(card);
            });
        });
    }

    // Filter and search cards
    function filterCards() {
        cards.forEach(card => {
            const title = card.querySelector('.title').textContent.toLowerCase();
            const description = card.querySelector('.description')?.textContent.toLowerCase() || '';
            const category = card.getAttribute('data-category');
            const url = card.getAttribute('data-url');
            
            // Check search match
            const matchesSearch = currentSearch === '' || 
                title.includes(currentSearch) || 
                description.includes(currentSearch);
            
            // Check category filter
            let matchesFilter = false;
            if (currentFilter === 'all') {
                matchesFilter = true;
            } else if (currentFilter === 'favorites') {
                matchesFilter = favorites.some(fav => fav.url === url);
            } else {
                matchesFilter = category === currentFilter;
            }
            
            // Show/hide card with improved animations
            if (matchesSearch && matchesFilter) {
                card.classList.remove('hidden', 'fade-out');
                card.classList.add('fade-in');
            } else {
                card.classList.add('hidden', 'fade-out');
                card.classList.remove('fade-in');
            }
        });
    }

    // Scroll to top functionality
    const scrollTopBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'k':
                    e.preventDefault();
                    searchInput.focus();
                    break;
                case 'f':
                    e.preventDefault();
                    searchInput.focus();
                    break;
            }
        }
        if (e.key === 'Escape') {
            searchInput.value = '';
            currentSearch = '';
            clearSearchBtn.style.display = 'none';
            filterCards();
            searchInput.blur();
        }
    });

    // Add smooth animations
    function addCardAnimations() {
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in');
        });
    }

    // Initialize animations
    addCardAnimations();

    // Add hover effects for better UX
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('hidden')) {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Enhanced loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        // Hide loading screen
        const loading = document.getElementById('loading');
        setTimeout(() => {
            loading.classList.add('hidden');
            setTimeout(() => {
                loading.style.display = 'none';
            }, 500);
        }, 1000);
    });

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
});