// ==================================================
// GENETIA – Modal / Gate Control (Modular v3.0)
// Autor: Martin Gronych
// --------------------------------------------------
// ▸ Otevírání modalu (Klientská zóna, Gate pro produkty)
// ▸ Bez automatického spouštění (volá se z initModal())
// ==================================================

export function initModal() {
  // --- Klientská zóna (globální) ---
  const clientModal = document.getElementById("clientModal");
  const openBtn = document.getElementById("openClientModal");
  const closeBtn = clientModal?.querySelector(".close");

  if (clientModal && openBtn) {
    openBtn.addEventListener("click", () => {
      clientModal.style.display = "block";
    });

    closeBtn?.addEventListener("click", () => {
      clientModal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === clientModal) clientModal.style.display = "none";
    });
  }

  // --- Gate Modal pro produkty (profesionální přístup) ---
  const guardLinks = document.querySelectorAll("[data-requires-professional]");
  const gateModal = document.getElementById("gateModal");

  if (guardLinks.length && gateModal) {
    guardLinks.forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const modal = new bootstrap.Modal(gateModal);
        modal.show();

        // Po potvrzení → přepnutí na sekci „pro odborníky“
        gateModal.querySelector("[data-continue]")?.addEventListener(
          "click",
          () => {
            modal.hide();
            const target = document.querySelector("#pro-odborniky-tab");
            if (target) new bootstrap.Tab(target).show();
            document
              .getElementById("pro-odborniky")
              ?.scrollIntoView({ behavior: "smooth" });
          },
          { once: true }
        );
      });
    });

    // Odmítnutí přístupu
    document.getElementById("denyAccess")?.addEventListener("click", () => {
      setTimeout(() => (window.location.href = "index.html"), 500);
    });
  }

  // --- Aktivace oka v carouselu (společné pro homepage) ---
  document.addEventListener("click", (e) => {
    const eyeIcon = e.target.closest(".eye-icon");
    if (!eyeIcon) return;

    const gateModal = document.getElementById("gateModal");
    if (!gateModal) return;

    const modalInstance = new bootstrap.Modal(gateModal);
    modalInstance.show();
  });

  console.log("💬 Modal system initialized");

  // --- Otevření objednávkového modalu z detailu panelu ---
  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-open-order]")) {
      const orderModal = document.getElementById("orderModal");
      if (orderModal) {
        const modal = new bootstrap.Modal(orderModal);
        modal.show();
      }
    }
  });
  
  console.log(" Modal panel initialized")
}
