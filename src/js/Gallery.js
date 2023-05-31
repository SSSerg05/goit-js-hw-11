const axios = require("axios/dist/axios.min.js"); // node
import Notiflix from 'notiflix';

const URL = 'https://pixabay.com/api/';
const API_KEY = '36214966-0d101d8d6f502ad642532aad3';

export default class Gallery {
  constructor (perPage = 40) {
    this.page = 1;
    this.searchQuery = '';
    this.perPage = perPage;
    this.total = 0;
  }

  async getPictures() {
    
    const params = {
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: this.perPage,
    }

    const { data } = await axios.get(URL, { params })
    this.incrementPage();
    this.total = data.totalHits;

    return data.hits;
  }

  incrementPage() {
    this.page++;
  }

  resetPage() { 
    this.page = 1;
    this.total = 0;
  }

}