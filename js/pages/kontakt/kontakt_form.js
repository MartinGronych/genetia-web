// ==================================================
// GENETIA – Kontakt formulář (Google Forms submit)
// - bez reloadu stránky
// - POST přes fetch() na Google Forms (mode: "no-cors")
// - podpora checkboxů (multi-select) => stejný entry se posílá víckrát
// - zachová stávající HTML strukturu i styly
// ==================================================

const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/u/0/d/e/1FAIpQLScCwMmam2yAdZLizM7V1EQvxQPHZ5ptrWIZsi3dBQGKXX17kg/formResponse";

// Mapování: HTML -> Google Forms entry.xxxxxx
const ENTRY = {
  INTEREST: "800979782", // checkbox otázka (multi)
  NAME: "1752432582", // name="name"
  EMAIL: "1394918679", // name="_replyto"
  SUBJECT: "1925485060", // name="subject"
  MESSAGE: "240623587", // name="message"
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
  return picked; // může být i []
}

function buildInterestSummary(interests) {
  if (interests.length === 2) return "Výroba konopných extraktů + Analytické služby";
  if (interests[0] === INTEREST_LABELS.EXTRAKTY) return "Výroba konopných extraktů";
  if (interests[0] === INTEREST_LABELS.ANALYZY) return "Analytické služby";
  return "Nezvoleno";
}

function getInlineMessageEl(formEl) {
  // používáme existující box z HTML (#formInlineMessage) :contentReference[oaicite:3]{index=3}
  const el = document.getElementById("formInlineMessage");
  if (el) return el;

  // fallback (kdyby někdo box smazal)
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

  // jemné odlišení bez zásahu do CSS (inline)
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

function buildPayload(formEl) {
  const fd = new FormData(formEl);

  const name = (fd.get("name") || "").toString().trim();
  const email = (fd.get("_replyto") || "").toString().trim();
  const subject = (fd.get("subject") || "").toString().trim();
  const message = (fd.get("message") || "").toString().trim();

  const interests = pickInterests(formEl);
  const summary = buildInterestSummary(interests);

  // souhrn do hidden pole (máš v HTML) :contentReference[oaicite:4]{index=4}
  const hidden = formEl.querySelector('input[name="interest_summary"]');
  if (hidden) hidden.value = summary;

  const params = new URLSearchParams();
  params.set(`entry.${ENTRY.NAME}`, name);
  params.set(`entry.${ENTRY.EMAIL}`, email);
  params.set(`entry.${ENTRY.SUBJECT}`, subject);
  params.set(`entry.${ENTRY.MESSAGE}`, message);

  // Checkbox multi-select: stejný entry id přidáme víckrát
  interests.forEach((val) => params.append(`entry.${ENTRY.INTEREST}`, val));

  // minimální meta (bez cookies, bez dlut, bez partialResponse)
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

  // při změně checkboxů smaž hlášku
  form.querySelectorAll("[data-interest]").forEach((cb) => {
    cb.addEventListener("change", () => clearInlineMessage(msgEl));
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearInlineMessage(msgEl);

    // respektujeme HTML5 validaci :contentReference[oaicite:5]{index=5}
    if (!form.checkValidity()) {
      form.reportValidity();
      setInlineMessage(msgEl, "Zkontrolujte prosím vyplněná pole.", "error");
      return;
    }

    // honeypot (antispam) :contentReference[oaicite:6]{index=6}
    const gotcha = form.querySelector('input[name="_gotcha"]');
    if (gotcha && gotcha.value.trim().length) return;

    const params = buildPayload(form);

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

      // po resetu vrať hidden summary
      const hidden = form.querySelector('input[name="interest_summary"]');
      if (hidden) hidden.value = "Nezvoleno";
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
        submitBtn.textContent = submitBtn.dataset.originalText || "Odeslat zprávu";
        delete submitBtn.dataset.originalText;
      }
    }
  });
}
