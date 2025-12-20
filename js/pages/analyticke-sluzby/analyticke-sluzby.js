// ==================================================
// GENETIA – Analytické služby (Page Entry)
// ==================================================
import { initNavigation } from "../../components/nav.js";
import { initFaqFade } from "./faq-fade.js";
import { initPanelDetailModal } from "./panelDetailModal.js";
import { initScrollyVideo } from "./scrolly-video.js";
import { initUspBar } from "./usp-render.js";
import { initUspDetailModal } from "./uspDetailModal.js";
import { initUspReveal } from "./usp-reveal.js";


document.addEventListener("DOMContentLoaded", async () => {
  await initNavigation();
  initFaqFade();  
  initPanelDetailModal();
  initScrollyVideo();
  await initUspBar();
  initUspDetailModal();
  initUspReveal();
  console.log("✅ Analytické služby – logika načtena");
});
