// ==================================================
// GENETIA – PRODUCTS CAROUSEL (v5.0 Modular Edition)
// Autor: Martin Gronych
// --------------------------------------------------
// ▸ Načítání z JSON (products.json)
// ▸ Hammer.js ovládání (swipe)
// ▸ Lucide ikony aktivace
// ▸ Export funkce initCarousel() pro multi-entry architekturu
// ==================================================

export async function initCarousel() {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);
  const JSON_URL = "data/products.json";

  let products = [];
  let currentIndex = 0;

  const list = $(".carousel-list");
  if (!list) {
    console.warn("⚠️ Carousel container not found – skipping initialization");
    return;
  }

  try {
    const res = await fetch(JSON_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    products = await res.json();
  } catch (err) {
    console.error("❌ Chyba při načítání produktů:", err);
    return;
  }

  if (!products.length) {
    console.warn("⚠️ Žádná data pro carousel");
    return;
  }

  init();

  // === Inicializace carouselu ===
  function init() {
    list.innerHTML = "";
    for (let i = -2; i <= 2; i++) {
      const index = getIndex(currentIndex + i);
      const li = createItem(products[index]);
      list.appendChild(li);
    }

    const items = $$(".carousel-list li");
    if (items.length < 5) return;

    items[0].classList.add("hide");
    items[1].classList.add("prev");
    items[2].classList.add("act");
    items[3].classList.add("next");
    items[4].classList.add("new-next");

    activateCarousel();

    if (window.lucide) lucide.createIcons({ icons: window.lucide.icons });

    console.log("🎠 Carousel initialized with", products.length, "items");
  }

  // === Funkce posuvu ===
  function next() {
    currentIndex = getIndex(currentIndex + 1);
    const items = $$(".carousel-list li");
    if (items.length < 5) return;

    items[0].remove();
    items[1].className = "hide";
    items[2].className = "prev";
    items[3].className = "act";
    items[4].className = "next";

    const newItem = createItem(products[getIndex(currentIndex + 2)]);
    newItem.className = "new-next";
    list.appendChild(newItem);

    if (window.lucide) lucide.createIcons({ icons: window.lucide.icons });
  }

  function prev() {
    currentIndex = getIndex(currentIndex - 1);
    const items = $$(".carousel-list li");
    if (items.length < 5) return;

    items[4].remove();
    items[3].className = "new-next";
    items[2].className = "next";
    items[1].className = "act";
    items[0].className = "prev";

    const newItem = createItem(products[getIndex(currentIndex - 2)]);
    newItem.className = "hide";
    list.insertBefore(newItem, list.firstChild);

    if (window.lucide) lucide.createIcons({ icons: window.lucide.icons });
  }

  // === Pomocné funkce ===
  function createItem(product) {
    const li = document.createElement("li");
    li.style.backgroundImage = `url(${product.image})`;
    li.dataset.productId = product.id;

    li.innerHTML = `
    <div class="carousel-item-content">
      <h3 class="carousel-product-title">${product.name}</h3>
      <button class="btn btn-brand">
        odborné informace
      </button>
      <div class="ratio">${product.ratio}</div>
    </div>
  `;

    return li;
  }
  function getIndex(i) {
    const len = products.length;
    return (i + len) % len;
  }

  // === Aktivace ovládání ===
  function activateCarousel() {
    const swipeEl = $(".swipe");
    const slider = $(".carousel-list");

    if (!slider || !swipeEl) {
      console.warn("⚠️ Carousel swipe elements not found");
      return;
    }

    const hammer = new Hammer(swipeEl);

    // =========================
    // KLIKY MYŠÍ (delegace)
    // =========================
    slider.addEventListener("click", (e) => {
      // 1️⃣ CTA / produktový proklik (má prioritu)
      const productBtn = e.target.closest(".products-carousel-section .btn.btn-brand");
      if (productBtn) {
        e.preventDefault();

        const item = productBtn.closest("li");
        const productId = item?.dataset?.productId;

        if (!productId) {
          console.warn("⚠️ Missing productId on carousel item");
          return;
        }

        // 👉 přesměrování (gate řešíš globálně)
        window.location.href = `produkty.html?product=${productId}`;
        return;
      }

      // 2️⃣ Navigace carouselu (klik na pozice)
      const li = e.target.closest("li");
      if (!li) return;

      if (li.classList.contains("next")) {
        next();
      } else if (li.classList.contains("prev")) {
        prev();
      }
    });

    // =========================
    // SWIPE GESTA
    // =========================
    hammer.on("swipeleft", () => next());
    hammer.on("swiperight", () => prev());
  }
}
