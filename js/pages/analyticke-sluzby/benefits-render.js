// ==================================================
// GENETIA – Benefits Render (Analytické služby)
// ▸ Renderuje benefit sekce z /data/benefits.json
// ▸ Střídá layout (reverse) po sekcích
// ▸ Po renderu volá lucide.createIcons()
// ==================================================

export async function initBenefitsRender() {
  const mount = document.getElementById("benefitsMount");
  if (!mount) return;

  let data;
  try {
    const res = await fetch("data/benefits.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`benefits.json fetch failed: ${res.status}`);
    data = await res.json();
  } catch (err) {
    console.warn("⚠️ Benefits render: nepodařilo se načíst benefits.json", err);
    return;
  }

  const benefits = Array.isArray(data?.benefits) ? data.benefits : [];
  if (!benefits.length) return;

  const html = benefits
    .map((b, index) => {
      const isReverse = index % 2 === 1;

      const id = String(b.id || "").trim();
      const icon = String(b.icon || "").trim();
      const title = String(b.title || "").trim();
      const subtitle = String(b.subtitle || "").trim();

      const details = Array.isArray(b.details) ? b.details : [];
      const image = String(b.image || "").trim();
      const imageAltRaw = String(b.imageAlt || "").trim();
      const imageAlt =
        imageAltRaw ||
        (title ? `Ilustrační fotografie: ${title}` : "Ilustrační fotografie");

      // Hook class pro cardHover.js (můžeš si napojit selektor)
      const kickerCardClass = "benefit-kickerCard js-card-hover ";

      return `
  <section id="${escapeAttr(id)}"
           class="benefit-section section-fade-bottom benefit-section--${escapeAttr(
             id.replace("benefit-", "")
           )}">
    <div class="container">
      <div class="benefit-grid ${isReverse ? "benefit-grid--reverse" : ""}">

        <div class="benefit-text">
          
          <div class="benefit-kicker " >
            <i data-lucide="${escapeAttr(icon)}" aria-hidden="true"></i>
          </div>

          <h2 class="benefit-title">${escapeHtml(title)}</h2>
          <p class="benefit-subtitle">${escapeHtml(subtitle)}</p>

          ${
            details.length
              ? `<ul class="benefit-list">
                  ${details
                    .map((li) => `<li>${escapeHtml(String(li))}</li>`)
                    .join("")}
                </ul>`
              : ""
          }
        </div>

        <div class="benefit-media">
          <figure class="benefit-mediaFrame ">
            ${
              image
                ? `<img class="benefit-image "
                        src="assets/images/benefits/${escapeAttr(image)}"
                        alt="${escapeAttr(imageAlt)}"
                        loading="lazy"
                        decoding="async">`
                : `<div class="benefit-placeholder" aria-hidden="true"></div>`
            }
          </figure>
        </div>

      </div>
    </div>
  </section>
`;
    })
    .join("");

  mount.innerHTML = html;

  // Lucide ikony (pokud je globálně dostupné)
  if (window.lucide?.createIcons) {
    window.lucide.createIcons();
  }
}

/* =========================
   Utils – safe escaping
========================= */

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(str) {
  // pro atributy (id, alt, data-lucide)
  return escapeHtml(str).replaceAll("`", "&#096;");
}
