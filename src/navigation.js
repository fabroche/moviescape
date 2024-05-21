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
    getTrendingMoviesPreview()
    getCategoriesPreview()
}

function categoriesPage() {
    console.log('CATEGORIES!!!')
}

function movieDetailsPage() {
    console.log('MOVIES!!!')
}

function searchPage() {
    console.log('Search!!!')
}

function trendsPage() {
    console.log('TRENDS!!!')
}