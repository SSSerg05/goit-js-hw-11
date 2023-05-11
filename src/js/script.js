import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const axios = require("axios/dist/axios.min.js"); // node
//const axios = require('axios');

const lightbox = new SimpleLightbox('.gallery a', { /* options */ });


const form = document.querySelector(".search-form");
const input = form.firstElementChild
form.addEventListener("submit", onSubmit);



// username u_ht1qf13txz
// user_id:36214966 
// key 36214966-0d101d8d6f502ad642532aad3
function onSubmit(event) { 

  // Optionally the request above could also be done as
  axios.get('/user', {
    params: {
      ID: 36214966,
      key: '36214966-0d101d8d6f502ad642532aad3',
      q: event.currentTarget.value
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // always executed
  });  
}


// block for one image-card
function mask(obj) { 
  return `<div class="photo-card">
  <img src="${obj.src}" alt="{${obj.alt}}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
    </p>
    <p class="info-item">
      <b>Views</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
    </p>
  </div>
</div>`
}
