/**
 * Simple Standalone App - No Dependencies
 * تطبيق بسيط مستقل بدون اعتماديات
 */

// Hide loading screen
function hideLoading() {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.style.display = 'none';
    }
    // Ensure body is visible
    document.body.classList.add('loaded');
    document.body.style.opacity = '1';
}

// Initialize theme toggle
function initializeTheme() {
    const themeBtn = document.getElementById('themeToggle');
    if (!themeBtn) return;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('app-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Add click listener
    themeBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('app-theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Initialize search
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterCards(e.target.value);
            if (clearBtn) {
                clearBtn.style.display = e.target.value ? 'block' : 'none';
            }
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            filterCards('');
            clearBtn.style.display = 'none';
        });
    }
}

function filterCards(query) {
    const cards = document.querySelectorAll('.card');
    const searchTerm = query.toLowerCase();
    let visibleCount = 0;
    
    cards.forEach(card => {
        const title = card.querySelector('.title')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.description')?.textContent.toLowerCase() || '';
        const matches = title.includes(searchTerm) || description.includes(searchTerm);
        
        card.style.display = matches ? 'block' : 'none';
        if (matches) visibleCount++;
    });
    
}


// Initialize card clicks
function initializeCardClicks() {
    document.addEventListener('click', (e) => {
        // Handle card click
        const card = e.target.closest('.card');
        if (card && !e.target.closest('.favorite-btn')) {
            e.preventDefault();
            const url = card.dataset.url;
            if (url) {
                window.open(url, '_blank');
            }
        }
    });
}

// Update favorites bar
function updateFavoritesBar() {
    const favorites = JSON.parse(localStorage.getItem('app-favorites') || '[]');
    const favoritesBar = document.getElementById('favoritesBar');
    const favoritesBarContent = document.getElementById('favoritesBarContent');
    
    if (!favoritesBar || !favoritesBarContent) return;
    
    // Clear current content
    favoritesBarContent.innerHTML = '';
    
    if (favorites.length > 0) {
        favoritesBar.classList.add('has-favorites');
        
        // Add each favorite to the bar
        favorites.forEach(url => {
            const card = document.querySelector(`.card[data-url="${url}"]`);
            if (card) {
                const title = card.dataset.title || card.querySelector('.title')?.textContent || 'Link';
                const iconSrc = card.querySelector('.icon-image')?.src || '';
                
                // Update icon to use Google Favicon API
                let faviconUrl = iconSrc;
                if (iconSrc && iconSrc.includes('icons/')) {
                    // Extract domain from URL and use Google Favicon API
                    try {
                        const domain = new URL(url).hostname;
                        faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
                    } catch (e) {
                        faviconUrl = iconSrc;
                    }
                }
                
                const favoriteItem = document.createElement('a');
                favoriteItem.href = url;
                favoriteItem.target = '_blank';
                favoriteItem.className = 'favorite-item';
                favoriteItem.innerHTML = `
                    <img src="${faviconUrl}" alt="${title}" onerror="this.src='https://www.google.com/s2/favicons?domain=google.com&sz=64'">
                    <div class="favorite-item-title">${title}</div>
                `;
                
                favoritesBarContent.appendChild(favoriteItem);
            }
        });
    } else {
        favoritesBar.classList.remove('has-favorites');
    }
}

// Initialize favorites
function initializeFavorites() {
    // Get saved favorites from localStorage
    let favorites = JSON.parse(localStorage.getItem('app-favorites') || '[]');
    
    // First, set all buttons to empty hearts
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = 'far fa-heart'; // Empty heart by default
            btn.classList.remove('active');
        }
    });
    
    // Then update only the favorites to filled hearts
    document.querySelectorAll('.card').forEach(card => {
        const url = card.dataset.url;
        const btn = card.querySelector('.favorite-btn');
        if (btn && favorites.includes(url)) {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-heart'; // Filled heart for favorites
                btn.classList.add('active');
            }
        }
    });
    
    // Update favorites bar
    updateFavoritesBar();
    
    // Add click listener for toggle
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.favorite-btn');
        if (!btn) return;
        
        e.preventDefault();
        e.stopPropagation(); // Stop event from reaching card click
        const card = btn.closest('.card');
        if (!card) return;
        
        const url = card.dataset.url;
        const icon = btn.querySelector('i');
        if (!icon) return;
        
        // Get current favorites
        favorites = JSON.parse(localStorage.getItem('app-favorites') || '[]');
        const index = favorites.indexOf(url);
        
        if (index > -1) {
            // Remove from favorites
            favorites.splice(index, 1);
            icon.className = 'far fa-heart'; // Empty heart
            btn.classList.remove('active');
            showToast('تمت الإزالة من المفضلة', 'info');
        } else {
            // Add to favorites
            favorites.push(url);
            icon.className = 'fas fa-heart'; // Filled heart
            btn.classList.add('active');
            showToast('تمت الإضافة للمفضلة', 'success');
        }
        
        // Save updated favorites
        localStorage.setItem('app-favorites', JSON.stringify(favorites));
        
        // Update favorites bar and badges
        updateFavoritesBar();
        updateCategoryBadges();
    });
}

// Update category badges
function updateCategoryBadges() {
    const buttons = document.querySelectorAll('.category-btn');
    const cards = document.querySelectorAll('.card');
    const favorites = JSON.parse(localStorage.getItem('app-favorites') || '[]');
    
    buttons.forEach(btn => {
        const category = btn.dataset.category;
        let count = 0;
        
        if (category === 'all') {
            count = cards.length;
        } else if (category === 'favorites') {
            count = favorites.length;
        } else {
            cards.forEach(card => {
                if (card.dataset.category === category) count++;
            });
        }
        
        // Remove existing badge if any
        const existingBadge = btn.querySelector('.badge');
        if (existingBadge) existingBadge.remove();
        
        // Add new badge
        if (count > 0) {
            const badge = document.createElement('span');
            badge.className = 'badge';
            badge.textContent = count;
            btn.appendChild(badge);
        }
    });
}

// Initialize category filter
function initializeCategoryFilter() {
    const buttons = document.querySelectorAll('.category-btn');
    
    // Update badges initially
    updateCategoryBadges();
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter cards
            const category = btn.dataset.category;
            const cards = document.querySelectorAll('.card');
            let visibleCount = 0;
            
            if (category === 'favorites') {
                // Show only favorites
                const favorites = JSON.parse(localStorage.getItem('app-favorites') || '[]');
                cards.forEach(card => {
                    const isFavorite = favorites.includes(card.dataset.url);
                    card.style.display = isFavorite ? 'block' : 'none';
                    if (isFavorite) visibleCount++;
                });
            } else {
                // Regular category filter
                cards.forEach(card => {
                    const matches = category === 'all' || card.dataset.category === category;
                    card.style.display = matches ? 'block' : 'none';
                    if (matches) visibleCount++;
                });
            }
            
                });
    });
}

// Keyboard shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
    });
}

// Show toast notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// Scroll to top
function initializeScrollTop() {
    const scrollBtn = document.getElementById('scrollTop');
    if (!scrollBtn) return;
    
    window.addEventListener('scroll', () => {
        scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Drag and Drop functionality
function initializeDragAndDrop() {
    const cards = document.querySelectorAll('.card');
    const grid = document.getElementById('linksGrid');
    let draggedElement = null;
    
    cards.forEach(card => {
        card.setAttribute('draggable', 'true');
        
        card.addEventListener('dragstart', (e) => {
            draggedElement = card;
            card.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', card.innerHTML);
        });
        
        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        });
        
        card.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            if (card !== draggedElement) {
                card.classList.add('drag-over');
            }
        });
        
        card.addEventListener('dragleave', () => {
            card.classList.remove('drag-over');
        });
        
        card.addEventListener('drop', (e) => {
            e.preventDefault();
            card.classList.remove('drag-over');
            
            if (card !== draggedElement && draggedElement) {
                // Swap positions
                const allCards = [...grid.children];
                const draggedIndex = allCards.indexOf(draggedElement);
                const targetIndex = allCards.indexOf(card);
                
                if (draggedIndex < targetIndex) {
                    card.parentNode.insertBefore(draggedElement, card.nextSibling);
                } else {
                    card.parentNode.insertBefore(draggedElement, card);
                }
                
                saveCardOrder();
                showToast('تم تغيير الترتيب بنجاح');
            }
        });
    });
}

function saveCardOrder() {
    const cards = document.querySelectorAll('.card');
    const order = Array.from(cards).map(card => card.dataset.url);
    localStorage.setItem('card-order', JSON.stringify(order));
}

function loadCardOrder() {
    const savedOrder = localStorage.getItem('card-order');
    if (!savedOrder) return;
    
    const order = JSON.parse(savedOrder);
    const grid = document.getElementById('linksGrid');
    const cards = Array.from(document.querySelectorAll('.card'));
    
    order.forEach(url => {
        const card = cards.find(c => c.dataset.url === url);
        if (card) {
            grid.appendChild(card);
        }
    });
}

// Add entrance animations
function addEntranceAnimations() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.05}s`;
    });
}

// Add ripple effect to buttons
function addRippleEffect() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
}

// Initialize quick actions
function initializeQuickActions() {
    // Toggle favorites view
    const toggleBtn = document.getElementById('toggleFavoritesView');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const favBtn = document.querySelector('[data-category="favorites"]');
            if (favBtn) {
                favBtn.click();
            }
        });
    }
    
    // Clear all favorites
    const clearBtn = document.getElementById('clearAllFavorites');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('هل أنت متأكد من مسح جميع المفضلة؟')) {
                localStorage.removeItem('app-favorites');
                updateFavoritesBar();
                
                // Reset all favorite buttons
                document.querySelectorAll('.favorite-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                showToast('تم مسح جميع المفضلة', 'info');
                updateCategoryBadges();
            }
        });
    }
}

// Main initialization
function initialize() {
    console.log('🚀 Initializing Modern Links Hub...');
    
    hideLoading();
    initializeTheme();
    initializeSearch();
    initializeCardClicks();
    initializeFavorites();
    initializeCategoryFilter();
    initializeKeyboardShortcuts();
    initializeScrollTop();
    initializeQuickActions();
    loadCardOrder();
    initializeDragAndDrop();
    addEntranceAnimations();
    addRippleEffect();
    
    console.log('✅ Modern Links Hub Initialized Successfully!');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}
