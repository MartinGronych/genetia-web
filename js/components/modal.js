// ==================================================
// GENETIA – Modal / Gate Control (Modular v3.1)
// Autor: Martin Gronych
// --------------------------------------------------
// ▸ Otevírání modalu (Klientská zóna, Gate pro produkty)
// ▸ Bootstrap-safe (focus + hidden.bs.modal)
// ==================================================

export function initModal() {
  const PAGE = "modal";

  const logInfo = (msg) => console.info(`[GENETIA][${PAGE}] ${msg}`);
  const logWarn = (msg, err) => console.warn(`[GENETIA][${PAGE}] ${msg}`, err);
  const logErr = (msg, err) => console.error(`[GENETIA][${PAGE}] ${msg}`, err);

  // --- helper: přesun focus ven před hide (fix aria-hidden warning) ---
  const moveFocusOutOfModal = () => {
    try {
      document.activeElement?.blur?.();
      document.body.setAttribute("tabindex", "-1");
      document.body.focus({ preventScroll: true });
    } catch (e) {
      // fallback – nic
    }
  };

  // ==================================================
  // 1) Klientská zóna (DOPORUČENÍ: převést na Bootstrap modal)
  // ==================================================
  // Tady jsi měl ruční style.display, to je ok jen pokud to není Bootstrap modal.
  // Pokud #clientModal JE bootstrap modal (.modal), musí se ovládat bootstrapem.
  const clientModalEl = document.getElementById("clientModal");
  const openClientBtn = document.getElementById("openClientModal");

  if (clientModalEl && openClientBtn) {
    const isBootstrapModal = clientModalEl.classList.contains("modal");

    if (isBootstrapModal && window.bootstrap?.Modal) {
      const clientModal = bootstrap.Modal.getOrCreateInstance(clientModalEl);

      openClientBtn.addEventListener("click", () => {
        clientModal.show();
      });
    } else {
      // fallback pro ne-bootstrap modal (ponecháváme tvé původní chování)
      const closeBtn = clientModalEl.querySelector(".close");

      openClientBtn.addEventListener("click", () => {
        clientModalEl.style.display = "block";
      });

      closeBtn?.addEventListener("click", () => {
        clientModalEl.style.display = "none";
      });

      window.addEventListener("click", (e) => {
        if (e.target === clientModalEl) clientModalEl.style.display = "none";
      });
    }
  }

  // ==================================================
  // 2) Gate Modal pro produkty (profesionální přístup)
  // ==================================================
  const gateModalEl = document.getElementById("gateModal");
  const guardLinks = document.querySelectorAll("[data-requires-professional]");

  if (gateModalEl && guardLinks.length && window.bootstrap?.Modal) {
    guardLinks.forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();

        const modal = bootstrap.Modal.getOrCreateInstance(gateModalEl);
        modal.show();

        const continueBtn = gateModalEl.querySelector("[data-continue]");
        const denyBtn = gateModalEl.querySelector("#denyAccess");

        // Continue → zavřít modal → po hidden přepnout tab + scroll
        continueBtn?.addEventListener(
          "click",
          () => {
            // ⚠️ klíč: focus ven před hide
            moveFocusOutOfModal();

            gateModalEl.addEventListener(
              "hidden.bs.modal",
              () => {
                const target = document.querySelector("#pro-odborniky-tab");
                if (target) new bootstrap.Tab(target).show();

                document
                  .getElementById("pro-odborniky")
                  ?.scrollIntoView({ behavior: "smooth" });
              },
              { once: true }
            );

            modal.hide();
          },
          { once: true }
        );

        // Deny → zavřít modal → po hidden redirect
        denyBtn?.addEventListener(
          "click",
          () => {
            moveFocusOutOfModal();

            gateModalEl.addEventListener(
              "hidden.bs.modal",
              () => {
                window.location.href = "index.html";
              },
              { once: true }
            );

            modal.hide();
          },
          { once: true }
        );
      });
    });
  } else if (guardLinks.length && !gateModalEl) {
    logWarn("gateModal not found but guard links exist");
  }

  // ==================================================
  // 3) Otevření objednávkového modalu z detailu panelu
  // ==================================================
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open-order]");
    if (!btn) return;

    const orderModalEl = document.getElementById("orderModal");
    if (!orderModalEl || !window.bootstrap?.Modal) return;

    const modal = bootstrap.Modal.getOrCreateInstance(orderModalEl);
    modal.show();
  });

  logInfo("initialized");
}
