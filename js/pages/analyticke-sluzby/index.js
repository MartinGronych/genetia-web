// ==================================================
// GENETIA – Analytické služby (Page Entry)
// ==================================================
import { initNavigation } from "../../components/nav.js";
import { initModal } from "../../components/modal.js";

document.addEventListener("DOMContentLoaded", async () => {
  await initNavigation();
  initModal();  
  console.log("✅ Analytické služby – logika načtena");
});
