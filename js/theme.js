document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  if (!toggle) return; // ochrana

  // Načti uložený režim
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    html.setAttribute('data-theme', 'dark');
    toggle.checked = true;
  } else {
    html.setAttribute('data-theme', 'light');
  }

  // Přepnutí
  toggle.addEventListener('change', () => {
    if (toggle.checked) {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });
});
