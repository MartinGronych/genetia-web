// =====================================
// GENETIA – O společnosti (page entry)
// Autor: Martin Gronych
// =====================================
import { renderAboutCompany } from "../o-spolecnosti/o-spolecnosti.render.js"; 
import { initCarousel } from "../../components/carousel.js";
import { initCarouselLock } from "../../components/carousel-lock.js";
import { initUspProduction } from "../homepage/usp-production.js"

document.addEventListener("DOMContentLoaded", () => {
  
  renderAboutCompany("#aboutCompanyMount");

  initCarousel();
  initCarouselLock();
  initUspProduction();
});
