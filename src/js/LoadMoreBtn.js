export default class LoadMoreBtn {
  static classes = {
    hidden: "hidden",
  }

  constructor({ selector, isHidden = false }) {
    this.button = this.getButton(selector)

    isHidden && this.hide();
    // isHidden = true && this.hide() -> true && true -> this.hide()
    // isHidden = true && this.hide() -> false && true -> false
  }

  getButton(selector) {
    return document.querySelector(selector)
  }

  hide() {
    this.button.classList.add(LoadMoreBtn.classes.hidden);

  }

  show() {
    this.button.classList.remove(LoadMoreBtn.classes.hidden);
  }

  disable() {
    this.button.disable = true;
    this.button.textContent = "Loading...";
  }

  enable() {
    this.button.disable = false;
    this.button.textContent = "Load More LMB";
  }



}