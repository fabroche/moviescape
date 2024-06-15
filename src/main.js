const API = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        Authorization: `Bearer ${API_KEY}`,
    }
})

// global values
const useState = (defaultValue) => {
    let value = defaultValue;

    const getValue = () => value;
    const setValue = (newValue) => value = newValue;

    return [getValue, setValue];
};

// LocalStorage
function getlikedMoviesList() {
    const likedMovies = JSON.parse(localStorage.getItem('liked_movies'))

    if (likedMovies) {
        return likedMovies;
    }

    return {}
}

function likeMovie(movie) {
    const likedMovies = getlikedMoviesList();

    if (likedMovies[movie.id]) {
        delete likedMovies[movie.id];
    } else {
        likedMovies[movie.id] = movie;
    }

    localStorage.setItem('liked_movies', JSON.stringify(likedMovies))
    const likedMoviesList = Object.values(getlikedMoviesList())
    renderMovies(likedMoviesList.reverse(), likedMovieListElement, {lazyLoad: true, infiniteScroll: false})
    getTrendingMoviesPreview()
}

function isLikedMovie(movieId) {
    return Boolean(getlikedMoviesList()[movieId])
}

// Utils

function handleInfiniteScroll() {
    try {
        infiniteScroll()
    } catch (error) {

    }
}

async function handleAddToFavorite(e) {
    e.target.classList.toggle('liked-btn--active')

    const movieId = e.target.getAttribute('data-movie-id')
    const movie = await getMovieById(movieId)
    likeMovie(movie);
}

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


            // Carga los próximos n elementos
            nextElements.forEach((nextElement) => {
                try {
                    if (!nextElement.hasAttribute('not-observe')) {
                        nextElement.classList.remove('movie-container--loading');
                        nextElement.children[0].setAttribute('src', nextElement.children[0].getAttribute('data-src'));
                        observer.unobserve(nextElement);
                    }
                } catch (e) {
                    console.error("Error ocacionado en el elemento =", nextElement)
                    console.error(e)
                }
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

function renderMovies(movieArray, domElementContainer, {lazyLoad = false, infiniteScrolling = false} = {}) {

    if (movieArray.length === 0 && !infiniteScrolling) {
        domElementContainer.innerHTML = `<h3>🙁Ups!, there is no coincidences.</h3>`
        return;
    }
    let tempMovie;
    const movies = `${movieArray.map(movie =>
        `<div class="movie-container">
                <img
                    id="img-${movie.id}"
                    ${lazyLoad ? `data-src=https://image.tmdb.org/t/p/w300${movie.poster_path}` : `src=https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    class="movie-img"
                    alt="${movie.title}"
                    onclick="navigateToMovieDetails('${movie.id}')"
                />
                <button class="liked-btn generic-btn button-absolute-top-right ${isLikedMovie(movie.id) ? 'liked-btn--active' : ''}" data-movie-id="${movie.id}"></button>
            </div>`
    ).join("")}`


    infiniteScrolling ? domElementContainer.innerHTML = domElementContainer.innerHTML + movies : domElementContainer.innerHTML = movies

    // Agregando evento onError a los elementos img de los movie-containers
    domElementContainer.childNodes.forEach(movieContainer => {
        const img = movieContainer.children[0]
        const likeBtn = movieContainer.children[1]

        if (!img.hasAttribute('has-onerror-event')) {
            img.addEventListener('error', (e) => setDefaultImage(e))
            img.setAttribute('has-onerror-event', true)
        }

        if (!likeBtn.hasAttribute('has-onclick-event')) {
            likeBtn.setAttribute('has-onclick-event', true)
            likeBtn.addEventListener('click', (e) => handleAddToFavorite(e))
        }
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
    movieDetailScoreElement.innerHTML = `<span class="movieDetail-score movieDetail-score-icon"></span>${parseFloat(movie.vote_average).toFixed(1)}`
    movieDetailScoreElement.classList.remove('movieDetail-score--loading')
    const likeBtn = movieDetailHeaderInfo.children[0]
    likeBtn.classList.remove('liked-btn--loading')
    likeBtn.classList.add('liked-btn')
    isLikedMovie(movie.id)
        ? likeBtn.classList.add('liked-btn--active')
        : likeBtn.classList.remove('liked-btn--active')

    likeBtn.setAttribute('data-movie-id', movie.id)
    if (!likeBtn.hasAttribute('has-like-event')) {
        likeBtn.setAttribute('has-like-event', 'true')
        likeBtn.addEventListener('click', (e) => handleAddToFavorite(e))
    }
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

function handleOnClickScrollResetBtn() {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement

    if (resetScrollButton.innerText === 'Scroll Up') {
        setScrollState({x: 0, y: scrollTop})
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        })
    } else {
        window.scrollTo({
            top: scrollState().y === 0 ? scrollHeight : scrollState().y,
            left: 0,
            behavior: "smooth"
        })
    }
}

function handleScrollResetBtnState(scrollTop) {
    if (scrollTop === 0) {
        resetScrollButton.innerText = 'Scroll Down'
    } else {
        resetScrollButton.innerText = 'Scroll Up'
    }
}

// API Call Functions
async function getTrendingMoviesPreview() {

    const {data} = await API('/trending/movie/day')

    renderMovies(data.results, trendingPreviewMovieListElement, {lazyLoad: true})
}

async function getTrendingMovies() {

    const {data} = await API('/trending/movie/day')
    maxPage = data.total_pages;
    renderMovies(data.results, genericListElement, {lazyLoad: true})

    genericListElement.appendChild(resetScrollButton)
}

async function getPaginatedTrendingMovies() {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement

    handleScrollResetBtnState(scrollTop)

    const pageIsNotMaxPage = page < maxPage
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)

    if (scrollIsBottom && pageIsNotMaxPage) {
        page++;
        const {data} = await API('/trending/movie/day', {
            params: {
                page: page
            },
        })

        if (data.results.length === 0) {
            return;
        }

        genericListElement.removeChild(resetScrollButton)
        renderMovies(data.results, genericListElement, {lazyLoad: true, infiniteScrolling: true})
        genericListElement.appendChild(resetScrollButton)
    }
}

async function getMoviesByCategory(categoryId) {

    const {data} = await API('/discover/movie', {
        params: {
            with_genres: categoryId
        }
    })
    maxPage = data.total_pages;
    renderMovies(data.results, genericListElement, {lazyLoad: true})
    genericListElement.appendChild(resetScrollButton)
}

function getPaginatedMoviesByCategory(categoryId) {
    // const {categoryId} = params
    return async function () {
        const {scrollTop, scrollHeight, clientHeight} = document.documentElement

        handleScrollResetBtnState(scrollTop)

        const pageIsNotMaxPage = page < maxPage
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)

        if (scrollIsBottom && pageIsNotMaxPage) {
            page++;
            const {data} = await API('/discover/movie', {
                params: {
                    with_genres: categoryId,
                    page: page
                },
            })

            if (data.results.length === 0) {
                return;
            }
            genericListElement.removeChild(resetScrollButton)
            renderMovies(data.results, genericListElement, {lazyLoad: true, infiniteScrolling: true})
            genericListElement.appendChild(resetScrollButton)
        }
    }

}

async function getMovieById(movieId) {

    const {data} = await API(`/movie/${movieId}`)

    return data;
}

async function getRelatedMovieById(movieId) {

    const {data} = await API(`/movie/${movieId}/recommendations`)

    renderMovies(data.results, relatedMoviesScrollContainerElement, {lazyLoad: true})
}

async function getMoviesBySearch(searchValue) {

    const {data} = await API('/search/movie', {
        params: {
            query: searchValue
        }
    })
    maxPage = data.total_pages;
    renderMovies(data.results, genericListElement, {lazyLoad: true})
    genericListElement.appendChild(resetScrollButton)
}

function getPaginatedMoviesBySearch(searchValue) {
    // const {searchValue} = params
    return async function () {
        const {scrollTop, scrollHeight, clientHeight} = document.documentElement

        handleScrollResetBtnState(scrollTop)

        const pageIsNotMaxPage = page < maxPage
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)

        if (scrollIsBottom && pageIsNotMaxPage) {
            page++;
            const {data} = await API('/search/movie', {
                params: {
                    query: searchValue,
                    page: page
                },
            })

            if (data.results.length === 0) {
                return;
            }
            genericListElement.removeChild(resetScrollButton)
            renderMovies(data.results, genericListElement, {lazyLoad: true, infiniteScrolling: true})
            genericListElement.appendChild(resetScrollButton)
        }
    }

}

async function getCategoriesPreview() {

    const {data} = await API('/genre/movie/list')
    renderCategories(data.genres, categoriesPreviewListElement)
}

