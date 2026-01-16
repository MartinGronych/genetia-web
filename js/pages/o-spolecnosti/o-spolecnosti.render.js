// =====================================
// GENETIA – About Company (shared render)
// Autor: Martin Gronych
// -------------------------------------
// Použití:
// - homepage
// - o-spolecnosti.html
// =====================================

export function renderAboutCompany(targetSelector) {
  const mount = document.querySelector(targetSelector);
  if (!mount) return;

  mount.innerHTML = `
    <section class="about-company-section">
    <!-- ======
     HERO SEKCE
    =========== -->
    <section class="hero-section">
      <!-- 🎬 Lokální video pozadí -->
      <div class="hero-video-wrapper">
        <video
          class="hero-video"
          src="assets/video/Genetia_home.webm"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
        ></video>
      </div>

      <div class="container">
        <div class="hero-content text-center">
          <h1>
            Farmaceutická kvalita<br class="hero-br" />
            v oblasti léčebného konopí
          </h1>

          <p class="hero-lead">
            Jsme spolehlivý partner v oblasti výzkumu, výroby a analýz účinných
            látek pro léčebné účely. Naše procesy splňují standardy EU-GMP.
          </p>
        </div>
      </div>
    </section>
    <!-- ================================
     SEKCE 2 – SLUŽBY / TESTOVÁNÍ – API – LÉKÁRNY
     (homepage – izolovaná sekce)
================================= -->
    <section class="section services-section bg-light home-services">
      <div class="container text-center">
        <div class="row g-4">
          <!-- Analytické testování -->
          <div class="col-md-4">
            <div class="service-card p-4 border rounded-4 h-100 " data-hover-card>
              <h5 class="service-card_title fw-semibold mb-2">
                Analytické testování
              </h5>
              <p class="service-card_text small text-secondary mb-3">
                Komplexní analýzy kanabinoidů, terpenů, pesticidů, těžkých kovů
                a mikrobiologie.
              </p>
              <a
                href="analyticke-sluzby.html"
                class="btn btn-brand service-card_cta"
              >
                Více o službě
              </a>
            </div>
          </div>

          <!-- Vývoj & výroba API -->
          <div class="col-md-4">
            <div class="service-card p-4 border rounded-4 h-100" data-hover-card>
              <h5 class="service-card_title fw-semibold mb-2">
                Vývoj &amp; výroba API
              </h5>
              <p class="service-card_text small text-secondary mb-3">
                Formulace a výroba aktivních farmaceutických složek (THC, CBD,
                CBG) dle EU-GMP.
              </p>
              <a
                href="vyvoj-vyzkum.html"
                class="btn btn-brand service-card_cta"
              >
                Zjistit více
              </a>
            </div>
          </div>

          <!-- Produkty pro lékárny -->
          <div class="col-md-4">
            <div class="service-card p-4 border rounded-4 h-100 " data-hover-card> 
              <h5 class="service-card_title fw-semibold mb-2">
                Produkty pro lékárny
              </h5>
              <p class="service-card_text small text-secondary mb-3">
                Standardizované olejové extrakty a přípravky dostupné pro
                lékárny a pacienty.
              </p>
              <a
                href="produkty.html#lekarny"
                class="btn btn-brand service-card_cta"
              >
                Nabídka produktů
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="uspHP-image-wrapper-sklo">
        <img
          src="assets/images/products/laboratorni_sklo.webp"
          alt="Laboratorní vybavení Genetia"
          class="uspHP-image"
          loading="lazy"
        />
      </div>
    </section>
    <!-- ================================
     SEKCE 3 – USP / PROČ GENETIA PRODUCTION
    =================================== -->
    <section class="usp-section" data-usp-production>
      <div class="container text-center" id="uspProductionMount"></div>
    </section>
    <!-- ================================
     SEKCE 4 – PRODUKTY (CAROUSEL)
    =================================== -->
    <section class="products-carousel-section">
      <div class="container text-center">
        <h2>Naše produkty pro lékárny</h2>
        <p class="section-desc">
          Standardizované léčebné extrakty a formulace připravené pro
          distribuci.
        </p>

        <!-- Carousel -->
        <ul class="carousel-list"></ul>

        <!-- Ikona oka pro odemknutí obsahu -->
        <div class="carousel-lock"></div>

        <!-- Swipe zóna -->
        <div class="swipe"></div>
      </div>
    </section>

      <!-- ==========================
     SEKCE 5 / KONTAKT & SPOLUPRÁCE 
    ===============================-->
    <section class="contact-section py-5 bg-light">
      <div class="container">
        <div class="row g-5 align-items-start align-items-lg-center">
          <!-- Levý blok: text + kontakty -->
          <div class="col-lg-5">
            <h2 class="fw-bold mb-3">Zaujala vás naše práce?</h2>
            <p class="text-muted mb-4">
              Napište nám ohledně spolupráce, testování nebo vývoje produktů.
              <strong>Ozveme se nejpozději následující pracovní den.</strong>
            </p>
            <ul class="contact-info list-unstyled">
              <li class="mb-2">
                <strong>E-mail:</strong>
                <a href="mailto:info@genetia.cz" class="text-decoration-none"
                  >info@genetia.cz</a
                >
              </li>
              <li class="mb-2">
                <strong>Telefon:</strong>
                <a href="tel:+420777123456" class="text-decoration-none"
                  >+420 777 123 456</a
                >
              </li>
              <li>
                <strong>Sídlo:</strong> Inovační 122, 252 41 Zlatníky-Hodkovice,
                Česká republika
              </li>
            </ul>
          </div>

          <!-- Pravý blok: formulář (AJAX-ready) -->
          <div class="col-lg-7">
            <form
              id="contactForm"
              class="contact-form card-base p-4 shadow-sm"
              method="POST"
              data-endpoint="https://formspree.io/f/mdkyngvb"
            >
              <!-- Honeypot (antispam) -->
              <input
                type="text"
                name="_gotcha"
                tabindex="-1"
                autocomplete="off"
                style="position: absolute; left: -9999px"
                aria-hidden="true"
              />

              <div class="row g-3">
                <!-- Jméno -->
                <div class="col-md-6">
                  <input
                    type="text"
                    class="form-control"
                    name="name"
                    placeholder="Jméno a příjmení"
                    autocomplete="name"
                    required
                  />
                </div>

                <!-- E-mail -->
                <div class="col-md-6">
                  <input
                    type="email"
                    class="form-control"
                    name="_replyto"
                    placeholder="E-mail"
                    autocomplete="email"
                    required
                  />
                </div>

                <!-- Předmět -->
                <div class="col-12">
                  <input
                    type="text"
                    class="form-control"
                    name="subject"
                    placeholder="Předmět zprávy (volitelné)"
                    autocomplete="off"
                  />
                </div>

                <!-- Zpráva -->
                <div class="col-12">
                  <textarea
                    class="form-control"
                    name="message"
                    rows="5"
                    placeholder="Vaše zpráva..."
                    required
                  ></textarea>
                </div>

                <!-- Odeslání formuláře -->
<div class="col-12 text-end">
  <button class="btn btn-accent px-4 py-2" type="submit">
    Odeslat zprávu
  </button>
</div>

<!-- reCAPTCHA v3 notice (Google requirement) -->
<div class="col-12">
  <div class="recaptcha-notice">
    Tato stránka je chráněna pomocí reCAPTCHA a platí
    <a
      href="https://policies.google.com/privacy"
      target="_blank"
      rel="noopener noreferrer"
    >
      Zásady ochrany osobních údajů
    </a>
    a
    <a
      href="https://policies.google.com/terms"
      target="_blank"
      rel="noopener noreferrer"
    >
      Podmínky služby
    </a>
    společnosti Google.
  </div>
</div>

<!-- Inline fallback místo modalu -->
<div class="col-12">
  <div
    id="formInlineMessage"
    class="form-inline-message"
    hidden
  ></div>
</div>


                <!-- Inline fallback místo modalu -->
                <div class="col-12">
                  <div
                    id="formInlineMessage"
                    class="form-inline-message"
                    hidden
                  ></div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  `;
}
