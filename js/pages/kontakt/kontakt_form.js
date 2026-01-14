// ==================================================
// GENETIA – Kontakt formulář (Formspree routing)
// - přepíná endpoint podle zaškrtnutých filtrů
// ==================================================

function applyContactRouting(formEl) {
  const cbExtr = formEl.querySelector('[data-interest="extrakty"]');
  const cbAnal = formEl.querySelector('[data-interest="analyzy"]');

  const base = formEl.dataset.endpoint;
  const epExtr = formEl.dataset.endpointExtrakty || base;
  const epAnal = formEl.dataset.endpointAnalyzy || base;
  const epBoth = formEl.dataset.endpointBoth || base;

  const pickedExtr = !!cbExtr?.checked;
  const pickedAnal = !!cbAnal?.checked;

  // vyber cílový endpoint
  let target = base;
  if (pickedExtr && pickedAnal) target = epBoth;
  else if (pickedExtr) target = epExtr;
  else if (pickedAnal) target = epAnal;

  // ✅ klasický submit: nastav action
  formEl.setAttribute("action", target);

  // ✅ souhrn do hidden pole (ať je to vidět v emailu)
  const summary =
    pickedExtr && pickedAnal
      ? "Výroba konopných extraktů + Analytické služby"
      : pickedExtr
      ? "Výroba konopných extraktů"
      : pickedAnal
      ? "Analytické služby"
      : "Nezvoleno";

  const hidden = formEl.querySelector('input[name="interest_summary"]');
  if (hidden) hidden.value = summary;

  return { target, summary };
}

export function initKontaktFormRouting() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  // init hned po loadu
  applyContactRouting(form);

  // při změně checkboxů
  const interests = form.querySelectorAll("[data-interest]");
  interests.forEach((cb) => {
    cb.addEventListener("change", () => applyContactRouting(form));
  });

  // pojistka před odesláním (kdyby někdo klikl rychle)
  form.addEventListener(
    "submit",
    () => {
      applyContactRouting(form);
    },
    { capture: true }
  );
}
