
const API_KEY = '6100287fcb0455df27e5c2baf78191f9';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

const movieGrid = document.getElementById('movieGrid');
const ratingFilter = document.getElementById('ratingFilter');
const themeToggle = document.getElementById('themeToggle');
const hamThemeToggle = document.getElementById('ham-themeToggle');
const hamMenu = document.querySelector('.fa-bars')
const sideNav = document.querySelector('.side-nav')
const sideNavClose = document.querySelector('.nav-close')


hamMenu.addEventListener('click', () => {
  sideNav.style.display = 'block'
})

sideNavClose.addEventListener('click', () => {
  sideNav.style.display = 'none'
})


document.getElementById('popular').onclick = () => fetchMovies('popular');
document.getElementById('topRated').onclick = () => fetchMovies('top_rated');
document.getElementById('upcoming').onclick = () => fetchMovies('upcoming');

document.getElementById('ham-popular').onclick = () => fetchMovies('popular');
document.getElementById('ham-topRated').onclick = () => fetchMovies('top_rated');
document.getElementById('ham-upcoming').onclick = () => fetchMovies('upcoming');
ratingFilter.onchange = () => fetchMovies(currentCategory);

let currentCategory = 'popular';

function fetchMovies(category) {
  currentCategory = category;
  const url = `${BASE_URL}/movie/${category}?api_key=${'6100287fcb0455df27e5c2baf78191f9'}&language=en-US&page=1`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const minRating = parseFloat(ratingFilter.value);
      const filtered = data.results.filter(movie => movie.vote_average >= minRating);
      displayMovies(filtered);
    });
}

function displayMovies(movies) {
  movieGrid.innerHTML = '';
  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';

    card.innerHTML = `
      <img src="${IMG_BASE}${movie.poster_path}" alt="${movie.title}" />

      <h3>${movie.title}</h3>

      <p>⭐ ${movie.vote_average}</p>

      <p>
        Release Date:
        ${movie.release_date}
      </p>

      <p>
        Language:
        ${movie.original_language.toUpperCase()}
      </p>

      <p>
        ${movie.overview.slice(0, 100)}...
      </p>
    `;

    card.addEventListener('click', () => {

  // OPEN YOUTUBE

  const youtubeURL =
  `https://www.youtube.com/results?search_query=${movie.title}+movie`;

  window.open(youtubeURL, '_blank');



  // FETCH FULL MOVIE DETAILS

  fetch(`${BASE_URL}/movie/${movie.id}?api_key=${API_KEY}`)

    .then(res => res.json())

    .then(data => {

      alert(
      ` 
        Title: ${data.title}

        Release Date: ${data.release_date}

        Runtime: ${data.runtime} mins

        Rating: ${data.vote_average}

        Language: ${data.original_language}

        Overview:
        ${data.overview}
      `
      );

    });

});


    movieGrid.appendChild(card);
  });
}

// Theme toggle
themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('light');
  document.body.classList.toggle('dark');
});

// Side Nav
hamThemeToggle.addEventListener('change', () => {
  document.body.classList.toggle('light');
  document.body.classList.toggle('dark');
});



// Initial load
fetchMovies('popular');