// ==================================================
// GENETIA – Homepage (Final Clean v3.2)
// --------------------------------------------------
// ▸ Jednotné dynamické načítání form-success.js
// ▸ Bez duplicitního importu
// ▸ Vše se spouští po načtení DOMu
// ==================================================

import { initNavigation } from "../../components/nav.js";
import { initModal } from "../../components/modal.js";
import { initCarousel } from "../../components/carousel.js";
import { initCarouselLock } from "../../components/carousel-lock.js";
import { initCardHover } from "../../components/cardHover.js";

// === Inicializace po načtení DOM ===
document.addEventListener("DOMContentLoaded", async () => {
  console.log("📁 homepage.js běží");

  // === 1️⃣ Kontakt – dynamické načtení modulu ===
  try {
    const formModule = await import("../../components/form-success.js");
    console.log("📦 Dynamický import:", typeof formModule.initContactForm);

    if (typeof formModule.initContactForm === "function") {
      formModule.initContactForm();
      console.log("🧩 Kontakt formulář inicializován ✅");
    } else {
      console.warn("⚠️ Funkce initContactForm nenalezena v modulu.");
    }
  } catch (e) {
    console.error("❌ Chyba při načítání form-success.js:", e);
  }

  // === 2️⃣ Ostatní komponenty ===
  try {
    initNavigation();
    initModal();
    initCarousel();
    initCardHover();
    initCarouselLock();
    console.log("✅ Homepage – logika načtena");
  } catch (e) {
    console.error("❌ Chyba při inicializaci komponent:", e);
  }
});
