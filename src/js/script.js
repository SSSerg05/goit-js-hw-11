import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const axios = require("axios/dist/axios.min.js"); // node
//const axios = require('axios');

const lightbox = new SimpleLightbox('.gallery a', { /* options */ });


const form = document.querySelector(".search-form");
form.addEventListener("submit", onSubmit);



// username u_ht1qf13txz
// user_id:36214966 
function onSubmit(event) { 

  // Optionally the request above could also be done as
  axios.get('/user', {
    params: {
      ID: 36214966
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
