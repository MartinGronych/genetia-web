// Aktivní položka v menu podle URL
(function(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[data-href]').forEach(a=>{
    if(a.getAttribute('href') === path || (path==='' && a.getAttribute('href')==='index.html')){
      a.classList.add('active');
      a.setAttribute('aria-current','page');
    }
  });
})();