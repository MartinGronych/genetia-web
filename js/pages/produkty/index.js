// ====================
// GENETIA – Produkty 
// Autor: Martin Gronych
// ======================

import { initModal } from "../../components/modal.js";
import { initProductsGate } from "./gate.js";
import { initCardHover } from "./components/cardHover.js";

document.addEventListener("DOMContentLoaded", () => {
  // Lucide ikony (pro statické ikony – např. veřejnost sekce)
  if (window.lucide) {
    lucide.createIcons();
  }

  // Global UI skripty
  initModal();

  // ✅ Deep-link z URL musí být uložen ještě před initProductsGate()
  const params = new URLSearchParams(window.location.search);
  const deepProductId = params.get("product");

  if (deepProductId) {
    sessionStorage.setItem("genetia_deeplink_product", deepProductId);
  }

  // 🔒 Odborný gate
  initProductsGate();

  console.log("✅ Produkty – entry načten (gate + nav + modal)");
  initCardHover();
});
