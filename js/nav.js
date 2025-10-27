// ==================================================
// GENETIA NAVIGATION BUILDER (Final Clean Module)
// --------------------------------------------------
// Modul pro načtení a generování navigace z JSON
// ==================================================

export async function initNavigation() {
  const NAV_JSON = "data/nav.json";

  // Selektory navigačních kontejnerů
  const desktopMenu = document.querySelector(".navbar-nav.text-center.gap-4");
  

  // Pokud chybí navigační kontejnery, ukonči funkci
  if (!desktopMenu && !mobileMenu) return;

  try {
    // Načtení dat z JSON
    const response = await fetch(NAV_JSON);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const items = await response.json();

    // Vygenerování HTML odkazů
    const navHTML = items
      .map(
        (item) => `
          <li class="nav-item">
            <a class="nav-link" href="${item.href}" data-href="${item.href}">
              ${item.title}
            </a>
          </li>`
      )
      .join("");

    // Naplnění navigací (desktop + mobil)
    if (desktopMenu && !desktopMenu.innerHTML.trim()) {
      desktopMenu.innerHTML = navHTML;
    }
    if (mobileMenu && !mobileMenu.innerHTML.trim()) {
      mobileMenu.innerHTML = navHTML;
    }

    // Označení aktivní položky podle URL
    const path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link[data-href]").forEach((a) => {
      const href = a.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      }
    });
  } catch (err) {
    console.error("❌ Navigace se nepodařila načíst:", err);
  }
}
