// ==================================================
// USP REVEAL – postupné odhalování položek při scrollu
// ==================================================

const GRID_ID = "uspGrid";

export function initUspReveal() {
  const grid = document.getElementById(GRID_ID);
  if (!grid) return;

  const items = Array.from(grid.querySelectorAll(".usp-item"));
  if (!items.length) return;

  // výchozí stav (CSS si doplníme později – teď jen třídy)
  items.forEach((el) => el.classList.add("is-reveal-ready"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        console.info("[USP REVEAL] intersect ✅", {
          target: entry.target?.id || entry.target?.className,
          ratio: entry.intersectionRatio,
        });

        // stagger: podle pořadí v DOM (už je seřazené orderem z JSON)
        items.forEach((el, i) => {
          const delay = i === 0 ? 0 : i * 485;
          el.style.setProperty("--usp-reveal-delay", `${delay}ms`);
          el.classList.add("is-revealed");
        });

        console.info("[USP REVEAL] revealed classes added ✅", {
          items: items.length,
          first: items[0]?.className,
        });

        io.disconnect();
      });
    },

    { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
  );

  io.observe(grid);
}
