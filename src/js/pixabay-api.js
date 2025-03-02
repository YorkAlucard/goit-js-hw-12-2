import axios from 'axios';
import { markup } from './render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { iziOption } from '../main.js';

export async function getImage(query, page) {
  const box = document.querySelector('.gallery');
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
      // box.innerHTML = '';
      return '';
    }
    if (data.hits.length === 0) {
      document.querySelector('.load-more').style.display = 'none';
      iziToast.show({
        ...iziOption,
        message: "We're sorry, but you've reached the end of search results.",
      });
      return '';
    }

    return markup(data);
  } catch (error) {
    console.error(error);
    // box.innerHTML = '';
    iziToast.show({
      ...iziOption,
      message: 'Sorry, an error happened. Try again later',
    });
    return '';
  }
}
