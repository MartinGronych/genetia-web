// ==================================================
// GENETIA – Scrolly Video (HERO-position driven, stable)
// --------------------------------------------------
// ▸ Kompatibilní s _scrolly-video.css (mobile-first sticky)
// ▸ Ztmívání/rozjasnění pouze když je video viditelné
// ▸ NOVĚ: dimming podle pozice HERO vůči viewportu (baseline při loadu)
// ▸ Stabilní i pro tah scrollbar / klávesy / trackpad
// ▸ Řídí CSS proměnnou: --sv-dim na #scrolly-video
// ==================================================

export function initScrollyVideo() {
  const scrolly = document.getElementById("scrolly-video");
  if (!scrolly) return;

  const sticky = scrolly.querySelector(".scrolly-video_sticky");
  if (!sticky) return;

  // HERO – podle něj řídíme dimming (může být v contentu)
  const getHero = () =>
    scrolly.querySelector(".hero-analyticke") ||
    document.querySelector(".hero-analyticke");

  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const smoothstep = (t) => t * t * (3 - 2 * t);

  // Nastavení efektu (doladíme prahy později)
  const MIN_DIM = 0.02;
  const MAX_DIM = 0.78;
  const SMOOTH = 0.12;

  let current = MIN_DIM;

  // baseline = top pozice HERO při loadu (po prvním layoutu)
  let baselineHeroTop = null;

  const getNavHeight = () => {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue("--nav-height")
      .trim();
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 72;
  };

  const getStickyVisibility = () => {
    const rect = sticky.getBoundingClientRect();
    const navH = getNavHeight();
    const topLimit = navH;
    const vh = window.innerHeight || 1;

    const visiblePx = Math.min(rect.bottom, vh) - Math.max(rect.top, topLimit);
    const ratio = visiblePx / Math.max(1, rect.height);

    return clamp01(ratio);
  };

  const setBaseline = () => {
    const hero = getHero();
    if (!hero) return;
    baselineHeroTop = hero.getBoundingClientRect().top;
  };

  // Progress:
  // 0 = hero je na baseline (světlo)
  // 1 = hero je u horní hrany (pod nav) (tma)
  const getHeroProgress = () => {
    const hero = getHero();
    if (!hero) return 0;

    const heroTop = hero.getBoundingClientRect().top;
    const navH = getNavHeight();
    const endOffset =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--sv-end-offset"
        )
      ) || 10;

    const endTop = navH + endOffset;

    // baseline se založí, pokud ještě není (fallback)
    if (baselineHeroTop === null) baselineHeroTop = heroTop;

    const denom = Math.max(1, baselineHeroTop - endTop);
    return clamp01((baselineHeroTop - heroTop) / denom);
  };

  const update = () => {
    // 1) pokud video není vidět -> žádné dimming (drž baseline)
    const vis = getStickyVisibility();
    if (vis <= 0.01) {
      current = MIN_DIM;
      scrolly.style.setProperty("--sv-dim", current.toFixed(3));
      return;
    }

    // 2) progress podle pozice HERO
    const heroP = getHeroProgress();

    // 3) křivka + váha viditelnosti
    const shaped = smoothstep(heroP) * smoothstep(vis);
    const target = MIN_DIM + (MAX_DIM - MIN_DIM) * shaped;

    // 4) smoothing
    current = current + (target - current) * SMOOTH;

    scrolly.style.setProperty("--sv-dim", current.toFixed(3));
  };

  // --- init baseline po layoutu (spolehlivé) ---
  requestAnimationFrame(() => {
    setBaseline();
    update();
  });

  // Watcher pro případy, kdy se scroll event nespouští (např. tah scrollbar)
  let lastScrollTop = -1;
  const watchScroll = () => {
    const st =
      document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (st !== lastScrollTop) {
      lastScrollTop = st;
      schedule();
    }
    requestAnimationFrame(watchScroll);
  };
  requestAnimationFrame(watchScroll);

  // --- schedule (rAF throttling) ---
  let rafId = null;
  const schedule = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      update();
    });
  };

  // Listeners: scroll je klíč (funguje i pro scrollbar drag)
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener(
    "resize",
    () => {
      setBaseline();
      schedule();
    },
    { passive: true }
  );

  // Volitelné extra triggery (neškodí, ale scroll už stačí)
  window.addEventListener("wheel", schedule, { passive: true });
  window.addEventListener("touchmove", schedule, { passive: true });

  console.log("🎥 Scrolly video dimming: HERO-position (baseline) aktivní");
}
