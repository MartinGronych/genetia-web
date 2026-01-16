// ==================================================
// GENETIA – Kontakt formulář (Google Forms + Routing + reCAPTCHA Enterprise v3)
// Autor: Martin Gronych (produkční verze)
// --------------------------------------------------
// - Odeslání bez reloadu přes fetch() -> Google Forms formResponse
// - Multi-select checkboxy (stejné entry id opakovaně)
// - reCAPTCHA Enterprise v3 token posílán do Google Form pole "recaptcha_token"
// - Inline success / error message
// ==================================================

// === Google Form endpoint (formResponse) ===
const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/u/0/d/e/1FAIpQLScCwMmam2yAdZLizM7V1EQvxQPHZ5ptrWIZsi3dBQGKXX17kg/formResponse";

// === Mapování entry.* podle DevTools (Payload) ===
const ENTRY = {
  NAME: "1752432582",
  EMAIL: "1394918679",
  SUBJECT: "1925485060",
  MESSAGE: "240623587",
  INTEREST: "800979782",
  RECAPTCHA: "1208686841", // <- recaptcha_token (z tvého pp_url odkazu)
};

// === reCAPTCHA Enterprise ===
const RECAPTCHA_SITE_KEY = "6LfQlEssAAAAAN3DqeHfBorWfimvwvwrAV8AL6J9";
const RECAPTCHA_ACTION = "kontakt_submit";

const OPT_EXTRAKTY = "Požaduji výrobu konopných extraktů";
const OPT_ANALYZY = "Požaduji analytické služby";

// ---------- UI helpers ----------
function getInlineMessageEl(formEl) {
  let el = formEl.querySelector(".contact-form_message");
  if (!el) {
    el = document.createElement("div");
    el.className = "contact-form_message";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    // vložíme nad button (bez zásahu do layoutu)
    const btn = formEl.querySelector('button[type="submit"]');
    if (btn && btn.parentElement) btn.parentElement.prepend(el);
    else formEl.appendChild(el);
  }
  return el;
}

function setInlineMessage(el, text, type = "info") {
  if (!el) return;
  el.textContent = text;
  el.dataset.type = type; // můžeš stylovat v CSS (success/error)
}

function clearInlineMessage(el) {
  if (!el) return;
  el.textContent = "";
  delete el.dataset.type;
}

function setRecaptchaHiddenValue(value) {
  const tokenInput = document.getElementById("recaptchaToken");
  if (tokenInput) tokenInput.value = value || "";
}

// ---------- Interest helpers ----------
function pickInterests(formEl) {
  const picked = [];

  const cbExtr = formEl.querySelector('[data-interest="extrakty"]');
  const cbAnal = formEl.querySelector('[data-interest="analyzy"]');

  if (cbExtr?.checked) picked.push(OPT_EXTRAKTY);
  if (cbAnal?.checked) picked.push(OPT_ANALYZY);

  return picked;
}

function buildInterestSummary(interests) {
  if (!interests || !interests.length) return "Nezvoleno";
  return interests.join(" + ");
}

// ---------- reCAPTCHA Enterprise token ----------
async function getRecaptchaToken() {
  const g = window.grecaptcha;

  // Enterprise script ještě nedoběhl / není načten
  if (!g || !g.enterprise || typeof g.enterprise.execute !== "function") {
    console.warn("[reCAPTCHA] enterprise not loaded");
    return "";
  }

  // grecaptcha.enterprise.ready je callback-based → převedeme na Promise
  await new Promise((resolve) => {
    try {
      g.enterprise.ready(resolve);
    } catch {
      resolve();
    }
  });

  try {
    const token = await g.enterprise.execute(RECAPTCHA_SITE_KEY, {
      action: RECAPTCHA_ACTION,
    });
    return token || "";
  } catch (err) {
    console.warn("[reCAPTCHA] Token generation failed", err);
    return "";
  }
}

// ---------- Payload builder ----------
function buildPayload(formEl, recaptchaToken) {
  const fd = new FormData(formEl);

  const name = (fd.get("name") || "").toString().trim();
  const email = (fd.get("_replyto") || "").toString().trim();
  const subject = (fd.get("subject") || "").toString().trim();
  const message = (fd.get("message") || "").toString().trim();

  const interests = pickInterests(formEl);
  const summary = buildInterestSummary(interests);

  // souhrn do hidden pole (máš v HTML)
  const hidden = formEl.querySelector('input[name="interest_summary"]');
  if (hidden) hidden.value = summary;

  // token do hidden (pro UI/debug)
  setRecaptchaHiddenValue(recaptchaToken);

  const params = new URLSearchParams();

  params.set(`entry.${ENTRY.NAME}`, name);
  params.set(`entry.${ENTRY.EMAIL}`, email);
  params.set(`entry.${ENTRY.SUBJECT}`, subject);
  params.set(`entry.${ENTRY.MESSAGE}`, message);

  // Checkbox multi-select: stejný entry id přidáme víckrát
  interests.forEach((val) => params.append(`entry.${ENTRY.INTEREST}`, val));

  // reCAPTCHA token -> Google Form field "recaptcha_token"
  if (recaptchaToken) {
    params.set(`entry.${ENTRY.RECAPTCHA}`, recaptchaToken);
  }

  // minimální meta (bez cookies, bez dlut, bez partialResponse)
  params.set("fvv", "1");
  params.set("fbzx", String(Date.now()));

  return params;
}

// ---------- Submit ----------
async function submitToGoogleForms(params) {
  // no-cors = nelze číst odpověď, ale request odejde (statické hostování OK)
  await fetch(GOOGLE_FORM_ACTION, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: params.toString(),
  });
}

export function initKontaktFormRouting() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const msgEl = getInlineMessageEl(form);
  const submitBtn = form.querySelector('button[type="submit"]');

  // při změně checkboxů smaž hlášku
  form.querySelectorAll("[data-interest]").forEach((cb) => {
    cb.addEventListener("change", () => clearInlineMessage(msgEl));
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearInlineMessage(msgEl);

    // respektujeme HTML5 validaci
    if (!form.checkValidity()) {
      form.reportValidity();
      setInlineMessage(msgEl, "Zkontrolujte prosím vyplněná pole.", "error");
      return;
    }

    // honeypot (antispam)
    const gotcha = form.querySelector('input[name="_gotcha"]');
    if (gotcha && gotcha.value.trim().length) return;

    // === reCAPTCHA token těsně před odesláním ===
    const recaptchaToken = await getRecaptchaToken();

    // pokud chceš token vyžadovat (doporučeno), nech tohle zapnuté:
    if (!recaptchaToken) {
      setInlineMessage(
        msgEl,
        "Ověření reCAPTCHA se nezdařilo. Obnovte stránku a zkuste to prosím znovu.",
        "error"
      );
      return;
    }

    const params = buildPayload(form, recaptchaToken);

    // UX: disable během submitu
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.originalText = submitBtn.textContent;
      submitBtn.textContent = "Odesílám…";
    }

    try {
      await submitToGoogleForms(params);

      // Optimistický success (no-cors neumožní přečíst status)
      setInlineMessage(
        msgEl,
        "Děkujeme! Zpráva byla odeslána. Ozveme se vám co nejdříve.",
        "success"
      );

      form.reset();

      // po resetu vrať hidden summary + token
      const summaryHidden = form.querySelector('input[name="interest_summary"]');
      if (summaryHidden) summaryHidden.value = "Nezvoleno";
      setRecaptchaHiddenValue("");
    } catch (err) {
      console.error("[GENETIA][contact][form] submit failed", err);
      setInlineMessage(
        msgEl,
        "Odeslání se nepodařilo. Zkontrolujte připojení a zkuste to prosím znovu.",
        "error"
      );
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent =
          submitBtn.dataset.originalText || "Odeslat zprávu";
        delete submitBtn.dataset.originalText;
      }
    }
  });
}
