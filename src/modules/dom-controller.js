import { renderHome } from "../pages/home";

export class DomController {
  constructor() {
    this.loadHomePage();
  }

  loadHomePage() {
    this.clearBody();
    let body = document.querySelector('body');
    let home = renderHome();

    body.appendChild(home);
  }

  clearBody() {
    let body = document.querySelector('body');
    body.innerHTML = '';
  }

}