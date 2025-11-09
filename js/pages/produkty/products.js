// ==================================================
// GENETIA – PRODUCTS MODULE
// --------------------------------------------------
// Dynamické načtení produktů z JSON a vytvoření karet
// Celá karta i obrázek jsou klikatelné a přenášejí
// uživatele na produkty.html#produktX
// ==================================================

export async function initProducts() {
  const container = document.getElementById("products-grid");
  const JSON_URL = "data/products.json";

  if (!container) return; // ochrana, pokud sekce není na stránce

  try {
    const response = await fetch(JSON_URL);
    const products = await response.json();

    // Vytvoření HTML pro každou kartu
    const cardsHTML = products
      .map(
        (product) => `
        <div class="col-md-3 col-sm-6">
          <div class="card h-100 shadow-sm border-0 product-card" data-link="${product.link}">
            <img src="${product.image}" class="card-img-top" alt="${product.title}" />
            <div class="card-body">
              <h5 class="card-title">${product.title}</h5>
              <p class="card-text small text-secondary">${product.description}</p>
              <a href="${product.link}" class="btn btn-outline-accent btn-sm">Detail</a>
            </div>
          </div>
        </div>
      `
      )
      .join("");

    container.innerHTML = cardsHTML;

    // Kliknutí na celou kartu nebo obrázek → přesměrování
    container.querySelectorAll(".product-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        const link = card.dataset.link;
        window.location.href = link;
      });
    });
  } catch (err) {
    console.error("❌ Chyba při načítání produktů:", err);
    container.innerHTML = `<p class="text-danger">Nepodařilo se načíst produkty.</p>`;
  }
}
