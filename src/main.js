import { getImage } from './js/pixabay-api.js';
import errorIcon from './img/error.svg';
import closeIcon from './img/close.svg';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

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
    const data = await getImage(query, page);
    box.innerHTML = data;
    loadMoreBtn.style.display = 'block';
  });

document.querySelector('.load-more').addEventListener('click', async () => {
  const box = document.querySelector('.gallery');
  page += 1;
  const data = await getImage(query, page);
  box.insertAdjacentHTML('beforeend', data);
  smoothScroll();
});
