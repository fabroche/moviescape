let maxPage;
let page = 1
let infiniteScroll;
const [scrollState, setScrollState] = useState({x: 0, y: 0})
const [languageState, setLanguageState] = useState(localStorage.getItem('language') || "en-US")

function navigator() {

    if (infiniteScroll) {
        window.removeEventListener('scroll', infiniteScroll, {passive: false});
        infiniteScroll = undefined;
        page = 1;
    }

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

    if (infiniteScroll) {
        window.addEventListener('scroll', infiniteScroll, {passive: false});
    }
}

//Event listeners
window.addEventListener('hashchange', navigator, false)
window.addEventListener('DOMContentLoaded', navigator, false)
window.addEventListener('scroll', handleInfiniteScroll, false)
genericListElement.scrollIntoView({behavior: 'smooth'})
resetScrollButton.addEventListener('click', handleOnClickScrollResetBtn)
searchFormButtonElement.addEventListener('click', () => location.hash = `#search=${searchFormInputElement.value}`)
trendingPreviewBtnElement.addEventListener('click', () => location.hash = '#trends')
headerArrowElement.addEventListener('click', () => history.back())
headerHomeElement.addEventListener('click', () => location.hash = '#home')

function homePage() {
    onChangeHandleLanguageState()
    languageSelectElement.value = languageState()
    languageSelectElement.classList.remove('inactive')
    languageSelectElement.classList.remove('hidden-top')
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
    likedMovieSectionElement.classList.remove('inactive')
    genericListElement.classList.add('inactive')
    movieDetailSection.classList.add('inactive')
    footerElement.classList.remove('footer--movie-details')

    getTrendingMoviesPreview()
    getCategoriesPreview()
    getFavoriteMoviesPreview()
}

function categoriesPage() {
    setScrollState({x: 0, y: 0});
    window.scrollTo(0, 0)
    languageSelectElement.classList.add('inactive')
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
    likedMovieSectionElement.classList.add('inactive')
    genericListElement.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')
    footerElement.classList.remove('footer--movie-details')

    const [categoryId, categoryName] = location.hash.split('=')[1].split('-')
    headerCategoryTitleElement.innerText = capitalize(categoryName.split('%20'))

    getMoviesByCategory(categoryId)
    infiniteScroll = getPaginatedMoviesByCategory(categoryId)

}

async function movieDetailsPage() {
    window.scrollTo(0, window.innerHeight / 2)
    headerElement.classList.add('header-container--long')
    headerElement.classList.add('header-container--loading')
    languageSelectElement.classList.add('inactive')

    // headerElement.style.background = ''
    headerArrowElement.classList.remove('inactive')
    headerHomeElement.classList.remove('inactive')
    headerArrowElement.classList.add('header-arrow--white')
    headerCategoryTitleElement.classList.add('inactive')
    headerTitleElement.classList.add('inactive')
    searchFormElement.classList.add('inactive')
    footerElement.classList.add('footer--movie-details')

    trendingPreviewSectionElement.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    likedMovieSectionElement.classList.add('inactive')
    genericListElement.classList.add('inactive')
    movieDetailSection.classList.remove('inactive')

    headerElement.style = 'background-image: none; background: var(--purple-light-1);'
    movieDetailTitleElement.innerText = ""
    movieDetailTitleElement.classList.add('movieDetail-title--loading')
    movieDetailScoreElement.innerText = ""
    movieDetailScoreElement.classList.add('movieDetail-score--loading')
    movieDetailDescriptionElement.innerText = ""
    const likeBtn = movieDetailHeaderInfo.children[0]
    likeBtn.classList.remove('liked-btn')
    likeBtn.classList.add('liked-btn--loading')
    movieDetailDescriptionElement.classList.add('movieDetail-description--loading')
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
    setScrollState({x: 0, y: 0});
    languageSelectElement.classList.add('inactive')
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
    likedMovieSectionElement.classList.add('inactive')
    genericListElement.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')
    searchFormElement.classList.remove('inactive')
    footerElement.classList.remove('footer--movie-details')

    const searchValue = newTitleWordsArray[0] === '' ? '' : capitalize(newTitleWordsArray)

    getMoviesBySearch(searchValue)

    infiniteScrollParams = {searchValue: searchValue}
    infiniteScroll = getPaginatedMoviesBySearch(searchValue);
}

function trendsPage() {
    setScrollState({x: 0, y: 0});
    languageSelectElement.classList.add('inactive')
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
    likedMovieSectionElement.classList.add('inactive')
    genericListElement.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')
    footerElement.classList.remove('footer--movie-details')

    getTrendingMovies();

    infiniteScroll = getPaginatedTrendingMovies;
}