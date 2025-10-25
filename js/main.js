// ==================================================
// GENETIA – MAIN SCRIPT
// --------------------------------------------------
// 1) Dynamické načtení navigace z JSON
// 2) CardHover efekt 
// 3) Carousel v homepage/product
// ==================================================

import { initNavigation } from "./nav.js";
import { initCardHover }  from "./cardHover.js";
import { initProductsCarousel } from "./productsCarousel.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavigation(); // 🚀 Spustí generování navigace z JSON
  initCardHover(); // aktivuje světelný hover na USP boxech
  initProductsCarousel(); // aktivuje carousel na produktech
});