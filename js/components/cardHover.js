// ==================================================
// GENETIA – CARD HOVER EFFECT (v2.1 Modular)
// Autor: Martin Gronych
// --------------------------------------------------
// Jemný světelný efekt při pohybu kurzoru po kartách.
// Použití: .usp-item nebo .hover-card (univerzální)
// ==================================================

export function initCardHover() {
  // Vyber všechny elementy, které efekt používají
  const cards = document.querySelectorAll(".usp-item, .hover-card, [data-hover-card]");
  if (!cards.length) {
    console.log("ℹ️ [CardHover] Žádné karty k aktivaci (přeskočeno)");
    return;
  }

  // Aktivace efektu pro každou kartu
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--x", `${x}px`);
      card.style.setProperty("--y", `${y}px`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.removeProperty("--x");
      card.style.removeProperty("--y");
    });
  });

  console.log(`🃏 [CardHover] Aktivováno ${cards.length} karet`);
}
