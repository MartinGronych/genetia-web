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
    return li;
  }

  function getIndex(i) {
    const len = products.length;
    return (i + len) % len;
  }

  // === Aktivace ovládání ===
  function activateCarousel() {
    const swipe = new Hammer($(".swipe"));
    const slider = $(".carousel-list");

    slider.onclick = (e) => {
      if (e.target.classList.contains("next")) next();
      else if (e.target.classList.contains("prev")) prev();
    };

    swipe.on("swipeleft", () => next());
    swipe.on("swiperight", () => prev());
  }
}
