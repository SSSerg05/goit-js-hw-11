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

    return await axios
      .get(URL, { params } )
      .then(function (response) {
        // this.incrementPage();

        // if not find search 
        // if (response.data.hits.length === 0)  {
        //   Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        //   return
        // }

        return response.data.hits;
      })
      .catch(
        function (error) {
          Notiflix.Notify.failure("GalleryCatch Sorry, there are no images matching your search query. Please try again.");
          console.log(error);
      })
  }

  incrementPage() {
    this.page++;
  }

  resetPage() { 
    this.page = 1;
  }

}