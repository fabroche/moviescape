function navigator() {

    const HASHES = {
        '#trends': () => trendsPage(),
        '#search=': () => searchPage(),
        '#movie=': () => movieDetailsPage(),
        '#category=': () => categoriesPage()
    }

    for (const KEY in HASHES) {
        if (location.hash.startsWith(KEY)) {
            HASHES[KEY]()
            return;
        }
    }

    homePage()

}

//Event listeners
window.addEventListener('hashchange', navigator, false)
window.addEventListener('DOMContentLoaded', navigator, false)
searchFormButtonElement.addEventListener('click', () => location.hash = `#search=${searchFormInputElement.value}`)
trendingPreviewBtnElement.addEventListener('click', () => location.hash = '#trends')
headerArrowElement.addEventListener('click', () => history.back())
headerHomeElement.addEventListener('click', () => location.hash = '#home')

function homePage() {
    headerElement.classList.remove('header-container--long')
    headerElement.style.background = ''
    headerArrowElement.classList.add('inactive')
    headerHomeElement.classList.add('inactive')
    headerArrowElement.classList.remove('header-arrow--white')
    headerCategoryTitleElement.classList.add('inactive')
    headerTitleElement.classList.remove('inactive')
    searchFormElement.classList.remove('inactive')
    trendingPreviewSectionElement.classList.remove('inactive')
    categoriesPreviewSection.classList.remove('inactive')
    genericListElement.classList.add('inactive')
    movieDetailSection.classList.add('inactive')

    getTrendingMoviesPreview()
    getCategoriesPreview()
}

function categoriesPage() {
    window.scrollTo(0, 0)
    headerElement.classList.remove('header-container--long')
    headerElement.style.background = ''
    headerArrowElement.classList.remove('inactive')
    headerHomeElement.classList.remove('inactive')
    headerArrowElement.classList.remove('header-arrow--white')
    headerCategoryTitleElement.classList.remove('inactive')
    headerTitleElement.classList.add('inactive')
    searchFormElement.classList.add('inactive')
    trendingPreviewSectionElement.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericListElement.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    const [categoryId, categoryName] = location.hash.split('=')[1].split('-')
    headerCategoryTitleElement.innerText = capitalize(categoryName.split('%20'))
    getMoviesByCategory(categoryId)

}

async function movieDetailsPage() {
    window.scrollTo(0, window.innerHeight / 2)
    headerElement.classList.add('header-container--long')
    headerElement.classList.add('header-container--loading')

    // headerElement.style.background = ''
    headerArrowElement.classList.remove('inactive')
    headerHomeElement.classList.remove('inactive')
    headerArrowElement.classList.add('header-arrow--white')
    headerCategoryTitleElement.classList.add('inactive')
    headerTitleElement.classList.add('inactive')
    searchFormElement.classList.add('inactive')

    trendingPreviewSectionElement.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericListElement.classList.add('inactive')
    movieDetailSection.classList.remove('inactive')

    headerElement.style = 'background-image: none; background: var(--purple-light-3);'
    movieDetailTitleElement.innerText = ""
    movieDetailTitleElement.classList.add('movieDetail-title--loading')
    movieDetailScoreElement.innerText = ""
    movieDetailScoreElement.classList.add('movieDetail-score--loading')
    movieDetailDescriptionElement.innerText = ""
    movieDetailDescriptionElement.classList.remove('movieDetail-description--loading')
    categoriesListElement.innerHTML = `
        <div class="category-container category-container--loading"></div>
        <div class="category-container category-container--loading"></div>
        <div class="category-container category-container--loading"></div>
        <div class="category-container category-container--loading"></div>
    `
    relatedMoviesScrollContainerElement.innerHTML = `
        <div class="movie-container movie-container--loading"></div>
        <div class="movie-container movie-container--loading"></div>
        <div class="movie-container movie-container--loading"></div>
    `

    const movieId = location.hash.split('#movie=')[1]
    const movie = await getMovieById(movieId)
    renderMovieDetailsSection(movie)

}

function searchPage() {
    headerElement.classList.remove('header-container--long')
    headerElement.style.background = ''
    headerArrowElement.classList.remove('inactive')
    headerHomeElement.classList.remove('inactive')
    headerArrowElement.classList.remove('header-arrow--white')
    headerCategoryTitleElement.classList.remove('inactive')
    headerTitleElement.classList.add('inactive')
    const newTitleWordsArray = location.hash.split('=')[1].split('%20')
    headerCategoryTitleElement.innerText = newTitleWordsArray.length === 1 && newTitleWordsArray[0] === '' ? "Search" : capitalize(newTitleWordsArray)
    trendingPreviewSectionElement.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericListElement.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')
    searchFormElement.classList.remove('inactive')

    const searchValue = newTitleWordsArray[0] === '' ? '' : capitalize(newTitleWordsArray)
    getMoviesBySearch(searchValue)


}

function trendsPage() {
    headerElement.classList.remove('header-container--long')
    headerElement.style.background = ''
    headerArrowElement.classList.remove('inactive')
    headerHomeElement.classList.remove('inactive')
    headerArrowElement.classList.remove('header-arrow--white')
    headerCategoryTitleElement.classList.remove('inactive')
    headerCategoryTitleElement.innerText = 'Tendencias'
    headerTitleElement.classList.add('inactive')
    searchFormElement.classList.add('inactive')
    trendingPreviewSectionElement.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericListElement.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    getTrendingMovies()
}