// Wishlist page functionality
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let filteredWishlist = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeWishlistPage();
});

function initializeWishlistPage() {
    updateWishlistCount();
    loadWishlistItems();
    setupWishlistEventListeners();
}

function updateWishlistCount() {
    const wishlistCount = document.getElementById('wishlistCount');
    const wishlistItemCount = document.getElementById('wishlistItemCount');
    
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
    
    if (wishlistItemCount) {
        wishlistItemCount.textContent = wishlist.length;
    }
}

function loadWishlistItems() {
    const wishlistGrid = document.getElementById('wishlistGrid');
    const emptyWishlist = document.getElementById('emptyWishlist');
    
    if (!wishlistGrid || !emptyWishlist) return;
    
    if (wishlist.length === 0) {
        wishlistGrid.style.display = 'none';
        emptyWishlist.style.display = 'block';
        return;
    }
    
    wishlistGrid.style.display = 'grid';
    emptyWishlist.style.display = 'none';
    
    const wishlistMovies = movieDataset.filter(movie => wishlist.includes(movie.id));
    
    // Apply search filter if active
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase();
    filteredWishlist = searchTerm ? 
        wishlistMovies.filter(movie => 
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.description.toLowerCase().includes(searchTerm) ||
            movie.category.toLowerCase().includes(searchTerm)
        ) : wishlistMovies;
    
    wishlistGrid.innerHTML = '';
    
    if (filteredWishlist.length === 0 && searchTerm) {
        wishlistGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #ccc;">No results found in your wishlist</p>';
        return;
    }
    
    filteredWishlist.forEach(movie => {
        const wishlistCard = createWishlistCard(movie);
        wishlistGrid.appendChild(wishlistCard);
    });
}

function createWishlistCard(movie) {
    const wishlistCard = document.createElement('div');
    wishlistCard.className = 'movie-card fade-in';
    
    wishlistCard.innerHTML = `
        <div class="card-image" style="background-image: url(${movie.image})">
            <div class="card-overlay"></div>
        </div>
        <div class="card-content">
            <h3 class="card-title">${movie.title}</h3>
            <p class="card-description">${movie.description.substring(0, 100)}...</p>
            <div class="card-rating">
                <span class="stars">${generateStars(movie.rating)}</span>
                <span>${movie.rating}/10</span>
            </div>
            <div class="card-meta">
                <span class="category-tag">${movie.category}</span>
                <span class="type-tag">${movie.isSeries ? 'Series' : 'Movie'}</span>
            </div>
            <div class="card-actions">
                <button class="btn btn-primary btn-small" onclick="watchMovie(${movie.id})">
                    ▶ Watch Now
                </button>
                <button class="btn btn-secondary btn-small" onclick="removeFromWishlist(${movie.id})">
                    🗑️ Remove
                </button>
            </div>
        </div>
    `;
    
    return wishlistCard;
}

function removeFromWishlist(movieId) {
    const index = wishlist.indexOf(movieId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        updateWishlistCount();
        loadWishlistItems();
        
        // Show confirmation
        showNotification('Removed from wishlist', 'success');
    }
}

function setupWishlistEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(loadWishlistItems, 300));
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
}

function watchMovie(movieId) {
    localStorage.setItem('currentMovie', movieId);
    window.location.href = 'watch.html';
}

function generateStars(rating) {
    const fullStars = Math.floor(rating / 2);
    const halfStar = rating % 2 >= 1;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    if (halfStar) {
        stars += '☆';
    }
    for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) {
        stars += '☆';
    }
    
    return stars;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#dc143c' : '#333'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS for category and type tags
const style = document.createElement('style');
style.textContent = `
    .card-meta {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    
    .category-tag,
    .type-tag {
        background: rgba(220, 20, 60, 0.2);
        color: #dc143c;
        padding: 0.25rem 0.5rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: bold;
        border: 1px solid #dc143c;
    }
    
    .type-tag {
        background: rgba(255, 255, 255, 0.1);
        color: #ccc;
        border-color: #666;
    }
    
    .notification {
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);
