// ==================================================
// GENETIA – MAIN SCRIPT (Final Fixed Lucide)
// ==================================================

import { initNavigation } from "./nav.js";
import { initCardHover } from "./cardHover.js";
import "./components/carousel.js";
import "./components/carousel-lock.js";

// 🟢 Po načtení DOM
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initCardHover();

  
});
