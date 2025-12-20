// ==================================================
// GENETIA – Testovací panely → Detail Modal Loader
// Autor: Martin Gronych
// ==================================================

export async function initPanelDetailModal() {
  console.log("PanelDetailModal načten");

  // Načtení JSON datasetu
  const response = await fetch("/data/panels.json");
  const data = await response.json();
  const panels = data.panels;

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

  // Delegace kliků (funguje i pro dynamicky renderované karty)
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".panel-card");
    if (!card) return;

    const panelId = card.dataset.panelId;
    const panelData = panels.find((p) => p.id === panelId);
    if (!panelData) return;

    // Naplnění modalu
    title.textContent = panelData.title || "";
    desc.textContent = panelData.description || "";
    method.textContent = panelData.method || "—";
    instr.textContent = panelData.instrumentation || "—";
    turnaround.textContent = panelData.turnaround || "—";
    price.textContent = panelData.price || "—";

    measures.innerHTML = "";
    (panelData.what_we_measure || []).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      measures.appendChild(li);
    });

    modalInstance.show();
  });

  // ✅ OBJEDNÁVKA → KONTAKTNÍ FORMULÁŘ
  orderBtn.addEventListener("click", () => {
    window.location.href = "kontakt.html#form-contact";
  });
}
