// 1. YOUR CUSTOM MOVIE LIST WITH IDS
const myMovies = [
    { 
        id: 1,
        name: "Sus Steve Doing The Floss", 
        img: "movies/images/steveImagePoster.png", 
        videoUrl: "movies/sus_steve_doing_the_floss.gif",
        userRating: null // Tracks custom interactions: 'like', 'dislike', or null
    }, 
    {
        id: 2,
        name: "Sus Steve Doing Sus Stuff", 
        img: "movies/images/steveImagePoster.png", 
        videoUrl: "movies/sus_steve_doing_sus_stuff.gif",
        userRating: null
    }
];

// Tracking history log array
let watchAgainList = [];
let currentActiveMovie = null; // Tracks which movie is inside the player box right now

document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Background Transition
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Setup Interface Containers
    initHeroBanner();
    renderAllRows(myMovies);
    setupModalDOM(); 

    // CLICK THE SEARCH BUTTON TO TOGGLE INPUT WINDOW
    const searchBtn = document.getElementById('search-trigger-btn');
    const searchBox = document.getElementById('search-box-container');
    const searchInput = document.getElementById('search-input');
    
    if (searchBtn && searchBox && searchInput) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            searchBox.classList.toggle('open');
            if (searchBox.classList.contains('open')) {
                searchInput.focus();
            }
        });

        // Hook Up Search Filtering Mechanics
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const filtered = myMovies.filter(movie => movie.name.toLowerCase().includes(query));
            renderAllRows(filtered);
        });
    }

    // CLICK THE POPCORN BUTTON TO TOGGLE WATCH AGAIN ROW
    const popcornBtn = document.getElementById('popcorn-avatar');
    if (popcornBtn) {
        popcornBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            const section = document.getElementById('row-watch-again-section');
            
            if (watchAgainList.length === 0) {
                addToWatchAgain(myMovies[0]);
                alert(`🍿 Popcorn History Core Online! Added "${myMovies[0].name}" into your history logs.`);
            } else if (section) {
                section.style.display = section.style.display === 'none' ? 'block' : 'none';
            }
        });
    }

    // Main Featured Showcase Buttons
    document.getElementById('play-btn').addEventListener('click', () => {
        openMovieScreen(myMovies[0].videoUrl, myMovies[0].name, myMovies[0]);
    });

    document.getElementById('info-btn').addEventListener('click', () => {
        alert("Library Data: Tracking local media elements located in your directory system.");
    });
});

function initHeroBanner() {
    const banner = document.getElementById('banner');
    document.getElementById('banner-title').innerText = myMovies[0].name;
    document.getElementById('banner-desc').innerText = "Streaming a looping graphic format directly from your secure local storage directories.";
    banner.style.backgroundImage = `linear-gradient(to bottom, rgba(0,0,0,0.3), #111), url('${myMovies[0].img}')`;
}

function renderAllRows(movieDataList) {
    populateRow('trending-row', movieDataList);
    populateRow('tv-row', movieDataList);
    populateRow('action-row', movieDataList);
}

function populateRow(rowId, movieArray) {
    const rowContainer = document.getElementById(rowId);
    if (!rowContainer) return;
    rowContainer.innerHTML = ''; 

    if (movieArray.length === 0) {
        rowContainer.innerHTML = `<p style="color: #666; padding: 10px;">No match found</p>`;
        return;
    }

    movieArray.forEach(movie => {
        const imgElement = document.createElement('img');
        imgElement.src = movie.img;
        imgElement.alt = movie.name;
        imgElement.className = 'movie-card';
        
        imgElement.addEventListener('click', () => {
            openMovieScreen(movie.videoUrl, movie.name, movie);
        });

        rowContainer.appendChild(imgElement);
    });
}

// Inject cinema viewer screen structure with Like/Dislike action blocks
function setupModalDOM() {
    const modalDiv = document.createElement('div');
    modalDiv.id = 'video-modal';
    modalDiv.className = 'modal-overlay';
    modalDiv.innerHTML = `
        <div class="modal-box">
            <span class="close-modal">&times;</span>
            <h2 id="modal-title">Movie Title</h2>
            
            <!-- New Functional Interaction Buttons -->
            <div class="interaction-row">
                <button type="button" id="like-btn" class="action-toggle-btn">👍 Like</button>
                <button type="button" id="dislike-btn" class="action-toggle-btn">👎 Dislike</button>
            </div>

            <div class="media-frame">
                <img id="gif-player" src="" alt="Notflix Content Player" />
            </div>
        </div>
    `;
    document.body.appendChild(modalDiv);

    // Wire up Like logic mechanics
    const likeBtn = document.getElementById('like-btn');
    const dislikeBtn = document.getElementById('dislike-btn');

    likeBtn.addEventListener('click', () => {
        if (!currentActiveMovie) return;
        
        if (currentActiveMovie.userRating === 'like') {
            currentActiveMovie.userRating = null; // Toggle off if clicked again
        } else {
            currentActiveMovie.userRating = 'like';
        }
        updateButtonVisuals();
    });

    dislikeBtn.addEventListener('click', () => {
        if (!currentActiveMovie) return;

        if (currentActiveMovie.userRating === 'dislike') {
            currentActiveMovie.userRating = null; // Toggle off if clicked again
        } else {
            currentActiveMovie.userRating = 'dislike';
        }
        updateButtonVisuals();
    });

    modalDiv.querySelector('.close-modal').addEventListener('click', () => {
        modalDiv.classList.remove('active');
        document.getElementById('gif-player').src = ""; 
        currentActiveMovie = null;
    });
}

// Controls active colored css highlighting states dynamically
function updateButtonVisuals() {
    const likeBtn = document.getElementById('like-btn');
    const dislikeBtn = document.getElementById('dislike-btn');

    // Clean away previous layouts
    likeBtn.classList.remove('liked');
    dislikeBtn.classList.remove('disliked');

    if (currentActiveMovie && currentActiveMovie.userRating === 'like') {
        likeBtn.classList.add('liked');
    } else if (currentActiveMovie && currentActiveMovie.userRating === 'dislike') {
        dislikeBtn.classList.add('disliked');
    }
}

// Triggers the dark video viewer box
function openMovieScreen(gifPath, movieName, movieObject) {
    const modal = document.getElementById('video-modal');
    currentActiveMovie = movieObject; // Pin this item to track reactions
    
    document.getElementById('modal-title').innerText = movieName;
    document.getElementById('gif-player').src = gifPath;
    
    updateButtonVisuals(); // Colorize buttons based on saved rating states
    modal.classList.add('active');

    if (movieObject) {
        addToWatchAgain(movieObject);
    }
}

function addToWatchAgain(movie) {
    if (!watchAgainList.some(item => item.id === movie.id)) {
        watchAgainList.unshift(movie); 
        
        const section = document.getElementById('row-watch-again-section');
        const rowContainer = document.getElementById('watch-again-row');
        
        if (section && rowContainer) {
            section.style.display = 'block';
            rowContainer.innerHTML = '';

            watchAgainList.forEach(historyMovie => {
                const imgElement = document.createElement('img');
                imgElement.src = historyMovie.img;
                imgElement.alt = historyMovie.name;
                imgElement.className = 'movie-card';
                
                imgElement.addEventListener('click', () => {
                    openMovieScreen(historyMovie.videoUrl, historyMovie.name, historyMovie);
                });
                rowContainer.appendChild(imgElement);
            });
        }
    }
}
