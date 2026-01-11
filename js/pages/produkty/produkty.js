// ====================
// GENETIA – Produkty
// Autor: Martin Gronych
// ======================


import { initModal } from "../../components/modal.js";
import { initProductsGate } from "./gate.js";


const PAGE = "products";

// izolovaná inicializace (async-safe + jednotné logy)
const safeInit = async (component, fn) => {
  try {
    await fn();
    console.info(`[GENETIA][${PAGE}][${component}] initialized`);
  } catch (err) {
    console.error(
      `[GENETIA][${PAGE}][${component}] init failed`,
      err
    );
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  // Lucide ikony (jen pokud jsou k dispozici)
  if (window.lucide) {
    lucide.createIcons();
    console.info(`[GENETIA][${PAGE}][lucide] icons rendered`);
  }

  // ✅ Deep-link uložit před gate
  const params = new URLSearchParams(window.location.search);
  const deepProductId = params.get("product");

  if (deepProductId) {
    sessionStorage.setItem("genetia_deeplink_product", deepProductId);
    console.info(
      `[GENETIA][${PAGE}][deeplink] stored product=${deepProductId}`
    );
  }

  // Modal může být navázaný na prvky v nav → až po nav
  safeInit("modal", () => initModal());

  // Gate
  safeInit("products-gate", () => initProductsGate());


  console.info(`[GENETIA][${PAGE}] ready`);
});

