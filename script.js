
// Global variables
let currentPage = 1;
let currentCategory = 'All';
let currentCarouselIndex = 0;
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let searchResults = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    updateWishlistCount();
    loadCarousel();
    loadCategories();
    loadMovies();
    loadSeries();
    loadFeedback();
    setupEventListeners();
    startCarouselAutoplay();
}

// Update wishlist count in navbar
function updateWishlistCount() {
    const wishlistCount = document.getElementById('wishlistCount');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
}

// Load carousel with top movies
function loadCarousel() {
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselIndicators = document.getElementById('carouselIndicators');
    const topMovies = movieDataset.filter(movie => movie.isTop10 && !movie.isSeries).slice(0, 5);
    
    if (!carouselTrack || !carouselIndicators) return;
    
    carouselTrack.innerHTML = '';
    carouselIndicators.innerHTML = '';
    
    topMovies.forEach((movie, index) => {
        // Create carousel item
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item';
        carouselItem.style.backgroundImage = `url(${movie.image})`;
        
        carouselItem.innerHTML = `
            <div class="carousel-overlay"></div>
            <div class="carousel-content">
                <h3>${movie.title}</h3>
                <p>${movie.description}</p>
                <div class="rating">
                    <span class="stars">${generateStars(movie.rating)}</span>
                    <span>${movie.rating}/10</span>
                </div>
                <div class="carousel-actions">
                    <button class="btn btn-primary" onclick="watchMovie(${movie.id})">
                        <span>▶</span> Watch Now
                    </button>
                    <button class="btn btn-secondary" onclick="toggleWishlist(${movie.id})">
                        <span>+</span> Add to Wishlist
                    </button>
                </div>
            </div>
        `;
        
        carouselTrack.appendChild(carouselItem);
        
        // Create indicator
        const indicator = document.createElement('div');
        indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
        indicator.onclick = () => goToSlide(index);
        carouselIndicators.appendChild(indicator);
    });
    
    updateCarouselPosition();
}

// Generate star rating
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

// Load categories
function loadCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;
    
    const categories = ['All', 'Action', 'Comedy', 'Drama', 'Thriller', 'Sci-fi', 'Romance', 'Horror'];
    
    categoriesGrid.innerHTML = '';
    categories.forEach(category => {
        const categoryBtn = document.createElement('button');
        categoryBtn.className = `category-btn ${category === currentCategory ? 'active' : ''}`;
        categoryBtn.textContent = category;
        categoryBtn.onclick = () => filterByCategory(category);
        categoriesGrid.appendChild(categoryBtn);
    });
}

// Filter movies by category
function filterByCategory(category) {
    currentCategory = category;
    currentPage = 1;
    
    // Update active category button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === category) {
            btn.classList.add('active');
        }
    });
    
    loadMovies();
}

// Load movies with pagination
function loadMovies() {
    const moviesGrid = document.getElementById('moviesGrid');
    const moviesPagination = document.getElementById('moviesPagination');
    if (!moviesGrid || !moviesPagination) return;
    
    let filteredMovies = movieDataset.filter(movie => movie.isTop10 && !movie.isSeries);
    
    // Apply category filter
    if (currentCategory !== 'All') {
        filteredMovies = filteredMovies.filter(movie => movie.category === currentCategory);
    }
    
    // Apply search filter if active
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase();
    if (searchTerm) {
        filteredMovies = filteredMovies.filter(movie => 
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.description.toLowerCase().includes(searchTerm) ||
            movie.category.toLowerCase().includes(searchTerm)
        );
    }
    
    const moviesPerPage = 5;
    const startIndex = (currentPage - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const paginatedMovies = filteredMovies.slice(startIndex, endIndex);
    
    // Load movies
    moviesGrid.innerHTML = '';
    paginatedMovies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        moviesGrid.appendChild(movieCard);
    });
    
    // Load pagination
    const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
    moviesPagination.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => {
            currentPage = i;
            loadMovies();
        };
        moviesPagination.appendChild(pageBtn);
    }
}

// Create movie card
function createMovieCard(movie) {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card fade-in';
    
    const isInWishlist = wishlist.includes(movie.id);
    
    movieCard.innerHTML = `
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
            <div class="card-actions">
                <button class="btn btn-primary btn-small" onclick="watchMovie(${movie.id})">
                    ▶ Watch
                </button>
                <button class="btn btn-secondary btn-small" onclick="toggleWishlist(${movie.id})">
                    ${isInWishlist ? '❤️' : '+'} ${isInWishlist ? 'In List' : 'Wishlist'}
                </button>
            </div>
        </div>
    `;
    
    return movieCard;
}

// Load series
function loadSeries() {
    const seriesGrid = document.getElementById('seriesGrid');
    if (!seriesGrid) return;
    
    const series = movieDataset.filter(movie => movie.isSeries).slice(0, 6);
    
    seriesGrid.innerHTML = '';
    series.forEach(show => {
        const seriesCard = createSeriesCard(show);
        seriesGrid.appendChild(seriesCard);
    });
}

// Create series card
function createSeriesCard(series) {
    const seriesCard = document.createElement('div');
    seriesCard.className = 'series-card fade-in';
    
    const isInWishlist = wishlist.includes(series.id);
    
    seriesCard.innerHTML = `
        <div class="card-image" style="background-image: url(${series.image})">
            <div class="card-overlay"></div>
        </div>
        <div class="card-content">
            <h3 class="card-title">${series.title}</h3>
            <p class="card-description">${series.description.substring(0, 100)}...</p>
            <div class="card-rating">
                <span class="stars">${generateStars(series.rating)}</span>
                <span>${series.rating}/10</span>
            </div>
            <div class="card-actions">
                <button class="btn btn-primary btn-small" onclick="watchMovie(${series.id})">
                    ▶ Watch
                </button>
                <button class="btn btn-secondary btn-small" onclick="toggleWishlist(${series.id})">
                    ${isInWishlist ? '❤️' : '+'} ${isInWishlist ? 'In List' : 'Wishlist'}
                </button>
            </div>
        </div>
    `;
    
    return seriesCard;
}

// Load customer feedback
function loadFeedback() {
    const feedbackGrid = document.getElementById('feedbackGrid');
    if (!feedbackGrid) return;
    
    feedbackGrid.innerHTML = '';
    customerFeedback.forEach(feedback => {
        const feedbackCard = document.createElement('div');
        feedbackCard.className = 'feedback-card fade-in';
        
        feedbackCard.innerHTML = `
            <div class="feedback-header">
                <div class="profile-icon">${feedback.profileIcon}</div>
                <div class="feedback-info">
                    <h4>${feedback.name}</h4>
                    <div class="feedback-rating">${generateStars(feedback.rating * 2)}</div>
                </div>
            </div>
            <p class="feedback-text">"${feedback.feedback}"</p>
        `;
        
        feedbackGrid.appendChild(feedbackCard);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Carousel navigation
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.onclick = previousSlide;
    if (nextBtn) nextBtn.onclick = nextSlide;
    
    // Subscription modal
    const subscribeBtn = document.getElementById('subscribeBtn');
    const modal = document.getElementById('subscriptionModal');
    const closeModal = document.getElementById('closeModal');
    const confirmBtn = document.getElementById('confirmSubscription');
    const cancelBtn = document.getElementById('cancelSubscription');
    
    if (subscribeBtn) {
        subscribeBtn.onclick = () => {
            modal.classList.add('show');
        };
    }
    
    if (closeModal) {
        closeModal.onclick = () => {
            modal.classList.remove('show');
        };
    }
    
    if (cancelBtn) {
        cancelBtn.onclick = () => {
            modal.classList.remove('show');
        };
    }
    
    if (confirmBtn) {
        confirmBtn.onclick = () => {
            alert('Subscription confirmed! Welcome to Premium!');
            modal.classList.remove('show');
        };
    }
    
    // Close modal on outside click
    if (modal) {
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        };
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

// Search functionality
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (searchTerm) {
        searchResults = movieDataset.filter(movie => 
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.description.toLowerCase().includes(searchTerm) ||
            movie.category.toLowerCase().includes(searchTerm)
        );
        
        displaySearchResults();
    } else {
        // Reset to normal view
        currentCategory = 'All';
        currentPage = 1;
        loadCategories();
        loadMovies();
    }
}

// Display search results
function displaySearchResults() {
    const moviesGrid = document.getElementById('moviesGrid');
    const moviesPagination = document.getElementById('moviesPagination');
    
    if (!moviesGrid || !moviesPagination) return;
    
    moviesGrid.innerHTML = '';
    moviesPagination.innerHTML = '';
    
    if (searchResults.length === 0) {
        moviesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #ccc;">No results found</p>';
        return;
    }
    
    searchResults.forEach(movie => {
        const movieCard = createMovieCard(movie);
        moviesGrid.appendChild(movieCard);
    });
}

// Debounce function for search
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

// Carousel functions
function goToSlide(index) {
    currentCarouselIndex = index;
    updateCarouselPosition();
    updateCarouselIndicators();
}

function previousSlide() {
    const totalSlides = document.querySelectorAll('.carousel-item').length;
    currentCarouselIndex = (currentCarouselIndex - 1 + totalSlides) % totalSlides;
    updateCarouselPosition();
    updateCarouselIndicators();
}

function nextSlide() {
    const totalSlides = document.querySelectorAll('.carousel-item').length;
    currentCarouselIndex = (currentCarouselIndex + 1) % totalSlides;
    updateCarouselPosition();
    updateCarouselIndicators();
}

function updateCarouselPosition() {
    const carouselTrack = document.getElementById('carouselTrack');
    if (carouselTrack) {
        carouselTrack.style.transform = `translateX(-${currentCarouselIndex * 100}%)`;
    }
}

function updateCarouselIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentCarouselIndex);
    });
}

function startCarouselAutoplay() {
    setInterval(() => {
        nextSlide();
    }, 5000); // Change slide every 5 seconds
}

// Wishlist functions
function toggleWishlist(movieId) {
    const index = wishlist.indexOf(movieId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(movieId);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    
    // Refresh current view to update button states
    if (document.getElementById('searchInput').value) {
        handleSearch();
    } else {
        loadMovies();
        loadSeries();
    }
}

// Watch movie function
function watchMovie(movieId) {
    localStorage.setItem('currentMovie', movieId);
    window.location.href = 'watch.html';
}

// Utility function to get movie by ID
function getMovieById(id) {
    return movieDataset.find(movie => movie.id === id);
}
