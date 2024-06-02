const API = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        Authorization: `Bearer ${API_KEY}`,
    }
})

// Utils
function renderMovies(movieArray, domElementContainer) {
    if (movieArray.length !== 0) {
        domElementContainer.innerHTML = `${movieArray.map(movie =>
            `<div class="movie-container">
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
    } else {
        domElementContainer.innerHTML = `<h3>🙁Ups!, there is no coincidences.</h3>`
    }
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