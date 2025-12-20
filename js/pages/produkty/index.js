// ==================================================
// GENETIA – Produkty (Page Entry v2 + Gate)
// Autor: Martin Gronych
// ==================================================

import { initModal } from "../../components/modal.js";
import { initProductsGate } from "./gate.js";


document.addEventListener("DOMContentLoaded", async () => {
  

  // Lucide ikony (pro statické ikony – např. veřejnost sekce)
  if (window.lucide) {
    lucide.createIcons();
  }

  // Global UI skripty
  initModal();
  

  // 🔒 Odborný gate
  initProductsGate();
  const params = new URLSearchParams(window.location.search);
  const deepProductId = params.get("product");

  if (deepProductId) {
    // uložíme si požadovaný produkt, otevře se až po gate
    sessionStorage.setItem("genetia_deeplink_product", deepProductId);
  }

  console.log("✅ Produkty – entry načten (gate + nav + modal)");
});
