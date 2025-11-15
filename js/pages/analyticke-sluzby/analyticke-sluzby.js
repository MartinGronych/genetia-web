// ==================================================
// GENETIA – Analytické služby (Page Entry)
// ==================================================
import { initNavigation } from "../../components/nav.js";
import { initFaqFade } from "./faq-fade.js";

document.addEventListener("DOMContentLoaded", async () => {
  await initNavigation();
  initFaqFade();  
  console.log("✅ Analytické služby – logika načtena");
});
