// ==================================================
// USP BAR – render z JSON do #uspGrid (NO modal)
// - icon from JSON
// - equal-height cards (fixed inner frame)
// ==================================================

const GRID_ID = "uspGrid";
const DATA_URL = "/data/usp.json";

// === BASE PATH FIX (GitHub Pages vs local) ===
const BASE =
  location.hostname.endsWith("github.io")
    ? `/${location.pathname.split("/")[1]}`
    : "";

const resolveUrl = (url) => {
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
  const href = escapeHtml(item.href || item.target || "#");
  const icon = escapeHtml(item.icon || "award"); // fallback

  // ✅ FIXED FRAME: always same height (CSS will size .usp-item_frame)
  return `
    <a
      class="usp-item"
      href="${href}"
      role="listitem"
      data-usp-id="${escapeHtml(item.id)}"
      aria-label="${title}"
    >
      <div class="usp-item_frame">
        <span class="usp-item_icon" aria-hidden="true">
          <i data-lucide="${icon}"></i>
        </span>

        <div class="usp-item_title">${title}</div>
      </div>
    </a>
  `;
}

export async function initUspBar() {
  const grid = document.getElementById(GRID_ID);
  if (!grid) return;

  const data = await fetchJson(DATA_URL);
  const items = Array.isArray(data?.items) ? data.items.slice() : [];
  items.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  grid.innerHTML = items.map(renderItem).join("");

  // ✅ render lucide icons for newly injected markup
  if (window.lucide?.createIcons) {
    window.lucide.createIcons();
  }
}
