// Watch page functionality
let currentMovie = null;
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

document.addEventListener('DOMContentLoaded', function() {
    initializeWatchPage();
});

function initializeWatchPage() {
    const movieId = parseInt(localStorage.getItem('currentMovie'));
    
    if (!movieId) {
        window.location.href = 'index.html';
        return;
    }
    
    currentMovie = movieDataset.find(movie => movie.id === movieId);
    
    if (!currentMovie) {
        window.location.href = 'index.html';
        return;
    }
    
    updateWishlistCount();
    loadMovieDetails();
    loadCast();
    loadRecommendedMovies();
    setupEventListeners();
}

function updateWishlistCount() {
    const wishlistCount = document.getElementById('wishlistCount');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
}

function loadMovieDetails() {
    const movieTitle = document.getElementById('movieTitle');
    const movieDetails = document.getElementById('movieDetails');
    const videoPlayer = document.getElementById('videoPlayer');
    
    if (movieTitle) {
        movieTitle.textContent = currentMovie.title;
    }
    
    if (videoPlayer) {
        videoPlayer.style.backgroundImage = `url(${currentMovie.image})`;
    }
    
    if (movieDetails) {
        const isInWishlist = wishlist.includes(currentMovie.id);
        
        movieDetails.innerHTML = `
            <div class="movie-header">
                <div class="movie-poster">
                    <img src="${currentMovie.image}" alt="${currentMovie.title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 10px;">
                </div>
                <div class="movie-info">
                    <h1>${currentMovie.title}</h1>
                    <div class="movie-meta">
                        <span class="category">${currentMovie.category}</span>
                        <span class="type">${currentMovie.isSeries ? 'Series' : 'Movie'}</span>
                        <div class="rating">
                            <span class="stars">${generateStars(currentMovie.rating)}</span>
                            <span class="rating-number">${currentMovie.rating}/10</span>
                        </div>
                    </div>
                    <p class="description">${currentMovie.description}</p>
                    <div class="movie-actions">
                        <button class="btn btn-primary" onclick="startVideo()">
                            ▶ Play Movie
                        </button>
                        <button class="btn btn-secondary" onclick="toggleWishlist(${currentMovie.id})">
                            ${isInWishlist ? '❤️ In Wishlist' : '+ Add to Wishlist'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

function loadCast() {
    const castGrid = document.getElementById('castGrid');
    if (!castGrid || !currentMovie.cast) return;
    
    castGrid.innerHTML = '';
    
    currentMovie.cast.forEach((actor, index) => {
        const castCard = document.createElement('div');
        castCard.className = 'cast-card fade-in';
        
        // Generate a placeholder image for the actor
        const actorImages = [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
            'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300'
        ];
        
        castCard.innerHTML = `
            <div class="cast-photo">
                <img src="${actorImages[index % actorImages.length]}" alt="${actor}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 10px;">
            </div>
            <h4>${actor}</h4>
            <p>Actor</p>
        `;
        
        castGrid.appendChild(castCard);
    });
}

function loadRecommendedMovies() {
    const recommendedGrid = document.getElementById('recommendedGrid');
    if (!recommendedGrid || !currentMovie.recommended) return;
    
    const recommendedMovies = movieDataset.filter(movie => 
        currentMovie.recommended.includes(movie.id)
    ).slice(0, 6);
    
    recommendedGrid.innerHTML = '';
    
    recommendedMovies.forEach(movie => {
        const recommendedCard = createRecommendedCard(movie);
        recommendedGrid.appendChild(recommendedCard);
    });
}

function createRecommendedCard(movie) {
    const card = document.createElement('div');
    card.className = 'recommended-card fade-in';
    
    const isInWishlist = wishlist.includes(movie.id);
    
    card.innerHTML = `
        <div class="card-image" style="background-image: url(${movie.image})">
            <div class="card-overlay"></div>
            <div class="card-hover-actions">
                <button class="btn btn-primary btn-small" onclick="watchMovie(${movie.id})">
                    ▶ Watch
                </button>
                <button class="btn btn-secondary btn-small" onclick="toggleWishlist(${movie.id})">
                    ${isInWishlist ? '❤️' : '+'}
                </button>
            </div>
        </div>
        <div class="card-content">
            <h4>${movie.title}</h4>
            <p class="card-category">${movie.category}</p>
            <div class="card-rating">
                <span class="stars">${generateStars(movie.rating)}</span>
                <span>${movie.rating}</span>
            </div>
        </div>
    `;
    
    return card;
}

function startVideo() {
    const videoPlayer = document.getElementById('videoPlayer');
    
    // Simulate video player
    videoPlayer.innerHTML = `
        <div class="video-container">
            <div class="video-placeholder">
                <div class="video-controls">
                    <div class="progress-bar">
                        <div class="progress" id="videoProgress"></div>
                    </div>
                    <div class="controls">
                        <button onclick="togglePlay()" id="playPauseBtn">⏸️</button>
                        <span id="timeDisplay">0:00 / 2:34:16</span>
                        <button onclick="toggleFullscreen()">🔳</button>
                    </div>
                </div>
                <div class="video-overlay">
                    <h3>Now Playing: ${currentMovie.title}</h3>
                    <p>🔴 LIVE - Premium Quality</p>
                </div>
            </div>
        </div>
    `;
    
    // Simulate video progress
    simulateVideoProgress();
}

function simulateVideoProgress() {
    let progress = 0;
    const progressBar = document.getElementById('videoProgress');
    const timeDisplay = document.getElementById('timeDisplay');
    
    const interval = setInterval(() => {
        progress += 0.1;
        if (progressBar) {
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
        
        if (timeDisplay) {
            const minutes = Math.floor(progress * 1.5);
            const seconds = Math.floor((progress * 1.5 - minutes) * 60);
            timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} / 2:34:16`;
        }
        
        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 1000);
}

function togglePlay() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    if (playPauseBtn) {
        const isPlaying = playPauseBtn.textContent === '⏸️';
        playPauseBtn.textContent = isPlaying ? '▶️' : '⏸️';
    }
}

function toggleFullscreen() {
    const videoPlayer = document.getElementById('videoPlayer');
    if (videoPlayer) {
        if (!document.fullscreenElement) {
            videoPlayer.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    }
}

function toggleWishlist(movieId) {
    const index = wishlist.indexOf(movieId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(movieId);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    
    // Refresh current view
    if (movieId === currentMovie.id) {
        loadMovieDetails();
    }
    loadRecommendedMovies();
    
    showNotification(
        index > -1 ? 'Removed from wishlist' : 'Added to wishlist',
        'success'
    );
}

function watchMovie(movieId) {
    localStorage.setItem('currentMovie', movieId);
    window.location.reload();
}

function setupEventListeners() {
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

// Add watch page specific styles
const watchStyles = document.createElement('style');
watchStyles.textContent = `
    .player-section {
        padding: 2rem 0;
    }
    
    .player-container {
        max-width: 1000px;
        margin: 0 auto;
    }
    
    .video-player {
        width: 100%;
        height: 500px;
        background: #000;
        border-radius: 10px;
        overflow: hidden;
        position: relative;
        background-size: cover;
        background-position: center;
    }
    
    .player-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7));
    }
    
    .play-button {
        width: 80px;
        height: 80px;
        background: rgba(220, 20, 60, 0.9);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 2;
    }
    
    .play-button:hover {
        background: #dc143c;
        transform: scale(1.1);
    }
    
    .play-icon {
        font-size: 2rem;
        color: white;
        margin-left: 5px;
    }
    
    .player-overlay {
        position: absolute;
        bottom: 20px;
        left: 20px;
        color: white;
        z-index: 1;
    }
    
    .video-container {
        width: 100%;
        height: 100%;
        position: relative;
        background: #000;
    }
    
    .video-placeholder {
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #111, #333);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }
    
    .video-controls {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,0.8);
        padding: 1rem;
    }
    
    .progress-bar {
        width: 100%;
        height: 4px;
        background: rgba(255,255,255,0.3);
        border-radius: 2px;
        margin-bottom: 1rem;
        overflow: hidden;
    }
    
    .progress {
        height: 100%;
        background: #dc143c;
        width: 0%;
        transition: width 0.3s ease;
    }
    
    .controls {
        display: flex;
        align-items: center;
        gap: 1rem;
        color: white;
    }
    
    .controls button {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 5px;
        transition: background 0.3s ease;
    }
    
    .controls button:hover {
        background: rgba(255,255,255,0.1);
    }
    
    .video-overlay {
        position: absolute;
        top: 20px;
        left: 20px;
        color: white;
    }
    
    .movie-info-section {
        padding: 3rem 0;
    }
    
    .movie-header {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 3rem;
        margin-bottom: 3rem;
    }
    
    .movie-info h1 {
        font-size: 2.5rem;
        color: #dc143c;
        margin-bottom: 1rem;
    }
    
    .movie-meta {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
    }
    
    .category,
    .type {
        background: rgba(220, 20, 60, 0.2);
        color: #dc143c;
        padding: 0.3rem 0.8rem;
        border-radius: 15px;
        font-size: 0.9rem;
        font-weight: bold;
        border: 1px solid #dc143c;
    }
    
    .type {
        background: rgba(255, 255, 255, 0.1);
        color: #ccc;
        border-color: #666;
    }
    
    .rating {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .rating-number {
        font-weight: bold;
        color: #dc143c;
    }
    
    .description {
        color: #ccc;
        line-height: 1.6;
        margin-bottom: 2rem;
        font-size: 1.1rem;
    }
    
    .movie-actions {
        display: flex;
        gap: 1rem;
    }
    
    .cast-section,
    .recommended-section {
        padding: 3rem 0;
    }
    
    .cast-section {
        background: linear-gradient(135deg, #111, #222);
    }
    
    .cast-section h2,
    .recommended-section h2 {
        text-align: center;
        font-size: 2.5rem;
        color: #dc143c;
        margin-bottom: 3rem;
    }
    
    .cast-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
    }
    
    .cast-card {
        text-align: center;
        background: #000;
        border-radius: 10px;
        padding: 1.5rem;
        transition: all 0.3s ease;
        border: 2px solid transparent;
    }
    
    .cast-card:hover {
        border-color: #dc143c;
        transform: translateY(-5px);
    }
    
    .cast-card h4 {
        color: #fff;
        margin: 1rem 0 0.5rem;
    }
    
    .cast-card p {
        color: #ccc;
        font-size: 0.9rem;
    }
    
    .recommended-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
    }
    
    .recommended-card {
        background: #111;
        border-radius: 10px;
        overflow: hidden;
        transition: all 0.3s ease;
        border: 2px solid transparent;
        position: relative;
    }
    
    .recommended-card:hover {
        border-color: #dc143c;
        transform: translateY(-10px);
        box-shadow: 0 20px 40px rgba(220, 20, 60, 0.3);
    }
    
    .recommended-card .card-image {
        height: 180px;
        position: relative;
    }
    
    .card-hover-actions {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.3s ease;
        display: flex;
        gap: 0.5rem;
    }
    
    .recommended-card:hover .card-hover-actions {
        opacity: 1;
    }
    
    .recommended-card .card-content {
        padding: 1rem;
    }
    
    .recommended-card h4 {
        color: #fff;
        margin-bottom: 0.5rem;
    }
    
    .card-category {
        color: #dc143c;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
    }
    
    .card-rating {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
    }
    
    @media (max-width: 768px) {
        .movie-header {
            grid-template-columns: 1fr;
            gap: 2rem;
        }
        
        .movie-poster {
            max-width: 300px;
            margin: 0 auto;
        }
        
        .cast-grid {
            grid-template-columns: repeat(2, 1fr);
        }
        
        .recommended-grid {
            grid-template-columns: 1fr;
        }
        
        .movie-actions {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(watchStyles);
