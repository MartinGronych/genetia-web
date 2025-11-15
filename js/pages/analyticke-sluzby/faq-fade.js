// ==================================================
// GENETIA – FAQ Smooth Accordion (Final v4.0)
// Autor: Martin Gronych
// --------------------------------------------------
// ▸ Plné animace otevření i zavření
// ▸ Fade + slide efekt
// ▸ Auto-close ostatních (accordion behavior)
// ==================================================

export function initFaqFade() {
  const items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  items.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Zavřít všechny ostatní
      items.forEach((other) => {
        if (other !== item) closeItem(other);
      });

      if (isOpen) closeItem(item);
      else openItem(item);
    });
  });

  function openItem(item) {
    const answer = item.querySelector(".faq-answer");
    item.classList.add("open");

    answer.style.display = "block";
    const height = answer.scrollHeight + "px";

    requestAnimationFrame(() => {
      answer.style.maxHeight = height;
      answer.style.opacity = "1";
    });
  }

  function closeItem(item) {
    const answer = item.querySelector(".faq-answer");
    const height = answer.scrollHeight + "px";

    answer.style.maxHeight = height;
    answer.style.opacity = "1";

    requestAnimationFrame(() => {
      answer.style.maxHeight = "0";
      answer.style.opacity = "0";
    });

    item.classList.remove("open");

    answer.addEventListener(
      "transitionend",
      () => {
        if (!item.classList.contains("open")) {
          answer.style.display = "none";
        }
      },
      { once: true }
    );
  }

  console.log("💬 FAQ Accordion inicializován");
}