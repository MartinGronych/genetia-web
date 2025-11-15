// ==================================================
// GENETIA – Analytické služby (Page Entry)
// ==================================================
import { initNavigation } from "../../components/nav.js";
import { initFaqFade } from "./faq-fade.js";
import { initPanelDetailModal } from "./panelDetailModal.js";


document.addEventListener("DOMContentLoaded", async () => {
  await initNavigation();
  initFaqFade();  
  initPanelDetailModal();
  console.log("✅ Analytické služby – logika načtena");
});
