function navigator() {
    console.log(location)

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
headerArrowElement.addEventListener('click', () => location.hash = '#home')

function homePage() {
    console.log('HOME!!!')
    headerElement.classList.remove('header-container--long')
    headerElement.style.background = ''
    headerArrowElement.classList.add('inactive')
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
    console.log('CATEGORIES!!!')
    window.scrollTo(0, 0)
    headerElement.classList.remove('header-container--long')
    headerElement.style.background = ''
    headerArrowElement.classList.remove('inactive')
    headerArrowElement.classList.remove('header-arrow--white')
    headerCategoryTitleElement.classList.remove('inactive')
    headerTitleElement.classList.add('inactive')
    searchFormElement.classList.add('inactive')
    trendingPreviewSectionElement.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericListElement.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    const [categoryId,categoryName] = location.hash.split('=')[1].split('-')
    headerCategoryTitleElement.innerText = capitalize(categoryName.split('%20'))
    getMoviesByCategory(categoryId)

}

function movieDetailsPage() {
    console.log('MOVIES!!!')
    headerElement.classList.add('header-container--long')
    // headerElement.style.background = ''
    headerArrowElement.classList.remove('inactive')
    headerArrowElement.classList.add('header-arrow--white')
    headerCategoryTitleElement.classList.add('inactive')
    headerTitleElement.classList.add('inactive')
    searchFormElement.classList.add('inactive')

    trendingPreviewSectionElement.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericListElement.classList.add('inactive')
    movieDetailSection.classList.remove('inactive')
}

function searchPage() {
    console.log('Search!!!')
    headerElement.classList.remove('header-container--long')
    headerElement.style.background = ''
    headerArrowElement.classList.remove('inactive')
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

    const searchValue = capitalize(newTitleWordsArray)
    getMoviesBySearch(searchValue)



}

function trendsPage() {
    console.log('TRENDS!!!')
    headerElement.classList.remove('header-container--long')
    headerElement.style.background = ''
    headerArrowElement.classList.remove('inactive')
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