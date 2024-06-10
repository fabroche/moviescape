const API = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        Authorization: `Bearer ${API_KEY}`,
    }
})

// Utils
function renderMovies(movieArray, domElementContainer) {

    if (movieArray.length === 0) {
        domElementContainer.innerHTML = `<h3>🙁Ups!, there is no coincidences.</h3>`
        return;
    }
    domElementContainer.innerHTML = `${movieArray.map(movie =>
        `<div class="movie-container" onclick="navigateToMovieDetails('${movie.id}')">
                <img
                    src="https://image.tmdb.org/t/p/w300${movie.poster_path}"
                    class="movie-img"
                    alt="${movie.title}"
                />
                <div class="movie-container-background">
                <span class="movieDetail-score">${parseFloat(movie.vote_average).toFixed(1)}</span>
                </div>
            </div>`
    ).join("")}`

}

function renderMovieDetailsSection(movie, domElementContainer) {
    headerElement.classList.remove('header-container--loading')

    headerElement.style = `
    background-image: url(https://image.tmdb.org/t/p/w${getClosestWidth(window.innerWidth)}${movie.poster_path});
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url(https://image.tmdb.org/t/p/w${getClosestWidth(window.innerWidth)}${movie.poster_path});
    `
    movieDetailTitleElement.innerText = movie.title
    movieDetailTitleElement.classList.remove('movieDetail-title--loading')
    movieDetailScoreElement.innerText = parseFloat(movie.vote_average).toFixed(1)
    movieDetailScoreElement.classList.remove('movieDetail-score--loading')
    movieDetailDescriptionElement.innerText = movie.overview
    movieDetailDescriptionElement.classList.remove('movieDetail-description--loading')

    renderCategories(movie.genres, document.querySelector('#movieDetail .categories-list'))
    getRelatedMovieById(movie.id)
}

function renderCategories(categoriesArray, domElementContainer) {

    domElementContainer.innerHTML = `${categoriesArray.map(category =>
        `<div class="category-container" onclick="navigateToCategoryId('${category.id}-${category.name}')">
            <h3 id="id${category.id}" class="category-title">${category.name}</h3>
        </div>`
    ).join("")}`

}

function capitalize(stringArray) {
    let titleWords = stringArray.join(" ").toLowerCase().split(" ")

    titleWords[0] = titleWords[0][0].toUpperCase() + titleWords[0].slice(1)

    return titleWords.join(" ")
}

function navigateToCategoryId(categoryId) {
    location.hash = `#category=${categoryId}`
}

function navigateToMovieDetails(movieId) {
    location.hash = `#movie=${movieId}`
}

function getClosestWidth(screenWidth) {
    const availableWidths = [300, 400, 500];
    availableWidths.sort((a, b) => a - b);

    let closestWidth = availableWidths[0]
    for (const width of availableWidths) {
        if (width >= screenWidth) {
            closestWidth = width
            return closestWidth
        }
    }
    return availableWidths[2]
}

// API Call Functions
async function getTrendingMoviesPreview() {

    const {data} = await API('/trending/movie/day')

    renderMovies(data.results, trendingPreviewMovieListElement)
}

async function getTrendingMovies() {

    const {data} = await API('/trending/movie/day')

    renderMovies(data.results, genericListElement)
}

async function getMoviesByCategory(categoryId) {

    const {data} = await API('/discover/movie', {
        params: {
            with_genres: categoryId
        }
    })

    renderMovies(data.results, genericListElement)
}

async function getMovieById(movieId) {

    const {data} = await API(`/movie/${movieId}`)

    return data;
}

async function getRelatedMovieById(movieId) {

    const {data} = await API(`/movie/${movieId}/recommendations`)

    renderMovies(data.results, document.querySelector('#movieDetail .relatedMovies-scrollContainer'))
}

async function getMoviesBySearch(seachValue) {

    const {data} = await API('/search/movie', {
        params: {
            query: seachValue
        }
    })
    renderMovies(data.results, genericListElement)
}

async function getCategoriesPreview() {

    const {data} = await API('/genre/movie/list')
    renderCategories(data.genres, categoriesPreviewListElement)
}


// document.addEventListener('DOMContentLoaded', main)