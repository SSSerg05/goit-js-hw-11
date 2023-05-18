// import
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';

const axios = require("axios/dist/axios.min.js"); // node

//want, but no used
//https://infinite-scroll.com/extras.html#module-loaders

// values
const PER_PAGE = 40;
let nextPage = 1;
let valueForm = '';


// elements in html
const refs = {
  form: document.querySelector(".search-form"),
  out: document.querySelector(".gallery"),
  count: document.querySelector(".count"),
  btnNext: document.querySelector(".load-more"),
}

// events
refs.form.addEventListener("submit", onFormSubmit);
refs.form.addEventListener("input", onFormInput);
refs.btnNext.addEventListener("click", onViewNext);

// add class for not visible button
refs.btnNext.classList.add("no-display")

// add slider with modal window
const lightbox = new SimpleLightbox(".gallery a", { /* options */ });
lightbox.on('show.simplelightbox', function () {
  // Do something…
  lightbox.captionDelay = 250;
});


// if change input - dont show button
//
function onFormInput(event) { 
  refs.btnNext.classList.add("no-display");

  if (valueForm !== event.target.value.trim()) {
    nextPage = 1;
  }

  valueForm = event.target.value.trim();
}


// username u_ht1qf13txz
// user_id:36214966 
// key 36214966-0d101d8d6f502ad642532aad3
//
// show gallery
function onFormSubmit(event) { 
  event.preventDefault();

  if (valueForm === '') {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    return
  }

  if (nextPage > 1) {
    return
  } 
  
  // refs.searchQuery.disable = true;
  fetchGallery();
 
}

// View Next card gallery
//
function onViewNext() { 
 
  fetchGallery();
}

// use axios: get data and prepere gallery
//
function fetchGallery() {
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
      per_page: PER_PAGE,
    }
  })
  .then(function (response) {
    // if not find search 
    if (response.data.hits.length === 0)  {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      return
    }
    
    refs.btnNext.classList.remove("no-display")

    let str = '';
    response.data.hits.forEach(item => {
      str += mask(item);
    })

    refs.out.innerHTML = str;
    lightbox.refresh();

    nextPage++;
    
    refs.count.innerHTML = viewCountImages(response.data);
    Notiflix.Notify.success("Hooray! We found totalHits images.")    


    if ((nextPage-1) * PER_PAGE > response.data.totalHits) { 
      Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
      refs.btnNext.classList.add("no-display")
    }

    // не зрозумів...
    // const { height: cardHeight } = refs.out.firstElementChild.getBoundingClientRect();

    // window.scrollBy({
    //   top: cardHeight * 2,
    //   behavior: "smooth",
    // });

  })
  .catch(function (error) {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    console.log(error);
  });
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
