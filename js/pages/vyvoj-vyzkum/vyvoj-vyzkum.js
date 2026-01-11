// ====================
// GENETIA – Vyvoj a Výzkum
// Autor: Martin Gronych
// =====================

import { initNav } from "../../components/nav.js";

const PAGE = "research";

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
  // Nav je základ (async render z nav.json) → počkat
  await safeInit("nav", initNav);

  console.info(`[GENETIA][${PAGE}] ready`);
});
