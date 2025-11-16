// ==================================================
// GENETIA – Produkty (Page Entry v2 + Gate)
// Autor: Martin Gronych
// ==================================================

import { initNavigation } from "../../components/nav.js";
import { initModal } from "../../components/modal.js";
import { initCardHover } from "../../components/cardHover.js";
import { initProductsGate } from "./gate.js";

document.addEventListener("DOMContentLoaded", async () => {

  // Navigace
  await initNavigation();

  // Lucide ikony (pro statické ikony – např. veřejnost sekce)
  if (window.lucide) {
    lucide.createIcons();
  }

  // Global UI skripty
  initModal();
  initCardHover();

  // 🔒 Odborný gate
  initProductsGate();

  console.log("✅ Produkty – entry načten (gate + nav + modal)");
});
