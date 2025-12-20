/* ==================================================
   GENETIA – Panels Grid render (from panels.json)
================================================== */

const esc = (s = "") =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const getTatLabel = (panel) => {
  const tat = panel?.tat || panel?.turnaround || "";
  return tat ? `Délka zpracování: ${tat}` : "";
};

const cardHTML = (panel) => {
  const id = panel?.id || "";
  const title = panel?.title || "";

  return `
    <div class="panel-card panel-card--compact" data-panel-id="${esc(
      id
    )}" role="button" tabindex="0" aria-label="${esc(title)}">
      <h3 class="panel-title">${esc(title)}</h3>
      <div class="panel-actions">
        <span class="btn-panel" role="link" aria-label="Více informací">více informací</span>
      </div>
    </div>
  `;
};

export async function initPanelsGrid(options = {}) {
  const {
    gridId = "testPanelsGrid",
    dataUrl = "/data/panels.json",
  } = options;

  const grid = document.getElementById(gridId);
  if (!grid) return;

  // === BASE PATH FIX (GitHub Pages vs local) ===
  const BASE =
    location.hostname.endsWith("github.io")
      ? `/${location.pathname.split("/")[1]}`
      : "";

  const resolvedUrl = `${BASE}${dataUrl}`;

  try {
    const res = await fetch(resolvedUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const panels = Array.isArray(data) ? data : data?.panels;

    if (!Array.isArray(panels) || panels.length === 0) {
      grid.innerHTML =
        '<p class="text-center opacity-75 mb-0">Služby se nepodařilo načíst.</p>';
      return;
    }

    grid.innerHTML = panels.map(cardHTML).join("");

    // A11y: ENTER / SPACE = klik
    grid.addEventListener("keydown", (e) => {
      const card = e.target.closest(".panel-card");
      if (!card) return;

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  } catch (err) {
    console.error("[panels-render] load failed:", err);
    grid.innerHTML =
      '<p class="text-center opacity-75 mb-0">Služby se nepodařilo načíst.</p>';
  }
}

