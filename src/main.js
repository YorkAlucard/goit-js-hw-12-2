import { getImage } from './js/pixabay-api.js';
import { smoothScroll } from './js/render-functions.js';
import errorIcon from './img/error.svg';
import closeIcon from './img/close.svg';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export const iziOption = {
  messageColor: '#FAFAFB',
  messageSize: '16px',
  backgroundColor: '#EF4040',
  iconUrl: errorIcon,
  transitionIn: 'bounceInLeft',
  position: 'topRight',
  displayMode: 'replace',
  closeOnClick: true,
  closeIcon: true,
  close: closeIcon,
  class: 'iziToast-red',
};

let page = 1;
let query = '';
let lightbox;
const perPage = 40;
let totalHits = 0;

document
  .querySelector('.search-form')
  .addEventListener('submit', async event => {
    event.preventDefault();
    query = document.querySelector('.search-input').value.trim();
    const box = document.querySelector('.gallery');
    const loadMoreBtn = document.querySelector('.load-more');

    if (!query) {
      iziToast.show({
        ...iziOption,
        message: 'Please enter the search query',
      });
      return;
    }
    page = 1;
    box.innerHTML =
      '<p>Wait, the image is loaded</p><span class="loader"></span>';
    try {
      const response = await getImage(query, page);
      const { markup, totalHits: newTotalHits } = response;
      totalHits = newTotalHits;

      if (markup) {
        box.innerHTML = markup;
        lightbox = new SimpleLightbox('.gallery a', {
          captionsData: 'alt',
          captionDelay: 250,
        });

        if (totalHits > perPage) {
          loadMoreBtn.style.display = 'block';
        } else {
          loadMoreBtn.style.display = 'none';
        }
      } else {
        box.innerHTML = '';
        loadMoreBtn.style.display = 'none';
      }
    } catch (error) {
      console.error('Error loading images:', error);
      box.innerHTML = '';
      loadMoreBtn.style.display = 'none';
      iziToast.show({
        ...iziOption,
        message: 'An error occurred while loading images',
      });
    }
  });

document.querySelector('.load-more').addEventListener('click', async () => {
  const box = document.querySelector('.gallery');
  const loadMoreBtn = document.querySelector('.load-more');

  loadMoreBtn.textContent = 'Loading...';
  loadMoreBtn.disabled = true;

  page += 1;

  try {
    const response = await getImage(query, page);
    const { markup: newMarkup } = response;

    if (newMarkup) {
      box.insertAdjacentHTML('beforeend', newMarkup);
      if (lightbox) {
        lightbox.refresh();
      } else {
        lightbox = new SimpleLightbox('.gallery a', {
          captionsData: 'alt',
          captionDelay: 250,
        });
      }
      smoothScroll();

      if (page * perPage >= totalHits) {
        loadMoreBtn.style.display = 'none';
        iziToast.show({
          ...iziOption,
          message: "We're sorry, but you've reached the end of search results.",
        });
      }
    } else {
      loadMoreBtn.style.display = 'none';
    }
  } catch (error) {
    console.error('Error loading more images:', error);
    iziToast.show({
      ...iziOption,
      message: 'An error occurred while loading more images',
    });
  } finally {
    loadMoreBtn.textContent = 'Load more';
    loadMoreBtn.disabled = false;
  }
});
