// ==================================================
// GENETIA – Produkty Expert Gate (v1.1 – fixed)
// Autor: Martin Gronych
// --------------------------------------------------
// ▸ Zamyká panel "Pro lékaře a lékárny"
// ▸ Po potvrzení otevře modal, přepne TAB a načte produkty
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

  // 🔒 výchozí stav – odborný panel je zamčený a neschovaný
  hcpPane.classList.add("hcp-locked");

  hcpTab.addEventListener("click", (e) => {
    e.preventDefault();   // zablokuje defaultní přepnutí Bootstrapem
    e.stopPropagation();

    const modal = new bootstrap.Modal(gateModal);
    modal.show();

    const continueBtn = gateModal.querySelector("[data-continue]");
    const denyBtn = gateModal.querySelector("#denyAccess");

    // 🟢 ANO – vstoupit
    if (continueBtn) {
      continueBtn.addEventListener(
        "click",
        async () => {
          console.log("✅ Gate: potvrzeno – odemykám HCP panel");
          modal.hide();

          // 1) Odemkneme panel (zruší display:none)
          hcpPane.classList.remove("hcp-locked");

          // 2) Jistota – ručně nastavíme viditelnost tab-panu
          hcpPane.classList.add("show", "active");

          // 3) Přepneme tab přes Bootstrap (kvůli ARIA a stavu tabů)
          const tabInstance = new bootstrap.Tab(hcpTab);
          tabInstance.show();

          // 4) Načteme produkty
          await initProducts();
        },
        { once: true }
      );
    }

    // ❌ NE – odejít
    if (denyBtn) {
      denyBtn.addEventListener(
        "click",
        () => {
          console.log("ℹ️ Gate: přístup zamítnut, návrat na veřejnou sekci");
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
