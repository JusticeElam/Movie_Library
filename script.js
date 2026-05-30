const API_KEY = '6100287fcb0455df27e5c2baf78191f9';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
let favorites =
JSON.parse(localStorage.getItem('favorites')) || [];

/* =========================
   ELEMENTS
========================= */
const movieGrid = document.getElementById('movieGrid');
const ratingFilter = document.getElementById('ratingFilter');

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

const themeToggle = document.getElementById('themeToggle');
const hamThemeToggle = document.getElementById('ham-themeToggle');

const hamMenu = document.querySelector('.fa-bars');
const sideNav = document.querySelector('.side-nav');
const sideNavClose = document.querySelector('.nav-close');


/* =========================
   SIDE NAV
========================= */
hamMenu.addEventListener('click', () => {
  sideNav.style.display = 'block';
});

sideNavClose.addEventListener('click', () => {
  sideNav.style.display = 'none';
});

/* =========================
   CATEGORY BUTTONS
========================= */
let currentCategory = 'popular';

document.getElementById('popular').onclick = () => fetchMovies('popular');
document.getElementById('topRated').onclick = () => fetchMovies('top_rated');
document.getElementById('upcoming').onclick = () => fetchMovies('upcoming');

document.getElementById('ham-popular').onclick = () => fetchMovies('popular');
document.getElementById('ham-topRated').onclick = () => fetchMovies('top_rated');
document.getElementById('ham-upcoming').onclick = () => fetchMovies('upcoming');

/* =========================
   FILTER
========================= */
ratingFilter.onchange = () => fetchMovies(currentCategory);

/* =========================
   FETCH MOVIES
========================= */
function fetchMovies(category) {
  currentCategory = category;

  const url = `${BASE_URL}/movie/${category}?api_key=${API_KEY}&language=en-US&page=1`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const minRating = parseFloat(ratingFilter.value);
      const filtered = data.results.filter(m => m.vote_average >= minRating);
      displayMovies(filtered);
    });
}

/* =========================
   DISPLAY MOVIES
========================= */
function displayMovies(movies) {
  movieGrid.innerHTML = '';

  movies.forEach(movie => {

    const isFavorite =
    favorites.some(item => item.id === movie.id);

    const card = document.createElement('div');
    card.className = 'movie-card';

    card.innerHTML = `
      <img src="${IMG_BASE}${movie.poster_path}" alt="${movie.title}" />
      <h3>${movie.title}</h3>
      <p>⭐ ${movie.vote_average}</p>
      <p>Release: ${movie.release_date}</p>
      <p>${movie.overview.slice(0, 100)}...</p>

      <button class="favorite-btn">
        ${isFavorite ? '❌ Remove Favorite' : '❤️ Add Favorite'}
      </button>
    `;

    const favoriteBtn =
    card.querySelector('.favorite-btn');

    favoriteBtn.addEventListener('click', (e) => {

      e.stopPropagation();

      const exists =
      favorites.some(item => item.id === movie.id);

      if(exists){

        favorites =
        favorites.filter(item => item.id !== movie.id);

        localStorage.setItem(
          'favorites',
          JSON.stringify(favorites)
        );

        favoriteBtn.textContent =
        '❤️ Add Favorite';

      }else{

        favorites.push(movie);

        localStorage.setItem(
          'favorites',
          JSON.stringify(favorites)
        );

        favoriteBtn.textContent =
        '❌ Remove Favorite';

      }

    });

    card.addEventListener('click', () => {
      fetchMovieDetails(movie.id);
    });

    movieGrid.appendChild(card);

  });
}

const favoritesBtn =
document.getElementById('favoritesBtn');

favoritesBtn.addEventListener('click', () => {

  currentCategory = 'favorites';

  displayMovies(favorites);

});

// ===========================
// SEARCH FUNCTIONALITY
// ===========================
searchBtn.addEventListener('click', () => {

  const query = searchInput.value.trim();

  if(query === ''){
    return;
  }

  searchMovies(query);

});

function searchMovies(query){

  const url =
  `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {

      displayMovies(data.results);

    })
    .catch(error => {

      console.log(error);

    });

}

searchInput.addEventListener('keydown', (e) => {

  if(e.key === 'Enter'){

    searchBtn.click();

  }

});


/* =========================
   MOVIE DETAILS + MODAL
========================= */
function fetchMovieDetails(id) {
  fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      showModal(data);
    });
}

/* =========================
   MODAL UI
========================= */
const modal = document.getElementById('movieModal');
const closeBtn = document.querySelector('.closeBtn');

function showModal(data) {
  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalDate').textContent = data.release_date;
  document.getElementById('modalRuntime').textContent = data.runtime;
  document.getElementById('modalRating').textContent = data.vote_average;
  document.getElementById('modalLang').textContent = data.original_language.toUpperCase();
  document.getElementById('modalOverview').textContent = data.overview;

  /* Trailer button (SAFE - user click only) */
  const trailerBtn = document.getElementById('trailerBtn');
  trailerBtn.onclick = () => {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(data.title + " official trailer")}`;
    window.open(url, '_blank');
  };

  modal.style.display = "block";
}

/* Close modal */
closeBtn.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
};

/* =========================
   THEME TOGGLE
========================= */
themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('light');
  document.body.classList.toggle('dark');
});

hamThemeToggle.addEventListener('change', () => {
  document.body.classList.toggle('light');
  document.body.classList.toggle('dark');
});

/* =========================
   INITIAL LOAD
========================= */
fetchMovies('popular');