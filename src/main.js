const API = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        Authorization: `Bearer ${API_KEY}`,
    }
})

async function getTrendingMoviesPreview() {

    const {data} = await API('/trending/movie/day')

    trendingPreviewMovieListElement.innerHTML = `${data.results.map(movie =>
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
}

async function getCategoriesPreview() {

    const {data} = await API('/genre/movie/list')

    categoriesPreviewListElement.innerHTML = `${data.genres.map(category =>
        `<div class="category-container">
            <h3 id="id${category.id}" class="category-title">${category.name}</h3>
        </div>`
    ).join("")}`
}


// document.addEventListener('DOMContentLoaded', main)