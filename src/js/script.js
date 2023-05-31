// import
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';

import Gallery from './Gallery.js';
import Buttons from './Buttons.js';
import simpleLightbox from "simplelightbox";

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
}

const newGallery = new Gallery();
const loadMoreBtn = new Buttons({
  selector: ".btn-load-more",
  name: "Load More",
  nameDisable: "Loading...",
  isHidden: true,
});

const searchBtn = new Buttons({
  selector: ".btn-search",
  name: "Search",
  nameDisable: "Search",
  isHidden: false,
})

// events
refs.form.addEventListener("submit", onFormSubmit);
refs.form.addEventListener("input", onFormInput);

loadMoreBtn.button.addEventListener('click', onViewNext);

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
    throw new Error("No value in input");
    return
  }

  searchBtn.enable();
  loadMoreBtn.hide();

  newGallery.searchQuery = value;

  clearGallery()
}


// user_id:36214966 
// key 36214966-0d101d8d6f502ad642532aad3
// username u_ht1qf13txz
//
// show gallery
function onFormSubmit(event) { 
  const value = newGallery.searchQuery;
  
  searchBtn.disable();

  event.preventDefault();

  if (value === '') {
    throw new Error("No value in input");
    return
  }

  if (newGallery.page >= 1) {
    loadMoreBtn.show();
  }

  onViewNext()
}

// getCardPictures
//
async function getNewPictures() {
  try {
    const cards = await newGallery.getPictures();
    const { total, perPage, page } = newGallery;

    if (!cards) {
      loadMoreBtn.disable();
      loadMoreBtn.hide();
      return "";
    }

    if (cards.length === 0) {
      throw new Error("No data");
      return;
    }

    if (page - 1 === 1) {
      Notiflix.Notify.success(`Hooray! We found ${total} images.`);
    }

    if (total < perPage || total < (page - 1) * perPage) {
      loadMoreBtn.hide();
      loadMoreBtn.disable();
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }

    return cards.reduce(
         (acc, data) => acc + createGallery(data), "");

  } catch (error) {
    loadMoreBtn.hide();
    loadMoreBtn.disable();
    onError(error);
  }

}

// block for one image-card
//
function createGallery(data) {

  if (!data) { 
    return
  }

  const {
    webformatURL: smallImg,
    largeImageURL: fullImg,
    tags: alt,
    likes,
    views,
    comments,
    downloads } = data;
  
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

// update out
//
function updateGallery(data) {
  if (!data) { 
    return
  }
    
  refs.out.insertAdjacentHTML("beforeend", data);
  lightbox.refresh();
}

// update out count page
//
function updateTotal() {

  if (newGallery.total === 0) {
    refs.count.innerHTML = "";
  } else {
    refs.count.innerHTML = viewCountImages();
  }
}

// clear out
//
function clearGallery() { 

  newGallery.resetPage();

  refs.out.innerHTML = "";
  refs.count.innerHTML = "";
}


function onError(error) { 

  loadMoreBtn.disable();
  loadMoreBtn.hide();
  Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
  console.log(error);
}


// View Next card gallery
//
async function onViewNext() { 

  loadMoreBtn.disable();
  
  try {
    const markup = await getNewPictures();
      
    loadMoreBtn.enable()
    updateGallery(markup);
    updateTotal();

    return markup;
  } catch (error) {
    onError(error);  
  }
}

// Show count images
//
function viewCountImages() { 
  const countImages = (newGallery.page - 1) * newGallery.perPage;
  const totalImages = countImages > newGallery.total ? newGallery.total : countImages;

  return `
  <div class="counts">
    <p>Add pages #${newGallery.page - 1}. Images: 1 - ${totalImages} / Total: ${ newGallery.total }
  </div>`
}
