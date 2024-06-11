const API = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        Authorization: `Bearer ${API_KEY}`,
    }
})

// Utils

// Función para obtener los próximos elementos
const getNextElements = (currentElement, count) => {
    const elements = [];
    let nextElement = currentElement.nextElementSibling;
    while (nextElement && elements.length < count) {
        elements.push(nextElement);
        nextElement = nextElement.nextElementSibling;
    }
    return elements;
};

const lazyLoadMovieContainerImg = (entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.remove('movie-container--loading');
            entry.target.children[0].setAttribute('src', entry.target.children[0].getAttribute('data-src'));
            observer.unobserve(entry.target);

            // Carga las imágenes de los próximos elementos
            const nextElements = getNextElements(entry.target, 6);

            // Carga los próximos 3 elementos
            nextElements.forEach((nextElement) => {
                nextElement.classList.remove('movie-container--loading');
                nextElement.children[0].setAttribute('src', nextElement.children[0].getAttribute('data-src'));
                observer.unobserve(nextElement);
            });
        }
    });
};

const imgObserverOptions = {
    threshold: 0
}

const imgLazyLoader = new IntersectionObserver(lazyLoadMovieContainerImg, imgObserverOptions)

function setDefaultImage(e) {
    // Creando el nuevo nodo
    const defaultImgPreviewNode = document.createElement('h3')
    defaultImgPreviewNode.classList.add('movie-default-img')
    defaultImgPreviewNode.classList.add('movie-img')
    defaultImgPreviewNode.innerText = e.target.alt

    // Moviendo el defaultImgPreviewNode a la panultima posicion para que funcione el hover del score
    const parentMovieContainer = e.target.parentNode
    const parentMovieContainerChildList = parentMovieContainer.children
    const scoreBackground = parentMovieContainerChildList[parentMovieContainerChildList.length - 1]
    parentMovieContainer.removeChild(scoreBackground)
    parentMovieContainer.appendChild(defaultImgPreviewNode)
    parentMovieContainer.appendChild(scoreBackground)

}

function renderMovies(movieArray, domElementContainer, lazyLoad = false) {

    if (movieArray.length === 0) {
        domElementContainer.innerHTML = `<h3>🙁Ups!, there is no coincidences.</h3>`
        return;
    }

    domElementContainer.innerHTML = `${movieArray.map(movie =>
        `<div class="movie-container" onclick="navigateToMovieDetails('${movie.id}')">
                <img
                    id="img-${movie.id}"
                    ${lazyLoad ? `data-src=https://image.tmdb.org/t/p/w300${movie.poster_path}` : `src=https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    class="movie-img"
                    alt="${movie.title}"
                />
                <div class="movie-container-background">
                <span class="movieDetail-score">${parseFloat(movie.vote_average).toFixed(1)}</span>
                </div>
            </div>`
    ).join("")}`

    domElementContainer.childNodes.forEach(movieContainer => {
        movieContainer.children[0].addEventListener('error', (e) => setDefaultImage(e))
    })
    // Observando todos los .movie-container si lazyLoad es true
    if (lazyLoad) {
        domElementContainer.childNodes.forEach(movieContainer => {
            imgLazyLoader.observe(movieContainer)
        })
    }
}

function renderMovieDetailsSection(movie) {
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

    renderCategories(movie.genres, categoriesListElement)
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

    renderMovies(data.results, trendingPreviewMovieListElement, true)
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

    renderMovies(data.results, relatedMoviesScrollContainerElement, true)
}

async function getMoviesBySearch(seachValue) {

    const {data} = await API('/search/movie', {
        params: {
            query: seachValue
        }
    })
    renderMovies(data.results, genericListElement, true)
}

async function getCategoriesPreview() {

    const {data} = await API('/genre/movie/list')
    renderCategories(data.genres, categoriesPreviewListElement)
}


// document.addEventListener('DOMContentLoaded', main)