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
    
    // Theme management
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Secure external links opened in new tabs
    document.querySelectorAll('a[target="_blank"]').forEach(a => {
        const existingRel = (a.getAttribute('rel') || '').split(/\s+/);
        if (!existingRel.includes('noopener')) existingRel.push('noopener');
        if (!existingRel.includes('noreferrer')) existingRel.push('noreferrer');
        a.setAttribute('rel', existingRel.filter(Boolean).join(' '));
    });

    // Initialize theme
    initializeTheme();

    // Theme toggle functionality
    themeToggle.addEventListener('click', toggleTheme);

    initializeFavorites();

    // Add favorite buttons to all cards
    addFavoriteButtons();

    // Load and display favorites
    loadFavorites();

    // Update card counters
    updateCardCounters();
    
    // Re-update counters when favorites change
    const originalToggleFavorite = toggleFavorite;
    window.addEventListener('storage', (e) => {
        if (e.key === 'linkHubFavorites') {
            favorites = JSON.parse(e.newValue || '[]');
            loadFavorites();
            updateCardCounters();
        }
    });

    // Initialize lazy loading for images  
    initLazyLoading();

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
                    const win = window.open(url, '_blank', 'noopener,noreferrer');
                    if (win) win.opener = null;
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

    // Theme functions
    function initializeTheme() {
        // Set initial theme
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme);
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    }

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            themeToggle.title = 'تبديل للوضع المضيء';
        } else {
            icon.className = 'fas fa-moon';
            themeToggle.title = 'تبديل للوضع المظلم';
        }
    }

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
        
        // Update card counters
        updateCardCounters();
        
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

        favoritesGrid.innerHTML = favorites.map((favorite, index) => `
            <div class="card favorite ${favorite.category}" 
                 data-category="${favorite.category}" 
                 data-url="${favorite.url}" 
                 data-title="${favorite.title}" 
                 data-description="${favorite.description}" 
                 data-icon="${favorite.icon}"
                 data-index="${index}"
                 draggable="true">
                <button class="favorite-btn favorited" title="إزالة من المفضلة">
                    <i class="fas fa-star"></i>
                </button>
                <a href="${favorite.url}" target="_blank" rel="noopener noreferrer">
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
                        const win = window.open(url, '_blank', 'noopener,noreferrer');
                        if (win) win.opener = null;
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

            // Add drag and drop functionality
            addDragAndDropListeners(card);
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

    // Drag and Drop functionality
    let draggedElement = null;
    let draggedIndex = null;
    
    // Touch drag variables
    let touchDraggedElement = null;
    let touchStartPos = { x: 0, y: 0 };
    let touchCurrentPos = { x: 0, y: 0 };

    function addDragAndDropListeners(card) {
        // Mouse drag events
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('dragenter', handleDragEnter);
        card.addEventListener('dragleave', handleDragLeave);
        card.addEventListener('drop', handleDrop);
        card.addEventListener('dragend', handleDragEnd);

        // Touch events for mobile
        card.addEventListener('touchstart', handleTouchStart, { passive: false });
        card.addEventListener('touchmove', handleTouchMove, { passive: false });
        card.addEventListener('touchend', handleTouchEnd, { passive: false });
    }

    function handleDragStart(e) {
        draggedElement = this;
        draggedIndex = parseInt(this.getAttribute('data-index'));
        this.classList.add('dragging');
        
        // Set drag data
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.outerHTML);
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDragEnter(e) {
        if (this !== draggedElement) {
            this.classList.add('drag-over');
        }
    }

    function handleDragLeave(e) {
        this.classList.remove('drag-over');
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        if (draggedElement !== this) {
            const targetIndex = parseInt(this.getAttribute('data-index'));
            
            // Swap the two items instead of reordering
            const draggedItem = favorites[draggedIndex];
            const targetItem = favorites[targetIndex];
            
            // Swap positions
            favorites[draggedIndex] = targetItem;
            favorites[targetIndex] = draggedItem;
            
            // Save to localStorage
            localStorage.setItem('linkHubFavorites', JSON.stringify(favorites));
            
            // Refresh display
            displayFavoritesGrid();
        }

        return false;
    }

    function handleDragEnd(e) {
        // Clean up
        const cards = favoritesGrid.querySelectorAll('.card');
        cards.forEach(card => {
            card.classList.remove('dragging', 'drag-over');
        });
    }
    
    function handleTouchStart(e) {
        // Don't interfere with scrolling if not dragging
        const target = e.target.closest('.card');
        if (!target) return;
        
        touchDraggedElement = target;
        const touch = e.touches[0];
        touchStartPos = { x: touch.clientX, y: touch.clientY };
        
        // Add visual feedback after a delay
        setTimeout(() => {
            if (touchDraggedElement) {
                touchDraggedElement.classList.add('dragging');
            }
        }, 200);
    }

    function handleTouchMove(e) {
        if (!touchDraggedElement) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        touchCurrentPos = { x: touch.clientX, y: touch.clientY };
        
        // Calculate distance moved
        const deltaX = touchCurrentPos.x - touchStartPos.x;
        const deltaY = touchCurrentPos.y - touchStartPos.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Start dragging if moved enough
        if (distance > 10) {
            touchDraggedElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            
            // Find element under touch
            const elementBelow = document.elementFromPoint(touchCurrentPos.x, touchCurrentPos.y);
            const targetCard = elementBelow?.closest('.favorites-grid .card');
            
            // Remove previous drag-over classes
            const cards = favoritesGrid.querySelectorAll('.card');
            cards.forEach(card => card.classList.remove('drag-over'));
            
            // Add drag-over to target
            if (targetCard && targetCard !== touchDraggedElement) {
                targetCard.classList.add('drag-over');
            }
        }
    }

    function handleTouchEnd(e) {
        if (!touchDraggedElement) return;
        
        // Find the target element
        const touch = e.changedTouches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const targetCard = elementBelow?.closest('.favorites-grid .card');
        
        if (targetCard && targetCard !== touchDraggedElement) {
            const draggedIndex = parseInt(touchDraggedElement.getAttribute('data-index'));
            const targetIndex = parseInt(targetCard.getAttribute('data-index'));
            
            // Swap the two items instead of reordering
            const draggedItem = favorites[draggedIndex];
            const targetItem = favorites[targetIndex];
            
            // Swap positions
            favorites[draggedIndex] = targetItem;
            favorites[targetIndex] = draggedItem;
            
            // Save to localStorage
            localStorage.setItem('linkHubFavorites', JSON.stringify(favorites));
            
            // Refresh display
            displayFavoritesGrid();
        }
        
        // Clean up
        touchDraggedElement.style.transform = '';
        touchDraggedElement.classList.remove('dragging');
        
        const cards = favoritesGrid.querySelectorAll('.card');
        cards.forEach(card => card.classList.remove('drag-over'));
        
        touchDraggedElement = null;
        touchStartPos = { x: 0, y: 0 };
        touchCurrentPos = { x: 0, y: 0 };
    }
    
    // Update card counters for filter buttons
    function updateCardCounters() {
        filterBtns.forEach(btn => {
            const category = btn.getAttribute('data-category');
            let count = 0;
            
            if (category === 'all') {
                count = cards.length;
            } else if (category === 'favorites') {
                count = favorites.length;
            } else {
                count = Array.from(cards).filter(card => 
                    card.getAttribute('data-category') === category
                ).length;
            }
            
            // Update or create badge
            let badge = btn.querySelector('.badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'badge';
                btn.appendChild(badge);
            }
            badge.textContent = count;
        });
    }
    
    // Initialize lazy loading for images
    function initLazyLoading() {
        const images = document.querySelectorAll('.icon-image');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.addEventListener('load', () => {
                            img.classList.add('loaded');
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
                if (img.complete) {
                    img.classList.add('loaded');
                }
            });
        }
    }

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