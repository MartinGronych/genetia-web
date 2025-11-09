// === GENETIA FORM – AJAX + reCAPTCHA + Dynamic Modal ===
// Autor: Martin Gronych

export function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  // === 1️⃣ Načtení reCAPTCHA ===
  const DEV_KEY = "6LdFQAcsAAAAAPTHbTzxbswwTps-9u9B4QpM8G0l";

  // Prod klíč načti z <meta name="recaptcha-key" content="..."> nebo z window.__RECAPTCHA_KEY__
  const PROD_KEY =
    document.querySelector('meta[name="recaptcha-key"]')?.content ||
    window.__RECAPTCHA_KEY__ ||
    "";

  const hostname = window.location.hostname;
  const SITE_KEY =
    hostname === "localhost" || hostname === "127.0.0.1"
      ? DEV_KEY
      : PROD_KEY;

  if (!SITE_KEY) {
    console.error("❌ Nebyl nalezen žádný reCAPTCHA key!");
    return;
  }

  function loadRecaptcha(callback) {
    if (typeof grecaptcha !== "undefined") {
      callback();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log("✅ reCAPTCHA načtena s klíčem:", SITE_KEY.slice(0, 8) + "…");
      callback();
    };
    document.head.appendChild(script);
  }

  // === 2️⃣ MODAL GENERÁTOR ===
  const createModal = (type, title, message) => {
    const overlay = document.createElement("div");
    overlay.className = "form-modal-overlay show";

    const box = document.createElement("div");
    box.className = `form-modal-box ${type}`;

    const icon = document.createElement("div");
    icon.className = "form-modal-icon";
    icon.textContent = type === "success" ? "✅" : "⚠️";

    const h4 = document.createElement("h4");
    h4.textContent = title;

    const p = document.createElement("p");
    p.textContent = message;

    const button = document.createElement("button");
    button.className = "btn btn-accent mt-2";
    button.textContent = "Zavřít";

    box.append(icon, h4, p, button);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const closeModal = () => {
      overlay.classList.remove("show");
      setTimeout(() => overlay.remove(), 250);
    };
    button.addEventListener("click", closeModal);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
  };

  // === 3️⃣ HANDLER ODESLÁNÍ ===
  async function handleSubmit(event) {
    event.preventDefault();
    const endpoint = form.dataset.endpoint || form.action;
    const button = form.querySelector("button[type='submit']");
    const originalText = button.textContent;

    button.disabled = true;
    button.textContent = "Odesílám...";

    if (typeof grecaptcha === "undefined") {
      console.error("❌ reCAPTCHA není načtena – opakuji pokus");
      loadRecaptcha(() => handleSubmit(event));
      return;
    }

    try {
      await new Promise((resolve) => grecaptcha.ready(resolve));
      const token = await grecaptcha.execute(SITE_KEY, { action: "submit" });

      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "g-recaptcha-response";
      input.value = token;
      form.appendChild(input);

      const data = new FormData(form);
      const response = await fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      let resultText = "";
      try {
        resultText = await response.text();
        console.log("Formspree response:", resultText || "✅ 204 No Content");
      } catch {
        console.log("Formspree: žádné tělo odpovědi");
      }

      if (response.ok) {
        createModal(
          "success",
          "Děkujeme za zprávu!",
          "Vaše zpráva byla úspěšně odeslána. Ozveme se vám co nejdříve."
        );
        form.reset();
      } else {
        createModal(
          "error",
          "Odeslání se nezdařilo",
          "Formulář se nepodařilo odeslat. Zkuste to prosím znovu."
        );
      }
    } catch (error) {
      console.error("⚠️ Form submit error:", error);
      createModal(
        "error",
        "Chyba připojení",
        "Nastala neočekávaná chyba při odesílání. Zkontrolujte připojení a zkuste to znovu."
      );
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  }

  // === 4️⃣ Inicializace ===
  loadRecaptcha(() => form.addEventListener("submit", handleSubmit));
}
