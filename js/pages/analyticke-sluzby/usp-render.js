// ==================================================
// USP BAR – render z JSON do #uspGrid (Pages-safe)
// ==================================================

const GRID_ID = "uspGrid";
const DATA_URL = "/data/usp.json"; // doporučeno jako root-relative (vyřešíme base prefixem)
const MODAL_ID = "uspDetailModal";

// === BASE PATH FIX (GitHub Pages vs local) ===
const BASE =
  location.hostname.endsWith("github.io")
    ? `/${location.pathname.split("/")[1]}`
    : "";

const resolveUrl = (url) => {
  // podporuje "/data/..." i "data/..."
  const clean = url.startsWith("/") ? url : `/${url}`;
  return `${BASE}${clean}`;
};

const escapeHtml = (s) =>
  String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

async function fetchJson(url) {
  const res = await fetch(resolveUrl(url), { cache: "no-store" });
  if (!res.ok) throw new Error(`USP JSON load failed: ${res.status}`);
  return res.json();
}

function renderItem(item) {
  const title = escapeHtml(item.title);
  const subtitle = escapeHtml(item.subtitle || "");
  const hasSubtitle = Boolean(subtitle);

  return `
    <div
      class="usp-item"
      role="button"
      tabindex="0"
      data-usp-id="${escapeHtml(item.id)}"
      data-bs-toggle="modal"
      data-bs-target="#${MODAL_ID}"
    >
      <div class="usp-item_text">
        <div class="usp-item_title">${title}</div>
        ${hasSubtitle ? `<div class="usp-item_subtitle">${subtitle}</div>` : ""}
      </div>
      <div class="usp-item_hint" aria-hidden="true">Zjistit více</div>
    </div>
  `;
}

function attachA11yEnter(grid) {
  grid.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const el = e.target.closest("[data-usp-id][role='button']");
    if (el) el.click();
  });
}

export async function initUspBar() {
  const grid = document.getElementById(GRID_ID);
  if (!grid) return;

  const data = await fetchJson(DATA_URL);
  const items = Array.isArray(data.items) ? data.items.slice() : [];
  items.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  grid.innerHTML = items.map(renderItem).join("");
  attachA11yEnter(grid);
}
