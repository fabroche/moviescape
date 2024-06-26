const headerElement = document.querySelector('#header');
const headerArrowElement = document.querySelector('.header-arrow');
const headerHomeElement = document.querySelector('.header-home');
const headerCategoryTitleElement = document.querySelector('.header-title--categoryView');
const headerTitleElement = document.querySelector('.header-title');
const searchFormElement = document.querySelector('#searchForm');
const searchFormInputElement = document.getElementById('search-input');
const searchFormButtonElement = document.getElementById('search-form-button');
const trendingPreviewSectionElement = document.querySelector('#trendingPreview');
const trendingPreviewBtnElement = document.querySelector('#trendingPreview-btn');
const trendingPreviewHeaderElement = document.querySelector('#trendingPreview .trendingPreview-header');
const trendingPreviewHeaderTitleElement = document.querySelector('#trendingPreview .trendingPreview-title');
const trendingPreviewMovieListElement = document.querySelector('#trendingPreview .trendingPreview-movieList');
const categoriesPreviewSection = document.querySelector('#categoriesPreview');
const categoriesPreviewTitleElement = document.querySelector('#categoriesPreview .categoriesPreview-title');
const categoriesPreviewListElement = document.querySelector('#categoriesPreview .categoriesPreview-list');
const genericListElement = document.querySelector('#genericList');
const movieDetailSection = document.querySelector('#movieDetail');
const movieDetailHeaderInfo = document.querySelector('#movieDetails-header-info');
const movieDetailTitleElement = document.querySelector('#movieDetail .movieDetail-title');
const movieDetailScoreElement = document.querySelector('#movieDetail .movieDetail-score');
const movieDetailDescriptionElement = document.querySelector('#movieDetail .movieDetail-description');
const categoriesListElement = document.querySelector('#movieDetail .categories-list');
const relatedMoviesContainerElement = document.querySelector('#movieDetail .relatedMovies-container');
const relatedMoviesTitleElement = document.querySelector('#movieDetail .relatedMovies-title');
const relatedMoviesScrollContainerElement = document.querySelector('#movieDetail .relatedMovies-scrollContainer');
const footerElement = document.querySelector('#footer')
const resetScrollButton = document.createElement('button')
resetScrollButton.innerText = 'Scroll Down'
resetScrollButton.classList.add('button-fixed-bottom-right')
resetScrollButton.setAttribute('not-observe', 'true')
const likedMovieSectionElement = document.querySelector('#liked')
const likedMoviePreviewTitleElement = document.querySelector('#liked .liked-title')
const likedMovieListElement = document.querySelector('#liked .liked-movieList')
const languageSelectElement = document.querySelector('#idiomas')
languageSelectElement.addEventListener('change', (e) => onChangeHandleLanguageState(e))