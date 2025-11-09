// ==================================================
// GENETIA – Produkty (Page Entry)
// Autor: Martin Gronych
// ==================================================

import { initNavigation } from "../../components/nav.js";
import { initModal } from "../../components/modal.js";
import { initCardHover } from "../../components/cardHover.js";
import { initProducts } from "./products.js";

document.addEventListener("DOMContentLoaded", async () => {
  await initNavigation();
  initModal();
  await initProducts();
  initCardHover();
  console.log("✅ Produkty – logika načtena");
});
