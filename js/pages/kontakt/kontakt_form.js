// ==================================================
// GENETIA – Kontakt formulář (Google Forms submit + reCAPTCHA v3)
// - bez reloadu stránky
// - POST přes fetch() na Google Forms (mode: "no-cors")
// - podpora checkboxů (multi-select) => stejný entry se posílá víckrát
// - zachová stávající HTML strukturu i styly
// - reCAPTCHA v3 token generovaný těsně před odesláním
// ==================================================

const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/u/0/d/e/1FAIpQLScCwMmam2yAdZLizM7V1EQvxQPHZ5ptrWIZsi3dBQGKXX17kg/formResponse";

const RECAPTCHA_SITE_KEY = "6LfQIEssAAAAAN3DqeHfBorWfimvwwrAV8AL6J9";
const RECAPTCHA_ACTION = "kontakt_submit";

// Mapování: HTML -> Google Forms entry.xxxxxx
const ENTRY = {
  INTEREST: "800979782", // checkbox otázka (multi)
  NAME: "1752432582", // name="name"
  EMAIL: "1394918679", // name="_replyto"
  SUBJECT: "1925485060", // name="subject"
  MESSAGE: "240623587", // name="message"
  RECAPTCHA: "1208686841", // reCAPTCHA (předvyplněný odkaz -> entry.1208686841)
};

// Texty musí přesně odpovídat volbám v Google Form
const INTEREST_LABELS = {
  EXTRAKTY: "Požaduji výrobu konopných extraktů",
  ANALYZY: "Požaduji analytické služby",
};

function pickInterests(formEl) {
  const cbExtr = formEl.querySelector('[data-interest="extrakty"]');
  const cbAnal = formEl.querySelector('[data-interest="analyzy"]');

  const picked = [];
  if (cbExtr?.checked) picked.push(INTEREST_LABELS.EXTRAKTY);
  if (cbAnal?.checked) picked.push(INTEREST_LABELS.ANALYZY);
  return picked;
}

function buildInterestSummary(interests) {
  if (interests.length === 2)
    return "Výroba konopných extraktů + Analytické služby";
  if (interests[0] === INTEREST_LABELS.EXTRAKTY)
    return "Výroba konopných extraktů";
  if (interests[0] === INTEREST_LABELS.ANALYZY) return "Analytické služby";
  return "Nezvoleno";
}

function getInlineMessageEl(formEl) {
  const el = document.getElementById("formInlineMessage");
  if (el) return el;

  const fallback = document.createElement("div");
  fallback.id = "formInlineMessage";
  fallback.className = "form-inline-message";
  fallback.hidden = true;
  formEl.appendChild(fallback);
  return fallback;
}

function setInlineMessage(el, msg, type = "info") {
  el.hidden = false;
  el.textContent = msg;

  el.style.borderColor =
    type === "success"
      ? "rgba(47, 122, 75, 0.25)"
      : type === "error"
      ? "rgba(190, 30, 45, 0.28)"
      : "rgba(47, 122, 75, 0.18)";

  el.style.background =
    type === "success"
      ? "rgba(47, 122, 75, 0.08)"
      : type === "error"
      ? "rgba(190, 30, 45, 0.06)"
      : "rgba(47, 122, 75, 0.06)";

  el.style.color =
    type === "error" ? "rgba(120, 15, 25, 0.88)" : "rgba(8, 20, 12, 0.75)";
}

function clearInlineMessage(el) {
  el.hidden = true;
  el.textContent = "";
}

function setRecaptchaHiddenValue(token) {
  const tokenInput = document.getElementById("recaptchaToken");
  if (tokenInput) tokenInput.value = token || "";
}

async function getRecaptchaToken() {
  if (!window.grecaptcha || !grecaptcha.execute) {
    console.warn("[reCAPTCHA] grecaptcha not ready");
    return "";
  }

  try {
    await grecaptcha.ready(() => {});
    return await grecaptcha.execute(
      "6LfQIessAAAAAN3DqeHfBorWfimvwwrAV8AL6J9",
      { action: "kontakt_submit" }
    );
  } catch (err) {
    console.warn("[reCAPTCHA] Token generation failed", err);
    return "";
  }
}




function buildPayload(formEl, recaptchaToken) {
  const fd = new FormData(formEl);

  const name = (fd.get("name") || "").toString().trim();
  const email = (fd.get("_replyto") || "").toString().trim();
  const subject = (fd.get("subject") || "").toString().trim();
  const message = (fd.get("message") || "").toString().trim();

  const interests = pickInterests(formEl);
  const summary = buildInterestSummary(interests);

  const hidden = formEl.querySelector('input[name="interest_summary"]');
  if (hidden) hidden.value = summary;

  const params = new URLSearchParams();
  params.set(`entry.${ENTRY.NAME}`, name);
  params.set(`entry.${ENTRY.EMAIL}`, email);
  params.set(`entry.${ENTRY.SUBJECT}`, subject);
  params.set(`entry.${ENTRY.MESSAGE}`, message);

  interests.forEach((val) => params.append(`entry.${ENTRY.INTEREST}`, val));

  // ✅ reCAPTCHA token do Google Formu
  if (recaptchaToken) {
    params.set(`entry.${ENTRY.RECAPTCHA}`, recaptchaToken);
  }

  params.set("fvv", "1");
  params.set("fbzx", String(Date.now()));
  return params;
}

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

    // === reCAPTCHA v3 token (těsně před odesláním) ===
    const recaptchaToken = await getRecaptchaToken();

    // (volitelné) když chceš token vyžadovat, odkomentuj:
    // if (!recaptchaToken) {
    //   setInlineMessage(msgEl, "Ověření reCAPTCHA se nezdařilo. Zkuste to prosím znovu.", "error");
    //   return;
    // }

    // volitelné: uložit token i do hidden inputu (pro debug / konzistenci)
    setRecaptchaHiddenValue(recaptchaToken);

    // payload (včetně tokenu do Google Forms přes entry.1208686841)
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

      // po resetu vrať hidden summary + recaptcha token
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
