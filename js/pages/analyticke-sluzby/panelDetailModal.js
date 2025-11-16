// ==================================================
// GENETIA – Testovací panely → Detail Modal Loader
// Autor: Martin Gronych
// ==================================================

export async function initPanelDetailModal() {
  console.log("🔬 PanelDetailModal init");

  // Načteme JSON dataset
  const response = await fetch("./data/panels.json");
  const data = await response.json();
  const panels = data.panels;

  const modalEl = document.getElementById("panelDetailModal");
  const modalInstance = new bootstrap.Modal(modalEl);

  // Selektory do modalu
  const title = document.getElementById("panelDetailTitle");
  const desc = document.getElementById("panelDetailDescription");
  const method = document.getElementById("panelDetailMethod");
  const instr = document.getElementById("panelDetailInstrumentation");
  const measures = document.getElementById("panelDetailMeasures");
  const turnaround = document.getElementById("panelDetailTurnaround");
  const price = document.getElementById("panelDetailPrice");

  // Napojujeme karty panelů
  document.querySelectorAll(".panel-card").forEach((card) => {
  card.addEventListener("click", () => {

    const panelId = card.dataset.panelId;
    const panelData = panels.find((p) => p.id === panelId);

    if (!panelData) {
      console.warn("Panel ID not found:", panelId);
      return;
    }

    // Naplnění modalu
    title.textContent = panelData.title;
    desc.textContent = panelData.description;
    method.textContent = panelData.method;
    instr.textContent = panelData.instrumentation;
    turnaround.textContent = panelData.turnaround;
    price.textContent = panelData.price;

    measures.innerHTML = "";
    panelData.what_we_measure.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      measures.appendChild(li);
    });

    modalInstance.show();
  });
});


  // Tlačítko „Objednat“ → otevře objednávkový modal
  document.querySelector("#panelOrderBtn").addEventListener("click", () => {
    modalInstance.hide();

    const orderModal = document.getElementById("orderModal");
    if (orderModal) {
      const m = new bootstrap.Modal(orderModal);
      m.show();
    }
  });
}
