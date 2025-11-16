// ==================================================
// GENETIA – Product Detail Modal (Final A11y Safe)
// ==================================================

export function openProductDetail(product) {
  const modalElement = document.getElementById("productDetailModal");
  const modal = new bootstrap.Modal(modalElement);

  // -----------------------------------------------
  // 1) PŘED ZAVŘENÍM MODALU – OKAMŽITĚ ODSTRANIT FOCUS
  //    (kritické, opravuje aria-hidden warning)
  // -----------------------------------------------

  // tlačítko X
  const closeBtn = modalElement.querySelector(".btn-close");
  if (closeBtn) {
    closeBtn.addEventListener(
      "mousedown",
      () => {
        document.activeElement.blur();
      },
      { once: false }
    );
  }

  // kliknutí mimo modal
  modalElement.addEventListener(
    "mousedown",
    (e) => {
      if (e.target.classList.contains("modal")) {
        document.activeElement.blur();
      }
    },
    false
  );

  // při ručním zavření modal.hide()
  modalElement.addEventListener(
    "hide.bs.modal",
    () => {
      document.activeElement.blur();
    },
    false
  );

  // -----------------------------------------------
  // 2) NAPLŇENÍ DAT
  // -----------------------------------------------

  document.getElementById("modalProductImage").src = product.image;
  document.getElementById("modalProductName").textContent = product.name;
  document.getElementById("modalProductRatio").textContent = product.ratio;
  document.getElementById("modalProductDescription").textContent =
    product.description;

  document.getElementById("modalCompositionTable").innerHTML = Object.entries(
    product.composition
  )
    .map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`)
    .join("");

  document.getElementById("modalExtractionMethod").textContent =
    product.extraction;
  document.getElementById("modalCarrier").textContent = product.carrier;
  document.getElementById("modalCertification").textContent =
    product.certification;

  const dosageContainer = document.getElementById("modalDosageForms");
  dosageContainer.innerHTML = product.forms
    .map((form, index) => {
      const icon = product.formsIcon?.[index] || "circle-dot";
      return `
        <div class="dosage-form">
          <i data-lucide="${icon}"></i> ${form}
        </div>
      `;
    })
    .join("");

  lucide?.createIcons();

  document.getElementById("modalPackage").textContent = product.package;
  document.getElementById("modalContainerType").textContent = product.container;
  document.getElementById("modalERecept").textContent = product.eRecept;

  // -----------------------------------------------
  // 3) PŘESUN FOCUSU PO ZAVŘENÍ
  // -----------------------------------------------
  modalElement.addEventListener(
    "hidden.bs.modal",
    () => {
      const hcpTab = document.getElementById("pro-odborniky-tab");
      if (hcpTab) hcpTab.focus();
      else document.body.focus();
    },
    { once: true }
  );

  // -----------------------------------------------
  // 4) ZOBRAZIT MODAL
  // -----------------------------------------------
  modal.show();
}
