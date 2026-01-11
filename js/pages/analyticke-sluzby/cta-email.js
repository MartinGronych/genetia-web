// ==================================================
// GENETIA – CTA Email Toggle (Analytické služby)
// - po kliknutí zobrazí/skrývá e-mail pod tlačítkem
// - bez zásahu do globální logiky
// ==================================================

export function initCtaEmailToggle() {
  const toggleBtn = document.getElementById("ctaEmailToggle");
  const emailWrap = document.getElementById("ctaEmail");

  if (!toggleBtn || !emailWrap) return;

  toggleBtn.addEventListener("click", () => {
    const isNowHidden = emailWrap.classList.toggle("is-hidden");
    toggleBtn.setAttribute("aria-expanded", String(!isNowHidden));
  });
}
