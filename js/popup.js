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