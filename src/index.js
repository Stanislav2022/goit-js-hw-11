import './css/styles.css';
import { Notify } from 'notiflix';
import axios from 'axios';
const searchFormEl = document.querySelector('#search-form');
const searchTextEl = document.querySelector('[type="text"]');
const buttonSearchEl = document.querySelector('[type="submit"]');
const galleryEl = document.querySelector('.gallery');

let searchText = '';

const createGallery = photoArry => {
  const result = photoArry.reduce(
    (acc, item) =>
      (acc += `
        <div class="photo-card">
            <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b> ${item.likes}</p>
              <p class="info-item"><b>Views</b> ${item.views}</p>
              <p class="info-item"><b>Comments</b> ${item.comments}</p>
              <p class="info-item"><b>Downloads</b> ${item.downloads}</p>
            </div>
        </div>`),
    ''
  );
  galleryEl.insertAdjacentHTML('afterbegin', result);
};

searchTextEl.addEventListener('input', e => {
  searchText = searchTextEl.value;
  console.log(searchTextEl.value);
});
buttonSearchEl.addEventListener('click', handelSubmit);
function handelSubmit(evt) {
  evt.preventDefault();
  getPhotos();
}

const getPhotos = async () => {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=26390614-440d4a1ea806ddcf9832f9246&q=${searchText}&image_type=photo&orientation=horizontal&safesearch=true`
    );
    console.log(response.data.hits);
    createGallery(response.data.hits);
  } catch (error) {
    console.log(error);
    window.alert(
      `Sorry, there are no images matching your search query. Please try again.`
    );
  }
};

// https://pixabay.com/api/?key=26390614-440d4a1ea806ddcf9832f9246&q=${input}&image_type=photo&orientation=horizontal&safesearch=true
