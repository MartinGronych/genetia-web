// ==================================================
// GENETIA – Testovací panely → Detail Modal Loader (Pages-safe)
// Autor: Martin Gronych
// ==================================================

const DATA_URL = "/data/panels.json";

// === BASE PATH FIX (GitHub Pages vs local) ===
const BASE =
  location.hostname.endsWith("github.io")
    ? `/${location.pathname.split("/")[1]}`
    : "";

const resolveUrl = (url) => {
  const clean = url.startsWith("/") ? url : `/${url}`;
  return `${BASE}${clean}`;
};

export async function initPanelDetailModal() {
  console.log("PanelDetailModal načten");

  const modalEl = document.getElementById("panelDetailModal");
  if (!modalEl) return;

  const modalInstance = new bootstrap.Modal(modalEl);

  // Selektory do modalu
  const title = document.getElementById("panelDetailTitle");
  const desc = document.getElementById("panelDetailDescription");
  const method = document.getElementById("panelDetailMethod");
  const instr = document.getElementById("panelDetailInstrumentation");
  const measures = document.getElementById("panelDetailMeasures");
  const turnaround = document.getElementById("panelDetailTurnaround");
  const price = document.getElementById("panelDetailPrice");
  const orderBtn = document.getElementById("panelOrderBtn");

  // Bezpečnostní guard
  if (!title || !desc || !orderBtn) {
    console.warn("PanelDetailModal: chybí elementy v DOM");
    return;
  }

  // Načtení JSON datasetu (Pages-safe)
  let panels = [];
  try {
    const response = await fetch(resolveUrl(DATA_URL), { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    panels = Array.isArray(data) ? data : data?.panels || [];
  } catch (err) {
    console.error("[panelDetailModal] JSON load failed:", err);
    panels = [];
  }

  // Delegace kliků (funguje i pro dynamicky renderované karty)
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".panel-card");
    if (!card) return;

    const panelId = card.dataset.panelId;
    if (!panelId || !panels.length) return;

    const panelData = panels.find((p) => p.id === panelId);
    if (!panelData) return;

    // Naplnění modalu
    title.textContent = panelData.title || "";
    desc.textContent = panelData.description || "";
    if (method) method.textContent = panelData.method || "—";
    if (instr) instr.textContent = panelData.instrumentation || "—";
    if (turnaround) turnaround.textContent = panelData.turnaround || "—";
    if (price) price.textContent = panelData.price || "—";

    if (measures) {
      measures.innerHTML = "";
      (panelData.what_we_measure || []).forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        measures.appendChild(li);
      });
    }

    modalInstance.show();
  });

  // ✅ OBJEDNÁVKA → KONTAKTNÍ FORMULÁŘ
  orderBtn.addEventListener("click", () => {
    window.location.href = `${BASE}/kontakt.html#form-contact`;
  });
}
