import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const axios = require("axios/dist/axios.min.js"); // node
//const axios = require('axios');

const refs = {
  form: document.querySelector(".search-form"),
  out: document.querySelector(".gallery"),
  btnNext: document.querySelector(".load-more"),
}

refs.form.addEventListener("submit", onFormSubmit);
refs.form.addEventListener("input", onFormInput);
refs.btnNext.addEventListener("click", onViewNext);

refs.btnNext.classList.add("no-display")
let nextPage = 1;
let valueForm = '';

const lightbox = new SimpleLightbox(".gallery a", { /* options */ });
lightbox.on('show.simplelightbox', function () {
  // Do something…
  lightbox.captionDelay = 250;
});

function onFormInput() { 
  refs.btnNext.classList.add("no-display")
}


// username u_ht1qf13txz
// user_id:36214966 
// key 36214966-0d101d8d6f502ad642532aad3
function onFormSubmit(event) { 
  event.preventDefault();

  const currentValue = refs.form.elements.searchQuery.value.trim()
  if (valueForm !== currentValue && valueForm !== '') { 
    nextPage = 1
    refs.btnNext.classList.add("no-display")
  }
    
  // Optionally the request above could also be done as
  //https://pixabay.com/api/
  axios.get('https://pixabay.com/api/', {
    params: {
      key: '36214966-0d101d8d6f502ad642532aad3',
      q: valueForm,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: nextPage,
      per_page: 40,
    }
  })
  .then(function (response) {
    refs.btnNext.classList.remove("no-display")

    let str = '';
    response.data.hits.forEach(item => {
      str += mask(item);
    });

    refs.out.innerHTML = str;
    lightbox.refresh();

    nextPage++;
    valueForm = refs.form.elements.searchQuery.value.trim();
  })
  .catch(function (error) {
    console.log(error);
  });
 
}

// block for one image-card
function mask(obj) { 
  
  const {
    webformatURL : smallImg,
    largeImageURL: fullImg,
    tags: alt,
    likes,
    views,
    comments,
    downloads } = obj;
  
  return `
  <a href="${fullImg}">
    <div class="photo-card">
      <img class="image"
        src="${smallImg}" 
        alt="{${alt}}" 
        loading="lazy"
        title="{${alt}}"/>

      <div class="info">
        <p class="info-item">
         <b>Likes: </b>${likes}
        </p>
        <p class="info-item">
          <b>Views: </b>${views}
        </p>
        <p class="info-item">
          <b>Comments: </b>${comments}
        </p>
        <p class="info-item">
          <b>Downloads: </b>${downloads}
        </p>
      </div>
    </div>
  </a>`
}

function onViewNext() { 
 
  axios.get('https://pixabay.com/api/', {
    params: {
      key: '36214966-0d101d8d6f502ad642532aad3',
      q: refs.form.elements.searchQuery.value.trim(),
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: nextPage,
      per_page: 40,
    }
  })
  .then(function (response) {
    nextPage++;

    let str = '';
    response.data.hits.forEach(item => {
      str += mask(item);
    });

    refs.out.innerHTML = str;
    lightbox.refresh();
  })
  .catch(function (error) {
    console.log(error);
  });
 
}
