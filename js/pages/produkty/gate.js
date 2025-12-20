// ==================================================
// GENETIA – Produkty Expert Gate (FINAL)
// Autor: Martin Gronych
// --------------------------------------------------
// ▸ Zamyká panel "Pro lékaře a lékárny"
// ▸ Gate se otevře pouze při deep-linku
// ▸ Po potvrzení:
//    - odemkne HCP tab
//    - načte produkty
//    - otevře detail produktu (modal)
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

  hcpTab.addEventListener("click", (e) => {
    const deepProductId = sessionStorage.getItem("genetia_deeplink_product");

    // ❌ žádný deep-link → gate se nespouští
    if (!deepProductId) return;

    e.preventDefault();
    e.stopPropagation();

    const modal = new bootstrap.Modal(gateModal);
    modal.show();

    const continueBtn = gateModal.querySelector("[data-continue]");
    const denyBtn = gateModal.querySelector("#denyAccess");

    // =========================
    // 🟢 ANO – vstoupit
    // =========================
    if (continueBtn) {
      continueBtn.addEventListener(
        "click",
        async () => {
          modal.hide();

          // 🔴 kompletní teardown gate modalu
          document.body.classList.remove("modal-open");
          document
            .querySelectorAll(".modal-backdrop")
            .forEach((el) => el.remove());

          // 1) Odemkneme HCP panel
          hcpPane.classList.remove("hcp-locked");
          hcpPane.classList.add("show", "active");

          // 2) Přepneme TAB přes Bootstrap
          const tabInstance = new bootstrap.Tab(hcpTab);
          tabInstance.show();

          // 3) Načteme produkty
          await initProducts();

          // 4) Otevřeme produktový modal (POUZE 1×)
          const productId =
            sessionStorage.getItem("genetia_deeplink_product");

          if (
            productId &&
            typeof window.openProductDetailById === "function"
          ) {
            // ⛔️ zrušíme deep-link OKAMŽITĚ
            sessionStorage.removeItem("genetia_deeplink_product");

            // ⏱️ mikro-delay kvůli Bootstrap / DOM
            setTimeout(() => {
              window.openProductDetailById(productId);
            }, 50);
          }
        },
        { once: true }
      );
    }

    // =========================
    // ❌ NE – odejít
    // =========================
    if (denyBtn) {
      denyBtn.addEventListener(
        "click",
        () => {
          modal.hide();

          // návrat na veřejný tab
          const publicInstance = new bootstrap.Tab(publicTab);
          publicInstance.show();
        },
        { once: true }
      );
    }
  });
}
