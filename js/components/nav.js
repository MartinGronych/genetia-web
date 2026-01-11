// ==================================================
// GENETIA – Navigation (JS-driven items only)
// Renders items into #navDesktopList and #navMobileList
// ==================================================

function normalizePath(p) {
  if (!p) return "/";
  // strip query/hash
  const clean = p.split("#")[0].split("?")[0];
  return clean;
}

function isActiveLink(href) {
  const current = normalizePath(window.location.pathname);
  const target = normalizePath(href);

  // handle index.html vs root
  const currentIsHome = current === "/" || current.endsWith("/index.html");
  const targetIsHome = target === "/" || target.endsWith("/index.html");

  if (currentIsHome && targetIsHome) return true;

  // exact match (works for /repo/page.html too)
  return current.endsWith(target);
}

function createNavItem({ label, href, external }) {
  const li = document.createElement("li");
  li.className = "nav-item";

  const a = document.createElement("a");
  a.className = "nav-link";
  a.textContent = label ?? "";
  a.href = href ?? "#";

  if (external) {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }

  if (href && isActiveLink(href)) {
    a.classList.add("active");
    a.setAttribute("aria-current", "page");
  }

  li.appendChild(a);
  return li;
}

function pickItems(payload) {
  // toleruje různé tvary: { items: [...] } / { nav: [...] } / { links: [...] } / [...]
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const candidates = [payload.items, payload.nav, payload.links, payload.menu];
  const found = candidates.find((x) => Array.isArray(x));
  if (found) return found;

  // fallback: najdi první pole objektů s "href"
  for (const v of Object.values(payload)) {
    if (
      Array.isArray(v) &&
      v.some((it) => it && typeof it === "object" && "href" in it)
    ) {
      return v;
    }
  }
  return [];
}

async function loadNavData() {
  const url = new URL("data/nav.json", document.baseURI); // funguje i na GH Pages / v subpath
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`nav.json fetch failed: ${res.status}`);
  return res.json();
}

function renderList(listEl, items) {
  listEl.innerHTML = "";
  items.forEach((it) => {
    // podporujeme { label, href } i { title, url }
    const label = it.label ?? it.title ?? it.text ?? "";
    const href = it.href ?? it.url ?? it.path ?? "#";
    const external = Boolean(it.external);

    // ignoruj nevalidní položky
    if (!label || !href) return;

    listEl.appendChild(createNavItem({ label, href, external }));
  });
}

export async function initNav() {
  const desktopList = document.getElementById("navDesktopList");
  const mobileList = document.getElementById("navMobileList");

  // pokud stránka nemá nav (nebo ještě není upravená), nic nedělej
  if (!desktopList && !mobileList) return;

  // --------------------------------------------------
  // Theme switch: single element, moved between mobile panel and desktop nav
  // --------------------------------------------------
  function mountThemeSwitch() {
    const desktopListEl = document.getElementById("navDesktopList");
    const mobileSlot = document.querySelector(".mobile-nav_theme");
    const switchLabel = document.querySelector(".mobile-nav_theme .theme-switch");

    if (!desktopListEl || !mobileSlot || !switchLabel) return;

    const mq = window.matchMedia("(min-width: 1024px)");

    const ensureDesktopItem = () => {
      let li = desktopListEl.querySelector("li.nav-item--theme");
      if (!li) {
        li = document.createElement("li");
        li.className = "nav-item nav-item--theme";
        desktopListEl.appendChild(li);
      }
      return li;
    };

    const move = () => {
      if (mq.matches) {
        const li = ensureDesktopItem();
        li.appendChild(switchLabel);
      } else {
        mobileSlot.appendChild(switchLabel);
        const li = desktopListEl.querySelector("li.nav-item--theme");
        if (li && !li.hasChildNodes()) li.remove();
      }
    };

    move();
    mq.addEventListener?.("change", move);
    mq.addListener?.(move); // fallback older Safari
  }

  try {
    const data = await loadNavData();
    const items = pickItems(data);

    if (desktopList) renderList(desktopList, items);
    if (mobileList) renderList(mobileList, items);

    // po renderu menu přesuneme switch podle breakpointu
    mountThemeSwitch();
  } catch (err) {
    console.warn("[nav] failed to init:", err);
  }
}

