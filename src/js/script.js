// import
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';

import Gallery from './Gallery.js';
import Buttons from './Buttons.js';

//want, but no used
//https://infinite-scroll.com/extras.html#module-loaders

// values
// const PER_PAGE = 40;
// let nextPage = 1;
// let valueForm = '';
// let outGallery = '';
let errStr = "Sorry, there are no images matching your search query. Please try again."


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
  nameEvent: "Loading...",
  isHidden: true,
});

const searchBtn = new Buttons({
  selector: ".btn-search",
  name: "Search",
  nameEvent: "Search",
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

  searchBtn.enable();

  if (value === "") {
    Notiflix.Notify.failure(errStr);
  } else {
    loadMoreBtn.hide();
    newGallery.searchQuery = value;
    newGallery.resetPage();
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
  
  searchBtn.disable();

  event.preventDefault();

  if (value === '') {
    Notiflix.Notify.failure(errStr);
    return
  }

  if (newGallery.page >= 1) {
    loadMoreBtn.show();
  }

  return getNewPictures().then(() => loadMoreBtn.enable());
 
}


async function getNewPictures() {
  
  //const card = await newGallery.getPictures()
  
  return newGallery
    .getPictures()
    .then((data) => {
      console.log(data);
      if (!data) {
          loadMoreBtn.hide();
          return "";
      }

      if (data.length === 0) {
        throw new Error("No data");
        return;
      }

      return data.reduce(
        (acc, data) => acc + createGallery(data), ""); //createAcc(data));
    })
    .then(updateGallery)
    .catch(onError)
}

// block for one image-card
//
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
  loadMoreBtn.enable();
  Notiflix.Notify.failure(errStr);
  console.log(error);
}


// View Next card gallery
//
function onViewNext() { 

  loadMoreBtn.disable();
  return getNewPictures().then(() => loadMoreBtn.enable());

}


// count images
//
function viewCountImages(obj) { 
  return `
  <div class="counts">
    <p>Add pages #${nextPage-1}. Images: 1 - ${(nextPage - 1) * PER_PAGE} / Total: ${obj.totalHits }
  </div>`
}
