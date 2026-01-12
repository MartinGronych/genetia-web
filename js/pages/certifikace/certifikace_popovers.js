// ==================================================
// GENETIA – Certifikace → Popovers (anchored, not modal)
// - data load on init: /data/certifikace.json
// - fallback when JSON item missing (so cards always work)
// ==================================================

let CERT_DATA = { items: {} };

export async function initCertifikacePopovers() {
  const cards = Array.from(document.querySelectorAll("[data-cert-card]"));
  const popover = document.getElementById("certPopover");

  if (!cards.length || !popover) {
    console.warn("[CERTIFIKACE][popovers] prerequisites missing");
    return;
  }

  await loadCertifikaceData();

  const closeBtn = popover.querySelector("[data-popover-close]");

  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      togglePopover(card, popover, cards);
    });
  });

  closeBtn?.addEventListener("click", () => closePopover(popover, cards));

  document.addEventListener("click", (e) => {
    const clickedCard = e.target.closest("[data-cert-card]");
    if (!clickedCard && !popover.contains(e.target)) {
      closePopover(popover, cards);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePopover(popover, cards);
  });

  const repositionIfOpen = () => {
    if (popover.dataset.open !== "true") return;
    const activeCard = document.querySelector('[data-cert-card][aria-expanded="true"]');
    if (activeCard) positionPopover(activeCard, popover);
  };

  window.addEventListener("scroll", repositionIfOpen, { passive: true });
  window.addEventListener("resize", repositionIfOpen);

  cards.forEach((c) => c.setAttribute("aria-expanded", "false"));
}

// --------------------------------------------------
// DATA
// --------------------------------------------------
async function loadCertifikaceData() {
  try {
    const res = await fetch("/data/certifikace.json", { cache: "force-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    CERT_DATA = await res.json();
    if (!CERT_DATA?.items) CERT_DATA.items = {};
  } catch (err) {
    console.error("[CERTIFIKACE][popovers] JSON load failed:", err);
    CERT_DATA = { items: {} };
  }
}

// --------------------------------------------------
// TOGGLE / OPEN / CLOSE
// --------------------------------------------------
function togglePopover(card, popover, cards) {
  const isOpen = popover.dataset.open === "true";
  const activeCard = document.querySelector('[data-cert-card][aria-expanded="true"]');

  if (isOpen && activeCard === card) {
    closePopover(popover, cards);
    return;
  }

  openPopover(card, popover, cards);
}

function openPopover(card, popover, cards) {
  const certId = card.dataset.certId;

  // 1) try JSON
  let data = CERT_DATA?.items?.[certId];

  // 2) fallback: build from card DOM if JSON missing
  if (!data) {
    console.warn(
      "[CERTIFIKACE][popovers] missing JSON item for:",
      certId,
      "→ using fallback from card content"
    );
    data = buildFallbackDataFromCard(card, certId);
  }

  fillPopover(popover, data);

  cards.forEach((c) => c.setAttribute("aria-expanded", "false"));
  card.setAttribute("aria-expanded", "true");

  popover.dataset.open = "true";
  popover.setAttribute("aria-hidden", "false");

  positionPopover(card, popover);

  if (window.lucide) window.lucide.createIcons();
}

function closePopover(popover, cards) {
  popover.dataset.open = "false";
  popover.setAttribute("aria-hidden", "true");
  cards.forEach((c) => c.setAttribute("aria-expanded", "false"));
}

// --------------------------------------------------
// CONTENT
// Expected data:
// { title, meta, description, icon }
// --------------------------------------------------
function fillPopover(popover, data) {
  const titleEl = popover.querySelector("#certPopoverTitle");
  const metaEl = popover.querySelector("#certPopoverMeta");
  const textEl = popover.querySelector("#certPopoverText");

  if (titleEl) titleEl.textContent = data.title ?? "";
  if (metaEl) metaEl.textContent = data.meta ?? "";
  if (textEl) textEl.textContent = data.description ?? "";

  // icon swap (lucide)
  const iconI = popover.querySelector(".cert-popover_icon i");
  if (iconI && data.icon) iconI.setAttribute("data-lucide", data.icon);
}

// fallback builder
function buildFallbackDataFromCard(card, certId) {
  const title = card.querySelector(".cert-card_title")?.textContent?.trim() || certId || "";
  const description = card.querySelector(".cert-card_desc")?.textContent?.trim() || "";
  const metaBase = card.querySelector(".cert-card_meta")?.textContent?.trim() || "CERTIFIKACE";

  // z badge vytáhneme "GMP 1/2" a případně další
  const badges = Array.from(card.querySelectorAll(".cert-badge"))
    .map((b) => b.textContent.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const gmp = badges.find((t) => t.toUpperCase().includes("GMP")) || "";
  const meta = gmp ? `${metaBase} • ${gmp}` : metaBase;

  // ikonku vezmeme z karty
  const cardIcon = card.querySelector(".cert-card_icon i")?.getAttribute("data-lucide") || "award";

  return { title, meta, description, icon: cardIcon };
}

// --------------------------------------------------
// POSITIONING (anchored popover + arrow)
// --------------------------------------------------
function positionPopover(card, popover) {
  requestAnimationFrame(() => {
    const cardRect = card.getBoundingClientRect();
    const popRect = popover.getBoundingClientRect();

    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    const spaceAbove = cardRect.top;
    const spaceBelow = window.innerHeight - cardRect.bottom;

    let placement = "top";
    const needed = popRect.height + 18;

    if (spaceAbove < needed && spaceBelow > spaceAbove) placement = "bottom";

    let top =
      placement === "top"
        ? cardRect.top + scrollY - popRect.height - 14
        : cardRect.bottom + scrollY + 14;

    let left = cardRect.left + scrollX + cardRect.width / 2 - popRect.width / 2;

    const padding = 12;
    const maxLeft = document.documentElement.clientWidth - popRect.width - padding;
    left = Math.max(padding, Math.min(left, maxLeft));

    popover.style.top = `${top}px`;
    popover.style.left = `${left}px`;
    popover.dataset.placement = placement;

    // arrow alignment
    const arrow = popover.querySelector(".cert-popover_arrow");
    if (arrow) {
      const cardCenterX = cardRect.left + cardRect.width / 2 + scrollX;
      const popLeft = left;
      let arrowLeft = cardCenterX - popLeft - 7; // 14px arrow → half
      arrowLeft = Math.max(18, Math.min(arrowLeft, popRect.width - 18));
      arrow.style.left = `${arrowLeft}px`;
    }
  });
}
