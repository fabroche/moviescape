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

window.addEventListener('hashchange', navigator, false)
window.addEventListener('DOMContentLoaded', navigator, false)


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

function trendsPage() {
    console.log('TRENDS!!!')

}