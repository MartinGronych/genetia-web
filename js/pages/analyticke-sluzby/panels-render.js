/* ==================================================
   GENETIA – Panels Grid render (from panels.json) • HYBRID
   - <1024: flat render (masonry/columns řeší CSS)
   - ≥1024: wrapper pro 3. sloupec (.panels-col--right) pro řízený grid
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
  // Pozn.: Na desktopu (≥1024) bude mikro "řízeně" ve sloupci 2 přes CSS grid.
  {
    key: "mikrobiologie",
    label: "Zkoušky mikrobiologické jakosti",
    subtitle: "Mikrobiální čistota a detekce patogenů",
    icon: "bacteria",
  },
  // Tyto dvě kategorie na desktopu skládáme do wrapperu .panels-col--right (sloupec 3)
  {
    key: "limitni",
    label: "Limitní zkoušky",
    subtitle: "Kontrola limitních hodnot kontaminantů",
    icon: "shield-check",
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

const groupSectionHTML = ({ key = "", label, subtitle, icon }, cardsHtml) => {
  const groupClass = key ? ` panels-group--${esc(key)}` : "";
  return `
    <section class="panels-group${groupClass}" aria-label="${esc(label)}">
      <header class="panels-group_header">
        <div class="panels-group_icon" aria-hidden="true">
          ${renderGroupIcon(icon)}
        </div>

        <div class="panels-group_headText">
          <h3 class="panels-group_title">${esc(label)}</h3>
          ${
            subtitle
              ? `<p class="panels-group_subtitle">${esc(subtitle)}</p>`
              : ""
          }
        </div>
      </header>

      <div class="panels-group_items">
        ${cardsHtml}
      </div>
    </section>
  `;
};

const buildPanelsHTML = ({ panels, isDesktop }) => {
  // Group by category (category text)
  const buckets = new Map();
  for (const p of panels) {
    const category = (p?.category || p?.group || "").trim();
    const bucketKey = category || "Ostatní";
    if (!buckets.has(bucketKey)) buckets.set(bucketKey, []);
    buckets.get(bucketKey).push(p);
  }

  const htmlParts = [];
  const rightColParts = []; // pouze desktop: limitni + obsah jako stack

  for (const cat of CATEGORY_ORDER) {
    const list = buckets.get(cat.label);
    if (!list || list.length === 0) continue;

    const cardsHtml = list.map(cardHTML).join("");
    const sectionHtml = groupSectionHTML(cat, cardsHtml);

    if (isDesktop && (cat.key === "limitni" || cat.key === "obsah")) {
      rightColParts.push(sectionHtml);
    } else {
      htmlParts.push(sectionHtml);
    }

    buckets.delete(cat.label);
  }

  // unknown categories → end (only if they have items)
  for (const [label, list] of buckets.entries()) {
    if (!list || list.length === 0) continue;

    const cardsHtml = list.map(cardHTML).join("");
    const otherHtml = groupSectionHTML(
      { key: "other", label, subtitle: "", icon: "grid-2x2" },
      cardsHtml
    );

    // neznámé: na desktopu je dáme taky do pravého sloupce (tolerovaná „zbytková“ oblast)
    if (isDesktop) rightColParts.push(otherHtml);
    else htmlParts.push(otherHtml);
  }

  if (isDesktop && rightColParts.length) {
    htmlParts.push(`
      <div class="panels-col panels-col--right">
        ${rightColParts.join("")}
      </div>
    `);
  }

  return {
    html: htmlParts.join(""),
    count: isDesktop ? String(htmlParts.length) : String(htmlParts.length),
  };
};

export async function initPanelsGrid(options = {}) {
  const { gridId = "testPanelsGrid", dataUrl = "/data/panels.json" } = options;

  const grid = document.getElementById(gridId);
  if (!grid) return;

  // BASE PATH FIX (GitHub Pages vs local)
  const BASE = location.hostname.endsWith("github.io")
    ? `/${location.pathname.split("/")[1]}`
    : "";

  const resolvedUrl = `${BASE}${dataUrl}`;

  // breakpoint pro hybrid: 1024+
  const mqDesktop = window.matchMedia("(min-width: 1024px)");

  let panelsCache = null;

  const render = (isDesktop) => {
    if (!panelsCache) return;

    const { html, count } = buildPanelsHTML({
      panels: panelsCache,
      isDesktop,
    });

    grid.innerHTML = html;
    grid.dataset.count = count;

    if (window.lucide?.createIcons) window.lucide.createIcons();
  };

  // A11y key handler – přidej jen jednou
  if (!grid.dataset.kbdBound) {
    grid.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const btn = e.target.closest(".panel-card");
      if (!btn) return;
      e.preventDefault();
      btn.click();
    });
    grid.dataset.kbdBound = "1";
  }

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

    panelsCache = panels;

    // první render dle aktuální šířky
    render(mqDesktop.matches);

    // přerender při překročení 1024 breakpointu (masonry <-> grid)
    if (!grid.dataset.mqBound) {
      const onChange = (e) => render(e.matches);
      if (typeof mqDesktop.addEventListener === "function") {
        mqDesktop.addEventListener("change", onChange);
      } else {
        // Safari fallback
        mqDesktop.addListener(onChange);
      }
      grid.dataset.mqBound = "1";
    }
  } catch (err) {
    console.error("[panels-render] load failed:", err);
    grid.innerHTML =
      '<p class="text-center opacity-75 mb-0">Služby se nepodařilo načíst.</p>';
    grid.dataset.count = "0";
  }
}
