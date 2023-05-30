const axios = require("axios/dist/axios.min.js"); // node
import Notiflix from 'notiflix';

const URL = 'https://pixabay.com/api/';
const API_KEY = '36214966-0d101d8d6f502ad642532aad3';
const PER_PAGE = 40;

export default class Gallery {
  constructor () {
    this.page = 1;
    this.searchQuery = '';
  }

  async getPictures() {
    
    const params = {
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: PER_PAGE,
    }

    const { data } = await axios.get(URL, { params } )
    this.incrementPage();

    return data.hits;
  }

  incrementPage() {
    this.page++;
  }

  resetPage() { 
    this.page = 1;
  }

}