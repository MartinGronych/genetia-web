// Gate pro sekci "Lékaři, lékárny" na /produkty.html
(function(){
  const guardLinks = document.querySelectorAll('[data-requires-professional]');
  const modalEl = document.getElementById('gateModal');
  if(!guardLinks.length || !modalEl) return;

  guardLinks.forEach(el => {
    el.addEventListener('click', (e)=>{
      e.preventDefault();
      const m = new bootstrap.Modal(modalEl);
      // Po potvrzení přesměrujeme na anchor "#pro-odborniky"
      modalEl.querySelector('[data-continue]')?.addEventListener('click', ()=>{
        m.hide();
        // přepnout na správnou záložku (hash)
        const target = document.querySelector('#pro-odborniky-tab');
        if(target){ new bootstrap.Tab(target).show(); }
        // scroll to tab content
        document.getElementById('pro-odborniky')?.scrollIntoView({behavior:'smooth'});
      }, { once:true });
      m.show();
    });
  });
})();

document.getElementById('denyAccess')?.addEventListener('click', () => {
    setTimeout(() => {
  window.location.href = 'index.html';
  }, 500);
});

// === Aktivace modálu při kliknutí na oko v carouselu ===
document.addEventListener('click', (e) => {
  const eyeIcon = e.target.closest('.eye-icon');
  if (!eyeIcon) return; // klik mimo oko

  e.preventDefault();

  // otevři Bootstrap modal (používáme existující #gateModal)
  const gateModal = document.getElementById('gateModal');
  if (!gateModal) return;

  const modalInstance = new bootstrap.Modal(gateModal);
  modalInstance.show();
});