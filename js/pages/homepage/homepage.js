// ==================================================
// GENETIA – Homepage (Final Clean v3.4)
// --------------------------------------------------
// ▸ Bez pádu celé stránky při chybě jedné komponenty (safeInit)
// ==================================================

import { initCarousel } from "../../components/carousel.js";
import { initCarouselLock } from "../../components/carousel-lock.js";
import { initCardHover } from "../../components/cardHover.js";
import { initUspProduction } from "./usp-production.js";

document.addEventListener("DOMContentLoaded", async () => {
  const PAGE = "homepage";

  // izolovaná inicializace (async-safe + jednotné logy)
  const safeInit = async (component, fn) => {
    try {
      await fn();
      console.info(`[GENETIA][${PAGE}][${component}] initialized`);
    } catch (err) {
      console.error(`[GENETIA][${PAGE}][${component}] init failed`, err);
    }
  };

  // 1) Kontakt – dynamické načtení modulu (safe)
  try {
    const formModule = await import("../../components/form-success.js");

    if (typeof formModule.initContactForm === "function") {
      formModule.initContactForm();
      console.info(`[GENETIA][${PAGE}][form] initialized`);
    } else {
      console.warn(
        `[GENETIA][${PAGE}][form] initContactForm not found in form-success.js`
      );
    }
  } catch (err) {
    console.warn(
      `[GENETIA][${PAGE}][form] failed to load form-success.js`,
      err
    );
  }

  // 2) Ostatní komponenty – safe init po jedné

  safeInit("carousel", initCarousel);
  safeInit("carousel-lock", initCarouselLock);
  safeInit("card-hover", initCardHover);
  safeInit("usp-production", initUspProduction);

  console.info(`[GENETIA][${PAGE}] ready`);
});
