// ====================
// GENETIA – Vyvoj a Výzkum
// Autor: Martin Gronych
// =====================

import { initNav } from "../../components/nav.js";
import { initVyvojBriefToggle } from "../vyvoj-vyzkum/vyvoj_metodika.js";

const PAGE = "research";

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
  await safeInit("nav", () => initNav());

  // Brief toggle není async, ale safeInit ho zvládne
  await safeInit("brief_toggle", () => initVyvojBriefToggle());

  console.info(`[GENETIA][${PAGE}] ready`);
});
