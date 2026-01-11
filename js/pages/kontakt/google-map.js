// ==================================================
// GENETIA – Google Maps (Kontakt)
// - Dynamic library import
// - AdvancedMarkerElement s vlastním logem
// ==================================================
/*
const MAPS_API_KEY = "VLOZ_SEM_API_KEY";
const MAP_ID = "VLOZ_SEM_MAP_ID"; // doporučeno pro Advanced Markers

// Souřadnice (Zlatníky–Hodkovice) – můžeš později upřesnit přes geocoding
const GENETIA_POS = { lat: 49.9819, lng: 14.4172 };

function loadGoogleMaps(apiKey) {
  // Google doporučuje inline bootstrap loader (dynamic import). :contentReference[oaicite:0]{index=0}
  return new Promise((resolve, reject) => {
    if (window.google?.maps?.importLibrary) return resolve();

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey
    )}&v=weekly`;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google Maps API load failed"));
    document.head.appendChild(script);
  });
}

export async function initContactMap() {
  const el = document.getElementById("contactMap");
  if (!el) return;

  await loadGoogleMaps(MAPS_API_KEY);

  // Načti knihovny
  const { Map } = await google.maps.importLibrary("maps"); :contentReference[oaicite:1]{index=1}
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker"); :contentReference[oaicite:2]{index=2}

  const map = new Map(el, {
    center: GENETIA_POS,
    zoom: 16,
    mapId: MAP_ID, // doporučeno pro advanced markers :contentReference[oaicite:3]{index=3}
    gestureHandling: "cooperative",
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeControl: false,
  });

  // Logo pin (vlastní content)
  const logo = document.createElement("img");
  logo.src = "assets/images/logo/GENETIA-LOGO.png"; // uprav cestu, pokud máš jinou
  logo.alt = "Genetia";
  logo.width = 44;
  logo.height = 44;
  logo.style.borderRadius = "12px";
  logo.style.boxShadow = "0 10px 25px rgba(0,0,0,0.18)";
  logo.style.background = "rgba(255,255,255,0.9)";
  logo.style.padding = "6px";

  new AdvancedMarkerElement({
    map,
    position: GENETIA_POS,
    title: "Genetia Production s.r.o.",
    content: logo, // vlastní grafika markeru :contentReference[oaicite:4]{index=4}
  });
}
*/