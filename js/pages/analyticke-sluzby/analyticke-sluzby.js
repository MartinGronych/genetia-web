// ==================================================
// GENETIA – Analytické služby (Page Entry)
// --------------------------------------------------
// ▸ Bez pádu celé stránky při chybě jedné komponenty (safeInit)
// ▸ Sjednocené konzolové logy
// ==================================================

import { initFaqFade } from "./faq-fade.js";
import { initPanelDetailModal } from "./panelDetailModal.js";
import { initUspBar } from "./usp-render.js";
import { initUspReveal } from "./usp-reveal.js";
import { initPanelsGrid } from "./panels-render.js";
import { initCardHover } from "../../components/cardHover.js";
import { initBenefitsRender } from "./benefits-render.js";
import { initCtaEmailToggle } from "./cta-email.js";

const PAGE = "analytics";

const safeInit = async (component, fn) => {
  try {
    const result = await fn(); // ✅ uložíme návratovou hodnotu / Promise
    console.info(`[GENETIA][${PAGE}][${component}] initialized`);
    return result; // ✅ teď je co vracet
  } catch (err) {
    console.error(`[GENETIA][${PAGE}][${component}] init failed`, err);
    throw err; // ✅ zachováme možnost await skutečně failnout
  }
};


document.addEventListener("DOMContentLoaded", async () => {
  // Ostatní může běžet paralelně
  safeInit("faq-fade", () => initFaqFade());
  safeInit("panels-grid", () => initPanelsGrid());
  safeInit("panel-detail-modal", () => initPanelDetailModal());

  // USP sekce (zachovat pořadí!)
  await safeInit("usp-bar", () => initUspBar());
  safeInit("usp-reveal", () => initUspReveal());

  // Benefits  sekce
  safeInit("BenefitsRender", () => initBenefitsRender());
  safeInit("cardHover", () => initCardHover());

  safeInit("CtaEmail", () => initCtaEmailToggle());
  
  console.info(`[GENETIA][${PAGE}] ready`);
});
