// ==================================================
// GENETIA – MAIN SCRIPT
// --------------------------------------------------
// 1) Dynamické načtení navigace z JSON
// 2) CardHover efekt 
// 3) Carousel v homepage/product
// ==================================================

import { initNavigation } from "./nav.js";
import { initCardHover }  from "./cardHover.js";
import "./components/carousel.js"; // ✅ načte se automaticky (GSAP se spustí samo)

document.addEventListener("DOMContentLoaded", () => {
  initNavigation(); // 🚀 Spustí generování navigace z JSON
  initCardHover(); // aktivuje světelný hover na USP boxech
});
