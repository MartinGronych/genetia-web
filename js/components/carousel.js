// ==================================================
// GENETIA – PRODUCTS CAROUSEL (v3.1 Hammer.js Fix)
// ==================================================

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const JSON_URL = "data/products.json";

let products = [];
let currentIndex = 0;

// === 1️⃣ Načtení dat ===
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(JSON_URL);
    products = await res.json();
    initCarousel();
  } catch (err) {
    console.error("❌ Chyba při načítání produktů:", err);
  }
});

// === 2️⃣ Inicializace ===
function initCarousel() {
  const list = $(".carousel-list");
  list.innerHTML = "";

  // 5 viditelných slotů
  for (let i = -2; i <= 2; i++) {
    const index = getIndex(currentIndex + i);
    const li = createItem(products[index].image);
    list.appendChild(li);
  }

  const items = $$(".carousel-list li");
  items[0].classList.add("hide");
  items[1].classList.add("prev");
  items[2].classList.add("act");
  items[3].classList.add("next");
  items[4].classList.add("new-next");

  activateCarousel();
}

// === 3️⃣ Posuv vpřed / vzad ===
function next() {
  currentIndex = getIndex(currentIndex + 1);

  const list = $(".carousel-list");
  const items = $$(".carousel-list li");

  // posun tříd
  items[0].remove(); // odstraníme první (vlevo mimo scénu)
  items[1].className = "hide";
  items[2].className = "prev";
  items[3].className = "act";
  items[4].className = "next";

  // přidáme nový prvek vpravo
  const newItem = createItem(products[getIndex(currentIndex + 2)].image);
  newItem.className = "new-next";
  list.appendChild(newItem);
}

function prev() {
  currentIndex = getIndex(currentIndex - 1);

  const list = $(".carousel-list");
  const items = $$(".carousel-list li");

  // odstraníme poslední (vpravo mimo scénu)
  items[4].remove();
  items[3].className = "new-next";
  items[2].className = "next";
  items[1].className = "act";
  items[0].className = "prev";

  // přidáme nový prvek vlevo
  const newItem = createItem(products[getIndex(currentIndex - 2)].image);
  newItem.className = "hide";
  list.insertBefore(newItem, list.firstChild);
}

// === 4️⃣ Pomocné funkce ===
function createItem(imgUrl) {
  const li = document.createElement("li");
  li.style.backgroundImage = `url(${imgUrl})`;
  return li;
}

function getIndex(i) {
  const len = products.length;
  return (i + len) % len; // cyklické otáčení indexu
}

// === 5️⃣ Aktivace ovládání ===
function activateCarousel() {
  const slider = $(".carousel-list");
  const swipe = new Hammer($(".swipe"));

  slider.onclick = (e) => {
    if (e.target.classList.contains("next")) next();
    else if (e.target.classList.contains("prev")) prev();
  };

  swipe.on("swipeleft", () => next());
  swipe.on("swiperight", () => prev());
}
