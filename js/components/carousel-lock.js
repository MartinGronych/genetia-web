// ==================================================
// GENETIA – Carousel Expert Lock (v2.5 Minimal Static Eye)
// Autor: Martin Gronych
// --------------------------------------------------
// ▸ Jednoduché šedé oko uprostřed carouselu
// ▸ Žádné animace ani gradienty
// ▸ Odemčení po potvrzení v Gate modalu
// ==================================================

export function initCarouselLock() {
  const section = document.querySelector(".products-carousel-section");
  const gateModal = document.getElementById("gateModal");
  const lockWrapper = document.querySelector(".carousel-lock");

  if (!section || !gateModal || !lockWrapper) {
    console.warn("⚠️ Carousel lock prerequisites missing");
    return;
  }

  // Zabrání opakovanému renderu
  if (!lockWrapper.innerHTML.trim()) {
    lockWrapper.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#777"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="eye-icon-static">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
        <!-- Přeškrtnutí -->
        <line y1="2" x1="2" x2="22" y2="22"/>
      </svg>
    `;
  }

  const eyeIcon = lockWrapper.querySelector(".eye-icon-static");
  if (!eyeIcon) {
    console.warn("⚠️ Eye icon not found after injection");
    return;
  }

  // === Pomocné funkce ===
  const lock = () => {
    section.classList.add("is-locked");
    section
      .querySelector(".carousel-list")
      ?.style.setProperty("pointer-events", "none");
    section
      .querySelector(".swipe")
      ?.style.setProperty("pointer-events", "none");
  };

  const unlock = () => {
    section.classList.remove("is-locked");
    section
      .querySelector(".carousel-list")
      ?.style.removeProperty("pointer-events");
    section.querySelector(".swipe")?.style.removeProperty("pointer-events");
    section.querySelector(".carousel-lock")?.remove();
  };

  // === Výchozí stav – zamčeno ===
  lock();

  // === Kliknutí na oko otevře modal ===
  eyeIcon.addEventListener("click", () => {
    const modal = new bootstrap.Modal(gateModal);
    modal.show();

    gateModal.querySelector("[data-continue]")?.addEventListener(
      "click",
      () => {
        modal.hide();
        setTimeout(() => unlock(), 200);
      },
      { once: true }
    );

    gateModal.querySelector("#denyAccess")?.addEventListener(
      "click",
      () => {
        modal.hide();
        setTimeout(() => (window.location.href = "index.html"), 250);
      },
      { once: true }
    );
  });

  console.log("🔒 Carousel Lock initialized with static eye");
}
