// ====================
// GENETIA – Certifikace
// Autor: Martin Gronych
// =====================

import { initCertifikacePopovers } from "./certifikace_popovers.js";

const PAGE = "certifications";

// izolovaná inicializace (async-safe + jednotné logy)
const safeInit = async (component, fn) => {
  try {
    await fn();
    console.info(`[GENETIA][${PAGE}][${component}] initialized`);
  } catch (err) {
    console.error(`[GENETIA][${PAGE}][${component}] init failed`, err);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  // Popovers + JSON data
  await safeInit("certifikace_popovers", initCertifikacePopovers);

  console.info(`[GENETIA][${PAGE}] ready`);
});