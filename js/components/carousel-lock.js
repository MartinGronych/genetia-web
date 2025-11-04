// ==================================================
// GENETIA – Carousel Expert Lock (v1.7 Always Ask)
// --------------------------------------------------
// ▸ Žádné ukládání do localStorage (potvrzení vždy znovu)
// ▸ Oko uprostřed sekce, blur do potvrzení
// ==================================================

const section = document.querySelector(".products-carousel-section");
const gateModal = document.getElementById("gateModal");
const lockWrapper = document.querySelector(".carousel-lock");
if (lockWrapper) {
  lockWrapper.innerHTML = `
  <svg class="eye-icon-animated v3" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <!-- Kontura oka – mandlový tvar -->
    <path 
      d="M10,60 Q60,10 110,60 Q60,110 10,60 Z" 
      fill="#fff" 
      stroke="#0b2038" 
      stroke-width="4"
      stroke-linejoin="round"
      stroke-linecap="round"
    />

    <!-- Duhovka (pohyblivá) -->
    <g class="iris-group">
      <circle cx="60" cy="60" r="14" fill="url(#irisGradient)" />
      <circle cx="60" cy="60" r="7" fill="#000"/>
      <circle cx="64" cy="56" r="3" fill="rgba(255,255,255,0.9)" />
    </g>

    <!-- Horní víčko -->
      <path 
      class="eyelid" 
      d="M10,60 Q60,10 110,60 Q60,30 10,60 Z"
      fill="#f5f5f5"
    />

    <defs>
      <radialGradient id="irisGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#4db3ff"/>
        <stop offset="100%" stop-color="#0e2f57"/>
      </radialGradient>
    </defs>
  </svg>
`;
}

const eyeIcon = section?.querySelector(
  ".carousel-lock svg, .carousel-lock img, .carousel-lock .eye-icon"
);

if (section && gateModal && eyeIcon) {
  console.log("🔒 Carousel Lock script loaded");

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

  // === Výchozí stav – vždy zamčeno
  lock();

  // === Klik na oko otevře modál
  eyeIcon.addEventListener("click", () => {
    const modal = new bootstrap.Modal(gateModal);
    modal.show();

    // Po kliknutí na „ANO, VSTOUPIT“
    gateModal.querySelector("[data-continue]")?.addEventListener(
      "click",
      () => {
        modal.hide();
        setTimeout(() => unlock(), 200);
      },
      { once: true }
    );

    // Po kliknutí na „NE, ODEJÍT“
    gateModal.querySelector("#denyAccess")?.addEventListener(
      "click",
      () => {
        modal.hide();
        setTimeout(() => (window.location.href = "index.html"), 250);
      },
      { once: true }
    );
  });
} else {
  console.warn("⚠️ Carousel lock elements not found", {
    section,
    gateModal,
    eyeIcon,
  });
}
