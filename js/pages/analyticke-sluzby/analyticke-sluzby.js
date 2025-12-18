// ==================================================
// GENETIA – Analytické služby (Page Entry)
// ==================================================
import { initNavigation } from "../../components/nav.js";
import { initFaqFade } from "./faq-fade.js";
import { initPanelDetailModal } from "./panelDetailModal.js";
import { initScrollyVideo } from "./scrolly-video.js";


document.addEventListener("DOMContentLoaded", async () => {
  await initNavigation();
  initFaqFade();  
  initPanelDetailModal();
  initScrollyVideo();
  console.log("✅ Analytické služby – logika načtena");
});
