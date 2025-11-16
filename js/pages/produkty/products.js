// ==================================================
// GENETIA – Products Render (HCP)
// Autor: Martin Gronych
// --------------------------------------------------
// ▸ Načtení /data/products.json
// ▸ Render tří produktových karet
// ▸ Používá se až po HCP ověření (gate.js)
// ==================================================

import { openProductDetail } from "./detail.js";

export async function initProducts() {
  const grid = document.getElementById("hcp-products-section");
  if (!grid) {
    console.warn("⚠️ HCP grid container nenalezen");
    return;
  }

  try {
    const res = await fetch("data/products.json");
    if (!res.ok) throw new Error("HTTP error " + res.status);

    const products = await res.json();

    grid.innerHTML = products.map((product) => productCard(product)).join("");
    // aktivace click handlerů
    document.querySelectorAll(".hcp-product-card").forEach((card, idx) => {
      card.addEventListener("click", () => openProductDetail(products[idx]));
    });
  } catch (err) {
    console.error("❌ Chyba při načítání produktů:", err);
  }
}

// ==================================================
// Vytvoří HTML jedné karty produktu
// ==================================================

function productCard(product) {
  return `
    <div class="hcp-product-card">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <span class="ratio">${product.ratio}</span>
      <p>${product.description}</p>
    </div>
  `;
}
