// ==================================================
// USP DETAIL MODAL – plnění z assets/data/usp.json
// ==================================================

const DATA_URL = "data/usp.json";

let cache = null;

async function getData() {
  if (cache) return cache;
  const res = await fetch(DATA_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`USP JSON load failed: ${res.status}`);
  cache = await res.json();
  return cache;
}

function renderMedia(media) {
  if (!media) return "";

  if (media.type === "image") {
    const alt = media.alt || "";
    return `<img class="img-fluid rounded-3" src="${media.src}" alt="${alt}">`;
  }

  if (media.type === "video") {
    const poster = media.poster ? ` poster="${media.poster}"` : "";
    const caption = media.caption
      ? `<div class="small mt-2 opacity-75">${media.caption}</div>`
      : "";
    return `
      <video class="w-100 rounded-3" controls playsinline${poster}>
        <source src="${media.src}" type="video/mp4">
      </video>
      ${caption}
    `;
  }

  return "";
}

function fillModal(item) {
  document.getElementById("uspModalTitle").textContent = item.title || "";
  document.getElementById("uspModalLead").textContent = item.lead || "";

  const mediaWrap = document.getElementById("uspModalMedia");
  mediaWrap.innerHTML = renderMedia(item.media);
  mediaWrap.style.display = item.media ? "" : "none";

  const paragraphs = (item.paragraphs || []).map((p) => `<p>${p}</p>`).join("");
  const bullets =
    item.bullets && item.bullets.length
      ? `<ul>${item.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>`
      : "";

  document.getElementById("uspModalBody").innerHTML = `${paragraphs}${bullets}`;

  const anchorBtn = document.getElementById("uspModalAnchorBtn");

  if (anchorBtn) {
    if (item.anchor) {
      anchorBtn.href = item.anchor;
      anchorBtn.classList.remove("d-none");
    } else {
      anchorBtn.classList.add("d-none");
    }
  }
}

export function initUspDetailModal() {
  document.addEventListener("click", async (e) => {
    const trigger = e.target.closest("[data-usp-id]");
    if (!trigger) return;

    const uspId = trigger.getAttribute("data-usp-id");
    const data = await getData();
    const item = (data.items || []).find((x) => x.id === uspId);
    if (!item) return;

    fillModal(item);
  });
}
