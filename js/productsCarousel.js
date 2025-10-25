// ==================================================
// GENETIA – PRODUCTS CAROUSEL MODULE (Fixed structure)
// --------------------------------------------------
// ▸ Načítá produkty z JSON a vkládá <img> + <figcaption>
// ▸ Struktura odpovídá CSS – obrázky přímo ve <figure>
// ▸ Ovládání: myš, dotyk, šipky
// ==================================================

export async function initProductsCarousel() {
  const carouselContainer = document.getElementById("products-carousel");
  const JSON_URL = "../data/products.json";

  if (!carouselContainer) return;

  try {
    const response = await fetch(JSON_URL);
    const products = await response.json();

    // === 1️⃣ Vytvoření figure s obrázky a popisky ===
    const imagesHTML = products
      .slice(0, 4)
      .map(
        (product) => `
          <img 
            src="${product.image}" 
            alt="${product.title}" 
            title="${product.title}"
            data-link="${product.link}" 
          />
          <figcaption class="caption-item">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
          </figcaption>
        `
      )
      .join("");

    carouselContainer.innerHTML = imagesHTML;

    // === 2️⃣ Kliknutí na obrázek → přechod ===
    carouselContainer.querySelectorAll("img").forEach((img) => {
      img.addEventListener("click", () => {
        const link = img.dataset.link;
        if (link) window.location.href = link;
      });
    });

    // === 3️⃣ Aktivace ovládání ===
    enableCarouselControls();
  } catch (err) {
    console.error("❌ Chyba při načítání produktů:", err);
    carouselContainer.innerHTML =
      "<p class='text-danger'>Nepodařilo se načíst produkty.</p>";
  }
}

// ==================================================
// 🖱️ + 🤚 Interaktivní ovládání (myš + dotyk + klávesnice)
// ==================================================
let isDragging = false;
let startX = 0;
let currentRotation = 0;

function enableCarouselControls() {
  const carousel = document.querySelector(".carousel figure");
  if (!carousel) return;

  // 🖱️ Myš
  carousel.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    carousel.style.animationPlayState = "paused";
  });
  window.addEventListener("mouseup", () => (isDragging = false));
  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const delta = e.clientX - startX;
    startX = e.clientX;
    currentRotation += delta * 0.3;
    carousel.style.transform = `rotateY(${currentRotation}deg)`;
  });

  // 🤚 Dotyk
  carousel.addEventListener("touchstart", (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    carousel.style.animationPlayState = "paused";
  });
  window.addEventListener("touchend", () => (isDragging = false));
  window.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientX - startX;
    startX = e.touches[0].clientX;
    currentRotation += delta * 0.3;
    carousel.style.transform = `rotateY(${currentRotation}deg)`;
  });

  // 🎹 Klávesnice
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") currentRotation -= 45;
    else if (e.key === "ArrowRight") currentRotation += 45;
    else return;
    carousel.style.animationPlayState = "paused";
    carousel.style.transform = `rotateY(${currentRotation}deg)`;
  });
}

document.addEventListener("DOMContentLoaded", initProductsCarousel);
