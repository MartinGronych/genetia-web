// ====================
// GENETIA – Kontakt
// Autor: Martin Gronych
// =====================

const PAGE = "contact";
import { initContactMap } from "./google-map.js";
import { initContactRouting } from "./kontakt_form.js"


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
  
  safeInit("google-map", () => initContactMap());
  safeInit("kontakt_form", () => initContactRouting ());
  console.info(`[GENETIA][${PAGE}] ready`);
});
