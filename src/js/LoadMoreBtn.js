export default class LoadMoreBtn {
  static classes = {
    hidden: "hidden",
  }

  constructor({ selector, name, nameEvent, isHidden = false }) {
    this.button = this.getButton(selector)
    this.name = name;
    this.nameEvent = nameEvent;

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
    this.button.disabled = true;
    this.button.textContent = this.nameEvent;
  }

  enable() {
    this.button.disabled = false;
    this.button.textContent = this.name;
  }



}