// ==================================================
// GENETIA – MAIN SCRIPT (Final Fixed Lucide)
// ==================================================

import { initNavigation } from "./components/nav.js";
import { initCardHover } from "./components/cardHover.js";
import { initModal } from "./components/modal.js";

// 🟢 Po načtení DOM
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initCardHover();
  initModal();  
});
