// ======================
// GENETIA – MAIN SCRIPT
// ======================

import { initNav } from "./components/nav.js";
import { initModal } from "./components/modal.js";

const PAGE = "main";

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

  // Ostatní mohou běžet paralelně
  safeInit("modal", () => initModal());

  console.info(`[GENETIA][${PAGE}] ready`);
});

