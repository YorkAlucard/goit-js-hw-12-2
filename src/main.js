import { getImage } from './js/pixabay-api.js';
// import { markup } from './js/render-functions.js';
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

document.querySelector('.search-form').addEventListener('submit', event => {
  const input = document.querySelector('.search-input').value.trim();
  const box = document.querySelector('.gallery');
  event.preventDefault();

  if (!input) {
    iziToast.show({
      ...iziOption,
      message: 'Please enter the search query',
    });
    return;
  }
  box.innerHTML =
    '<p>Wait, the image is loaded</p><span class="loader"></span>';
  getImage(input);
});
