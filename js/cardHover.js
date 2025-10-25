// ==================================================
// GENETIA – CARD HOVER EFFECT
// --------------------------------------------------
// Jemný světelný efekt při pohybu kurzoru po USP boxech
// ==================================================

export function initCardHover() {
  const cards = document.querySelectorAll('.usp-item');

  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--x');
      card.style.removeProperty('--y');
    });
  });
}
