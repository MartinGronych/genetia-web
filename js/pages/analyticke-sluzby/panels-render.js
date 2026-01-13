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

const renderGroupIcon = (icon) => {
  if (icon === "bacteria") {
    return `
      <img
        class="panels-group_iconSvg"
        src="assets/icons/bacteria.svg"
        alt=""
        aria-hidden="true"
        decoding="async"
        loading="lazy"
      />
    `;
  }
  return `<i data-lucide="${esc(icon)}" aria-hidden="true"></i>`;
};

// "label" musí odpovídat panels.json `category`
const CATEGORY_ORDER = [
  {
    key: "farmakognosticke",
    label: "Farmakognostické metody",
    subtitle: "Identifikace a ověření kvality rostlinného materiálu",
    icon: "leaf",
  },
  {
    key: "fyzikalni",
    label: "Fyzikální a fyzikálně-chemické zkoušky",
    subtitle: "Stanovení fyzikálních vlastností a chemického složení",
    icon: "beaker",
  },
  {
    key: "limitni",
    label: "Limitní zkoušky",
    subtitle: "Kontrola limitních hodnot kontaminantů",
    icon: "shield-check",
  },
  {
    key: "mikrobiologie",
    label: "Zkoušky mikrobiologické jakosti",
    subtitle: "Mikrobiální čistota a detekce patogenů",
    icon: "bacteria",
  },
  {
    key: "obsah",
    label: "Stanovení obsahu látek",
    subtitle: "Kvantitativní analýza specifických parametrů",
    icon: "flask-conical",
  },
];

const cardHTML = (panel) => {
  const id = panel?.id || "";
  const title = panel?.title || "";
  const short = (panel?.short || "").trim();

  return `
    <button
      type="button"
      class="panel-card panel-card--chip"
      data-panel-id="${esc(id)}"
      aria-label="${esc(title)}"
    >
      <span class="panel-chipText">
        <span class="panel-title">${esc(title)}</span>
        ${short ? `<span class="panel-subtitle">${esc(short)}</span>` : ""}
      </span>

      <span class="panel-chipArrow" aria-hidden="true">›</span>
    </button>
  `;
};

const groupSectionHTML = ({ label, subtitle, icon }, cardsHtml) => {
  return `
    <section class="panels-group" aria-label="${esc(label)}">
      <header class="panels-group_header">
        <div class="panels-group_icon" aria-hidden="true">
          ${renderGroupIcon(icon)}
        </div>

        <div class="panels-group_headText">
          <h3 class="panels-group_title">${esc(label)}</h3>
          ${subtitle ? `<p class="panels-group_subtitle">${esc(subtitle)}</p>` : ""}
        </div>
      </header>

      <div class="panels-group_items">
        ${cardsHtml}
      </div>
    </section>
  `;
};

export async function initPanelsGrid(options = {}) {
  const { gridId = "testPanelsGrid", dataUrl = "/data/panels.json" } = options;

  const grid = document.getElementById(gridId);
  if (!grid) return;

  // BASE PATH FIX (GitHub Pages vs local)
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
        '<p class="text-center opacity-75 mb-0">Žádné služby nebyly nalezeny.</p>';
      grid.dataset.count = "0";
      return;
    }

    // Group by category
    const buckets = new Map();
    for (const p of panels) {
      const category = (p?.category || p?.group || "").trim();
      const key = category || "Ostatní";
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(p);
    }

    // Render in defined order + unknown at end
    const htmlParts = [];

    for (const cat of CATEGORY_ORDER) {
      const list = buckets.get(cat.label);

      // ✅ jen naplněné sekce (žádné prázdné karty)
      if (!list || list.length === 0) continue;

      const cardsHtml = list.map(cardHTML).join("");
      htmlParts.push(groupSectionHTML(cat, cardsHtml));
      buckets.delete(cat.label);
    }

    // unknown categories → end (only if they have items)
    for (const [label, list] of buckets.entries()) {
      if (!list || list.length === 0) continue;
      const cardsHtml = list.map(cardHTML).join("");
      htmlParts.push(
        groupSectionHTML({ label, subtitle: "", icon: "grid-2x2" }, cardsHtml)
      );
    }

    grid.innerHTML = htmlParts.join("");

    // ✅ pro CSS layout (3 nahoře + 2 centrované)
    grid.dataset.count = String(htmlParts.length);

    if (window.lucide?.createIcons) window.lucide.createIcons();

    // A11y: Enter/Space trigger click
    grid.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const btn = e.target.closest(".panel-card");
      if (!btn) return;
      e.preventDefault();
      btn.click();
    });
  } catch (err) {
    console.error("[panels-render] load failed:", err);
    grid.innerHTML =
      '<p class="text-center opacity-75 mb-0">Služby se nepodařilo načíst.</p>';
    grid.dataset.count = "0";
  }
}
