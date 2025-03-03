import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { iziOption } from '../main.js';

export async function getImage(query, page) {
  const API_KEY = '48872034-56219959c0c25d0366fcef29b';
  const urlParams = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page: 40,
  });

  const URL = `https://pixabay.com/api/?${urlParams}`;

  try {
    const response = await axios.get(URL);
    const data = response.data;

    if (data.hits.length === 0 && page === 1) {
      iziToast.show({
        ...iziOption,
        message:
          'Sorry, there are no images matching your search query. Please, try again.',
      });
      return { markup: '', totalHits: 0 };
    }

    if (data.hits.length === 0) {
      document.querySelector('.load-more').style.display = 'none';
      iziToast.show({
        ...iziOption,
        message: "We're sorry, but you've reached the end of search results.",
      });
      return { markup: '', totalHits: 0 };
    }

    return {
      markup: generateMarkup(data),
      totalHits: data.totalHits,
    };
  } catch (error) {
    console.error(error);
    iziToast.show({
      ...iziOption,
      message: 'Sorry, an error happened. Try again later',
    });
    return { markup: '', totalHits: 0 };
  }
}

function generateMarkup(data) {
  const { hits } = data;

  if (hits.length === 0) {
    return '';
  }

  const markup = hits
    .map(
      image => `
        <li class='gallery__item'>
          <a class='gallery__link' href="${image.largeImageURL}">
            <img class='gallery__img' src="${image.webformatURL}" alt="${image.tags}" />
            <div class="grid">
              <p>Likes</p>
              <p>Views</p>
              <p>Comment</p>
              <p>Downloads</p>
              <span>${image.likes}</span>
              <span>${image.views}</span>
              <span>${image.comments}</span>
              <span>${image.downloads}</span>
            </div>
          </a>
        </li>
      `
    )
    .join('');

  return markup;
}
