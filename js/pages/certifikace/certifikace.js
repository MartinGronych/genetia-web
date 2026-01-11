// ====================
// GENETIA – Certifikace
// Autor: Martin Gronych
// =====================



const PAGE = "certifications";

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

  console.info(`[GENETIA][${PAGE}] ready`);
});
