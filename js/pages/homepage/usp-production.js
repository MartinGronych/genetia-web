// ==================================================
// GENETIA – USP Production (rendered from JS)
// ==================================================

const USP_PRODUCTION_DATA = {
  title: "Proč si vybrat Genetia Production",
  intro:
    "Výroba dle farmaceutických standardů, vědecký přístup a flexibilita nám umožňují dodávat produkty nejvyšší kvality s důrazem na bezpečnost a inovaci.",

  // LEFT COLUMN (WHY)
  whyItems: [
    {
      icon: "badge-check",
      title: "Certifikace GMP I a GMP II",
      text:
        "Naše výroba probíhá podle nejvyšších evropských farmaceutických standardů, což zaručuje plnou sledovatelnost, konzistenci a bezpečnost každé šarže.",
    },
    {
      icon: "handshake",
      title: "Spolupráce s regulačními orgány a akademickou sférou",
      text:
        "Aktivně spolupracujeme s regulačními institucemi, univerzitami a výzkumnými centry, abychom byli vždy krok před legislativními změnami.",
    },
    {
      icon: "microscope",
      title: "Vlastní výzkum a vývoj",
      text:
        "Disponujeme interním oddělením R&D, které se zaměřuje na nové extrakční technologie, optimalizaci formulací kanabinoidů a stabilitu produktů.",
    },
    {
      icon: "zap",
      title: "Rychlost a flexibilita",
      text:
        "Díky propojení všech procesů pod jednou střechou dokážeme nabídnout krátké dodací lhůty a individuální přístup od návrhu po sériovou výrobu.",
    },
    {
      icon: "flask-conical",
      title: "Kvalita podložená vědou",
      text:
        "Každý produkt prochází důkladnou analytickou kontrolou s validovanými postupy. Garantujeme farmaceutickou jistotu v každém miligramu.",
    },
  ],

  // RIGHT COLUMN (HOW)
  howItems: [
    {
      step: "01",
      icon: "test-tube-diagonal",
      title: "Výzkum a vývoj",
      text:
        "Interní výzkum a vývoj zaměřený na stabilitu, čistotu a reprodukovatelnost výsledků.",
    },
    {
      step: "02",
      icon: "shield-check",
      title: "Certifikace a regulace",
      text:
        "Procesy odpovídající EU-GMP a aktivní komunikace s regulačními orgány.",
    },
    {
      step: "03",
      icon: "factory",
      title: "Výroba a škálování",
      text:
        "Škálovatelná výroba s důrazem na konzistenci šarží a kontrolu kvality.",
    },
    {
      step: "04",
      icon: "flask-conical",
      title: "Analytická kontrola",
      text: "Validované analytické metody a dokumentace každého kroku.",
    },
    {
      step: "05",
      icon: "package-check",
      title: "Uvolnění a distribuce",
      text:
        "Finální kontrola, uvolnění produktu a příprava pro distribuční praxi.",
    },
  ],
};

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function initUspProduction() {
  const mount = document.getElementById("uspProductionMount");
  if (!mount) return;

  const { title, intro, whyItems, howItems } = USP_PRODUCTION_DATA;

  mount.innerHTML = `
    <div class="usp-prod_layout">

      <!-- LEFT COLUMN: WHY -->
      <div class="usp-prod_why">
        <h2 class="fw-bold mb-4">${escapeHtml(title)}</h2>
        <p class="text-secondary mb-4 section-intro">
          ${escapeHtml(intro)}
        </p>
        <div class="usp-prod_why-card">
            <div class="usp-prod_why-list">
    
            ${whyItems
                .map(
                (it) => `
                <div class="usp-prod_why-item">
                    <div class="usp-prod_why-icon" aria-hidden="true">
                    <i data-lucide="${escapeHtml(it.icon)}"></i>
                    </div>
                    <div class="usp-prod_why-body">
                    <h5 class="usp-prod_why-title">${escapeHtml(it.title)}</h5>
                    <p class="usp-prod_why-text">${escapeHtml(it.text)}</p>
                    </div>
                </div>
                `
                )
                .join("")}
            </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: HOW -->
      <div class="usp-prod_how">
        <h3 class="usp-prod_how-title">Jak pracujeme</h3>
        <p class="usp-prod_how-intro">
          Postup, který zajišťuje konzistentní kvalitu a plnou kontrolu nad výrobou.
        </p>

        <div class="usp-prod_timeline">
          ${howItems
            .map(
              (it) => `
              <div class="usp-prod_step">
                <div class="usp-prod_step-badge">
                  <div class="usp-prod_step-num">#${escapeHtml(it.step)}</div>
                  <div class="usp-prod_step-dot" aria-hidden="true"></div>
                </div>

                <div class="usp-prod_step-content">
                  <div class="usp-prod_step-head">
                    <span class="usp-prod_step-ico" aria-hidden="true">
                      <i data-lucide="${escapeHtml(it.icon)}"></i>
                    </span>
                    <h5>${escapeHtml(it.title)}</h5>
                  </div>
                  <p>${escapeHtml(it.text)}</p>
                </div>
              </div>
            `
            )
            .join("")}
        </div>
      </div>

    </div>
  `;

  // Timeline reveal + hide (při scrollu dolů i nahoru)
  const steps = Array.from(mount.querySelectorAll(".usp-prod_step"));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    steps.forEach((el) => el.classList.add("is-visible"));
  } else {
    const getDelayMs = (el) => {
      const idx = steps.indexOf(el);
      return Math.max(0, idx) * 120;
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const el = e.target;

          if (e.isIntersecting) {
            el.style.transitionDelay = `${getDelayMs(el)}ms`;
            el.classList.add("is-visible");
          } else {
            el.style.transitionDelay = "0ms";
            el.classList.remove("is-visible");
          }
        });
      },
      {
        threshold: 0.35,
        rootMargin: "0px 0px -18% 0px",
      }
    );

    steps.forEach((el) => io.observe(el));
  }

  // Lucide init/re-init after render
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}
