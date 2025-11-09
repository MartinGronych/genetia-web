// ==================================================
// GENETIA – FAQ Smooth Accordion (Final v4.0)
// Autor: Martin Gronych
// --------------------------------------------------
// ▸ Plné animace otevření i zavření
// ▸ Fade + slide efekt
// ▸ Auto-close ostatních (accordion behavior)
// ==================================================

export function initFaqFade() {
  const details = document.querySelectorAll('#faq details');
  if (!details.length) return;

  details.forEach((el) => {
    const summary = el.querySelector('summary');
    const content = el.querySelector('p');

    summary.addEventListener('click', (e) => {
      e.preventDefault();

      const isOpen = el.hasAttribute('open');
      const currentHeight = content.scrollHeight;

      // Zavřít ostatní
      details.forEach((other) => {
        if (other !== el && other.hasAttribute('open')) {
          closeDetails(other);
        }
      });

      if (!isOpen) {
        openDetails(el, currentHeight);
      } else {
        closeDetails(el);
      }
    });
  });

  // === Pomocné funkce ===
  function openDetails(el, height) {
    const content = el.querySelector('p');
    el.setAttribute('open', true);
    content.style.maxHeight = `${height}px`;
    content.style.opacity = '1';
    el.classList.add('active');
    setTimeout(() => {
      content.style.maxHeight = '1000px'; // zaručí plynulé otevření
    }, 10);
  }

  function closeDetails(el) {
    const content = el.querySelector('p');
    const height = content.scrollHeight;

    content.style.maxHeight = `${height}px`; // fix aktuální výšky
    requestAnimationFrame(() => {
      content.style.maxHeight = '0';
      content.style.opacity = '0';
    });

    el.classList.remove('active');
    setTimeout(() => {
      el.removeAttribute('open');
      content.style.maxHeight = '';
    }, 450);
  }

  console.log("💬 FAQ Smooth Accordion inicializován");
}
