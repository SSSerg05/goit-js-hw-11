// import
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';

import Gallery from './Gallery.js';
import LoadMoreBtn from './LoadMoreBtn.js';

// const axios = require("axios/dist/axios.min.js"); // node

//want, but no used
//https://infinite-scroll.com/extras.html#module-loaders

// values
// const PER_PAGE = 40;
// let nextPage = 1;
// let valueForm = '';
// let outGallery = '';

// elements in html
const refs = {
  form: document.querySelector(".search-form"),
  out: document.querySelector(".gallery"),
  count: document.querySelector(".count"),
//  btnNext: document.querySelector(".load-more"),
}

const newGallery = new Gallery();
const loadMoreBtn = new LoadMoreBtn({
  selector: ".load-more",
  isHidden: true,
});

// events
refs.form.addEventListener("submit", onFormSubmit);
refs.form.addEventListener("input", onFormInput);
//refs.btnNext.addEventListener("click", onViewNext);

loadMoreBtn.button.addEventListener('click', onViewNext); //fetchArticles)

// add class for not visible button
//refs.btnNext.classList.add("no-display")

// add slider with modal window
const lightbox = new SimpleLightbox(".gallery a", { /* options */ });
lightbox.on('show.simplelightbox', function () {
  // Do something…
  lightbox.captionDelay = 250;
});


// if change input - dont show button
//
function onFormInput(event) { 
  const value = refs.form.elements.searchQuery.value.trim();

  if (value === "") {
    Notiflix.Notify.failure("Input Sorry, there are no images matching your search query. Please try again.");
  } else {
    newGallery.searchQuery = value;
    newGallery.resetPage();
    loadMoreBtn.hide();
    refs.out.innerHTML = '';
  }
}


// username u_ht1qf13txz
// user_id:36214966 
// key 36214966-0d101d8d6f502ad642532aad3
//
// show gallery
function onFormSubmit(event) { 
  const value = newGallery.searchQuery;
  
  event.preventDefault();

   if (value === '') {
    Notiflix.Notify.failure("Submit Sorry, there are no images matching your search query. Please try again.");
    return
  }

  getNewPictures();
 
}


function getNewPictures() {
  return newGallery
    .getPictures()
    .then((data) => {
      if (!data) {
          loadMoreBtn.hide();
          return "";
      }

      if (data.length === 0) {
        throw new Error("No data");
        return;
      }

      return data.reduce(
        (acc, data) => createGallery(data) + acc, ""); //createAcc(data));
    })
    .then(updateGallery)
    .catch(onError)
}

// block for one image-card
function createGallery( {
    webformatURL : smallImg,
    largeImageURL: fullImg,
    tags: alt,
    likes,
    views,
    comments,
    downloads }) {
  
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


function updateGallery(data) {
  refs.out.innerHTML += data
}


function onError(error) { 
  console.log(error);
}


// View Next card gallery
//
function onViewNext() { 
 
  getNewPictures();

}




// block for one image-card
//
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

// count images
//
function viewCountImages(obj) { 
  return `
  <div class="counts">
    <p>Add pages #${nextPage-1}. Images: 1 - ${(nextPage - 1) * PER_PAGE} / Total: ${obj.totalHits }
  </div>`
}
