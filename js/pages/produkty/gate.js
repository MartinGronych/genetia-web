// ==================================================
// GENETIA – Produkty Expert Gate (STABLE + DEEPLINK SAFE)
// Autor: Martin Gronych
// --------------------------------------------------
// ▸ Zamyká panel "Pro lékaře a lékárny"
// ▸ Gate funguje při kliknutí i automaticky při deeplinku
// ▸ Deeplink otevře detail produktu, běžný vstup jen zobrazí produkty
// ==================================================

import { initProducts } from "./products.js";

export function initProductsGate() {
  const gateModal = document.getElementById("gateModal");
  const hcpTab = document.getElementById("pro-odborniky-tab");
  const publicTab = document.getElementById("pro-verejnost-tab");
  const hcpPane = document.getElementById("pro-odborniky");

  if (!gateModal || !hcpTab || !publicTab || !hcpPane) {
    console.warn("⚠️ Gate: chybí některý z povinných prvků");
    return;
  }

  // 🔒 výchozí stav – odborný panel je zamčený
  hcpPane.classList.add("hcp-locked");

  // ✅ vezmeme deeplink i přímo z URL (nezávisle na index.js)
  const params = new URLSearchParams(window.location.search);
  const deepFromUrl = params.get("product");
  if (deepFromUrl) {
    sessionStorage.setItem("genetia_deeplink_product", deepFromUrl);
  }

  /**
   * SPOLEČNÝ KONEC FLOW
   * - vždy zobrazí odborný panel
   * - vždy načte produkty
   * - detail otevře jen pokud existuje deeplink
   */
  const proceed = async () => {
    // 1️⃣ odemkneme panel
    hcpPane.classList.remove("hcp-locked");
    hcpPane.classList.add("show", "active");

    // 2️⃣ přepneme tab
    const tabInstance = new bootstrap.Tab(hcpTab);
    tabInstance.show();

    // 3️⃣ načteme produkty (VŽDY)
    await initProducts();

    // 4️⃣ otevřeme detail jen pokud existuje deeplink
    const productId = sessionStorage.getItem("genetia_deeplink_product");
    if (productId && typeof window.openProductDetailById === "function") {
      sessionStorage.removeItem("genetia_deeplink_product");
      setTimeout(() => window.openProductDetailById(productId), 50);
    }
  };

  /**
   * GATE FLOW
   * - funguje při kliknutí i automaticky
   */
  const openGateFlow = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const isVerified = sessionStorage.getItem("genetia_hcp_verified") === "1";

    // ✅ už ověřen → rovnou pokračuj
    if (isVerified) {
      await proceed();
      return;
    }

    // jinak zobraz gate modal
    const modal = new bootstrap.Modal(gateModal);
    modal.show();

    const continueBtn = gateModal.querySelector("[data-continue]");
    const denyBtn = gateModal.querySelector("#denyAccess");

    if (continueBtn) {
      continueBtn.addEventListener(
        "click",
        async () => {
          // uložíme ověření pro session
          sessionStorage.setItem("genetia_hcp_verified", "1");

          modal.hide();

          // cleanup bootstrap modalu
          document.body.classList.remove("modal-open");
          document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());

          await proceed();
        },
        { once: true }
      );
    }

    if (denyBtn) {
      denyBtn.addEventListener(
        "click",
        () => {
          modal.hide();
          const publicInstance = new bootstrap.Tab(publicTab);
          publicInstance.show();
        },
        { once: true }
      );
    }
  };

  // 🔘 ruční klik na TAB
  hcpTab.addEventListener("click", openGateFlow);

  // ⚡ AUTO-START jen pokud existuje deeplink
  if (sessionStorage.getItem("genetia_deeplink_product")) {
    setTimeout(() => openGateFlow(), 0);
  }
}
