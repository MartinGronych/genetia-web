// ==================================================
// VÝVOJ & VÝZKUM – Metodický brief (inline toggle)
// ==================================================
export function initVyvojBriefToggle() {
  const toggles = document.querySelectorAll(".vyvoj-brief_toggle");
  if (!toggles.length) return;

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const wrapper = toggle.closest(".vyvoj-brief");
      if (!wrapper) return;

      const panel = wrapper.querySelector(".vyvoj-brief_panel");
      if (!panel) return;

      const expanded = toggle.getAttribute("aria-expanded") === "true";
      const next = !expanded;

      // OPEN
      if (next) {
        // 1) zpřístupnit element (jinak je display:none a neanimuje)
        panel.hidden = false;

        // 2) až v dalším snímku zapnout aria-open → spustí animaci
        requestAnimationFrame(() => {
          wrapper.setAttribute("aria-open", "true");
          toggle.setAttribute("aria-expanded", "true");
        });

        return;
      }

      // CLOSE
      // 1) vypnout aria-open → spustí “zavírací” animaci
      wrapper.setAttribute("aria-open", "false");
      toggle.setAttribute("aria-expanded", "false");

      // 2) po doběhnutí animace teprve schovat (display:none)
      const onDone = (e) => {
        // čekáme na transition z panelu (grid/opacity)
        if (e.target !== panel) return;
        panel.hidden = true;
        panel.removeEventListener("transitionend", onDone);
      };

      panel.addEventListener("transitionend", onDone);
    });
  });
}
