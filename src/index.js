import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';

const searchFormEl = document.querySelector('#search-form');
const searchTextEl = document.querySelector('[type="text"]');
const buttonSearchEl = document.querySelector('[type="submit"]');
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');

let searchText = '';
let pageNumber = 1;
let pageNumbers = 0;
buttonSearchEl.setAttribute('disabled', true);

const createGallery = photoArry => {
  const result = photoArry.reduce(
    (acc, item) =>
      (acc += `
       <div class="photo-card">
        <a class="gallery__link" href="${item.largeImageURL}">
            <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b> ${item.likes}</p>
              <p class="info-item"><b>Views</b> ${item.views}</p>
              <p class="info-item"><b>Comments</b> ${item.comments}</p>
              <p class="info-item"><b>Downloads</b> ${item.downloads}</p>
            </div>
            </a>
        </div>`),
    ''
  );
  galleryEl.insertAdjacentHTML('beforeend', result);
  let gallery = new SimpleLightbox('.gallery a');
  gallery.on('show.simplelightbox', function () {
    // do something…
  });
  loadMoreEl.classList.remove('visually-hidden');
  loadMoreEl.removeAttribute('disabled');
  if (pageNumbers <= pageNumber) {
    loadMoreEl.classList.add('visually-hidden');
    Notiflix.Notify.info(
      `We're sorry, but you've reached the end of search results.`
    );
  }
};

searchTextEl.addEventListener('input', e => {
  searchText = searchTextEl.value.trim();
  console.log(searchTextEl.value.trim());
  if (searchText !== '') {
    buttonSearchEl.removeAttribute('disabled');
  } else {
    buttonSearchEl.setAttribute('disabled', true);
  }
});
buttonSearchEl.addEventListener('click', handelSubmit);
function handelSubmit(evt) {
  evt.preventDefault();
  galleryEl.innerHTML = '';
  pageNumber = 1;
  pageNumbers = 0;
  getPhotos();
}
const getPhotos = async () => {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=26390614-440d4a1ea806ddcf9832f9246&q=${searchText}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageNumber}`
    );
    console.log(response.data);
    Notiflix.Notify.success(
      `Hooray! We found ${response.data.hits.length} totalHits images.`
    );
    pageNumbers = Math.ceil(
      response.data.totalHits / response.data.hits.length
    );
    if (response.data.hits.length > 0) {
      createGallery(response.data.hits);
    } else {
      Notiflix.Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
    }
    gallery.refresh();
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure(`Error`);
  } finally {
    pageNumber += 1;
  }
};

loadMoreEl.addEventListener('click', handelLoadMore);
function handelLoadMore(evt) {
  evt.preventDefault();
  getPhotos();
  loadMoreEl.setAttribute('disabled', true);
}

let gallery = new SimpleLightbox('.gallery a');
gallery.on('show.simplelightbox', function () {});

const lightbox = new SimpleLightbox('.gallery a', {
  captionSelector: 'img',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});
